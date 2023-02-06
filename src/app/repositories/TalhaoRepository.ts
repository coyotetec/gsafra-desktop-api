import database from '../../database';
import { TalhaoDomain } from '../../types/TalhaoTypes';
import TalhaoMapper from './mappers/TalhaoMapper';

class SafraRepository {
  findAll(idSafra: number) {
    return new Promise<TalhaoDomain[]>((resolve, reject) => {
      database.query(
        `
        select
          talhao_safra.id,
          talhao.descricao as nome_talhao,
          variedade.nome as nome_variedade
        from talhao_safra
        left join talhao on talhao.id = talhao_safra.id_talhao
        left join variedade on variedade.id = talhao_safra.id_variedade
        where talhao_safra.status = 1
        and talhao_safra.id_ciclo_producao = ${idSafra}
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
}

export default new SafraRepository();
