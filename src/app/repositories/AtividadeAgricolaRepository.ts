import { format } from 'date-fns';
import database from '../../database';
import { InputsBySafraDomain } from '../../types/AtividadeAgricolaTypes';
import AtividadeAgricolaMapper from './mappers/AtividadeAgricolaMapper';

interface FindInputsBySafraArgs {
  idSafra: string;
  idTalhao?: number;
  startDate?: Date;
  endDate?: Date;
}

class AtividadeAgricolaRepository {
  findInputsBySafra({ idSafra, idTalhao, startDate, endDate }: FindInputsBySafraArgs) {
    return new Promise<InputsBySafraDomain[]>((resolve, reject) => {
      database.query(
        `
        select
          produto_almoxarifado.nome as insumo,
          cast(sum(
            (cast(agri_atv_talhao_safra.proporcao as numeric(15,5)) / 100) *
            (agri_atv_insumo.qtde * agri_atv_insumo.custo_medio)
          ) as numeric(15,2)) as total,
          cast(sum(
            (cast(agri_atv_talhao_safra.proporcao as numeric(15,5)) / 100) *
            (agri_atv_insumo.qtde)
          ) as numeric(15,2)) as quantidade,
          unidade.sigla as unidade
        from agri_atv_insumo
        inner join agri_atv on agri_atv.id = agri_atv_insumo.id_agri_atv
        inner join agri_atv_talhao_safra on agri_atv_talhao_safra.id_agri_atv = agri_atv.id
        inner join produto_almoxarifado on produto_almoxarifado.id = agri_atv_insumo.id_produto_almoxarifado
        inner join unidade on unidade.id = agri_atv_insumo.id_unidade
        where agri_atv.id_ciclo_producao in (${idSafra})
        ${idTalhao ? `and agri_atv_talhao_safra.id_talhao_safra = ${idTalhao}` : ''}
        ${startDate ? `and agri_atv.data_inicio >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and agri_atv.data_inicio <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        group by insumo, unidade
        order by total desc
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AtividadeAgricolaMapper.toInputsBySafraDomain(item)));
        }
      );
    });
  }
}

export default new AtividadeAgricolaRepository();
