import database from '../../database';
import { CulturaDomain } from '../../types/CulturaTypes';
import CulturaMapper from './mappers/CulturaMapper';

class CulturaRepository {
  findAll(databaseName: string) {
    return new Promise<CulturaDomain[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select id, nome from cultura
        where cultura = 1
        order by nome
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((cultura) => CulturaMapper.toDomain(cultura)));
        },
      );
    });
  }
}

export default new CulturaRepository();
