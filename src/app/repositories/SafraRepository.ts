import database from '../../database';
import SafraMapper from './mappers/SafraMapper';

import { SafraDomain } from '../../types/SafraTypes';

class SafraRepository {
  findAll() {
    return new Promise<SafraDomain[]>((resolve, reject) => {
      database.query(
        `
        SELECT * FROM ciclo_producao
        WHERE status = 1
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
