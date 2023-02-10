import database from '../../database';
import { TalhaoDomain } from '../../types/TalhaoTypes';
import TalhaoMapper from './mappers/TalhaoMapper';

class SafraRepository {
  findAll(idSafra: string) {
    return new Promise<TalhaoDomain[]>((resolve, reject) => {
      database.query(
        `
        select
          talhao_safra.id,
          talhao.descricao as talhao,
          variedade.nome as variedade,
          ciclo_producao.nome as safra
        from talhao_safra
        left join talhao on talhao.id = talhao_safra.id_talhao
        left join variedade on variedade.id = talhao_safra.id_variedade
        left join ciclo_producao on ciclo_producao.id = talhao_safra.id_ciclo_producao
        where talhao_safra.status = 1
        and talhao_safra.id_ciclo_producao in (${idSafra})
        order by talhao, variedade
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => TalhaoMapper.toDomain(item)));
        }
      );
    });
  }

  findArea(idSafra: string, idTalhao?: number) {
    return new Promise<number>((resolve, reject) => {
      database.query(
        `
        select
          sum(talhao_safra.hectares) as area
        from talhao_safra
        where talhao_safra.id_ciclo_producao in (${idSafra})
        ${idTalhao ? `and talhao_safra.id = ${idTalhao}` : ''}
        `, [],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(result.AREA);
        }
      );
    });
  }
}

export default new SafraRepository();
