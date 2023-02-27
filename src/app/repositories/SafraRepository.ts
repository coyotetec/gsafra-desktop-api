import database from '../../database';
import SafraMapper from './mappers/SafraMapper';

import { SafraDomain } from '../../types/SafraTypes';

class SafraRepository {
  findAll() {
    return new Promise<SafraDomain[]>((resolve, reject) => {
      database.query(
        `
        select * from ciclo_producao
        where status = 1
        order by nome
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((safra) => SafraMapper.toTotalDomain(safra)));
        }
      );
    });
  }
}

export default new SafraRepository();
