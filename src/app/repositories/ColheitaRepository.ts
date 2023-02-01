import database from '../../database';
import { TotalDomain } from '../../types/ColheitaTypes';
import ColheitaMapper from './mappers/ColheitaMapper';

class ColheitaRepository {
  findTotal(idSafra: number) {
    return new Promise<TotalDomain[]>((resolve, reject) => {
      database.query(
        `
        select
          coalesce(sum(colheita_talhao.peso_liquido + colheita_talhao.cota_desc_kg + colheita_talhao.taxa_recepcao_desc_kg), 0) as total_producao,
          talhao.descricao as talhao,
          talhao_safra.hectares as tamanho_talhao
        from colheita_talhao
        left join colheita on colheita.id = colheita_talhao.id_colheita
        right join talhao_safra on talhao_safra.id = colheita_talhao.id_talhao_safra
        right join talhao on talhao.id = talhao_safra.id_talhao
        where talhao_safra.id_ciclo_producao = ${idSafra}
        group by talhao, tamanho_talhao
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map(item => ColheitaMapper.toTotalDomain(item)));
        }
      );
    });
  }
}

export default new ColheitaRepository();
