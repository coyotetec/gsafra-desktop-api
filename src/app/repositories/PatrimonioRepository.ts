import database from '../../database';
import PatrimonioMapper from './mappers/PatrimonioMapper';

class PatrimonioRepository {
  findAll(databaseName: string) {
    return new Promise((resolve, reject) => {
      database.query(
        databaseName,
        `
        SELECT * FROM patrimonio
        WHERE status = 1
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => PatrimonioMapper.toDomain(item)));
        },
      );
    });
  }
}

export default new PatrimonioRepository();
