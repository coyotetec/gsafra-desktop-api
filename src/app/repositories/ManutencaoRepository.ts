import { format } from 'date-fns';
import database from '../../database';
import { InputsBySafraDomain } from '../../types/AtividadeAgricolaTypes';
import ManutencaoMapper from './mappers/ManutencaoMapper';

interface FindInputsBySafraArgs {
  idSafra: number;
  idTalhao?: number;
  startDate?: Date;
  endDate?: Date;
}

class ManutencaoRepository {
  findInputsBySafra({ idSafra, idTalhao, startDate, endDate }: FindInputsBySafraArgs) {
    return new Promise<InputsBySafraDomain[]>((resolve, reject) => {
      database.query(
        `
        select
          produto_almoxarifado.nome as insumo,
          cast(sum(
            (cast(manutencao_m_ciclo_ts.proporcao as numeric(15,8)) / 100) *
            (manutencao_servico_produto.total)
          ) as numeric(15,2)) as total,
          cast(sum(
            (cast(manutencao_m_ciclo_ts.proporcao as numeric(15,8)) / 100) *
            (manutencao_servico_produto.qtde)
          ) as numeric(15,2)) as quantidade
        from manutencao_servico_produto
        left join manutencao_servico on manutencao_servico.id = manutencao_servico_produto.id_manutencao_servico
        left join manutencao_m on manutencao_m.id = manutencao_servico.id_manutencao_m
        left join manutencao_m_ciclo on manutencao_m_ciclo.id_manutencao_m = manutencao_m.id
        left join manutencao_m_ciclo_ts on manutencao_m_ciclo_ts.id_manutencao_m_ciclo = manutencao_m_ciclo.id
        left join produto_almoxarifado on produto_almoxarifado.id = manutencao_servico_produto.id_produto_almoxarifado
        where manutencao_m_ciclo.id_ciclo_producao = ${idSafra}
        ${idTalhao ? `manutencao_m_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
        ${startDate ? `manutencao_m.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `manutencao_m.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        group by insumo
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => ManutencaoMapper.toInputsBySafraDomain(item)));
        }
      );
    });
  }
}

export default new ManutencaoRepository();
