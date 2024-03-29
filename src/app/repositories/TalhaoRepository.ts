import database from '../../database';
import { TalhaoDomain } from '../../types/TalhaoTypes';
import TalhaoMapper from './mappers/TalhaoMapper';

class SafraRepository {
  findAll(databaseName: string, idSafra: string) {
    return new Promise<TalhaoDomain[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
          talhao_safra.id,
          talhao.descricao as talhao,
          variedade.nome as variedade,
          ciclo_producao.nome as safra
        from talhao_safra
        inner join talhao on talhao.id = talhao_safra.id_talhao
        inner join variedade on variedade.id = talhao_safra.id_variedade
        inner join ciclo_producao on ciclo_producao.id = talhao_safra.id_ciclo_producao
        where talhao_safra.status = 1
        and talhao_safra.id_ciclo_producao in (${idSafra})
        order by talhao, variedade
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => TalhaoMapper.toDomain(item)));
        },
      );
    });
  }

  findArea(databaseName: string, idSafra: string, idTalhao?: number) {
    return new Promise<number>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
          sum(talhao_safra.hectares) as area
        from talhao_safra
        where talhao_safra.id_ciclo_producao in (${idSafra})
        ${idTalhao ? `and talhao_safra.id = ${idTalhao}` : ''}
        `,
        [],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(result.AREA);
        },
      );
    });
  }
}

export default new SafraRepository();
