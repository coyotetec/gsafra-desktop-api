import database from '../../database';
import PatrimonioMapper from './mappers/PatrimonioMapper';

class PatrimonioRepository {
  findAll() {
    return new Promise((resolve, reject) => {
      database.query(
        `
        SELECT * FROM patrimonio
        WHERE status = 1
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map(item => PatrimonioMapper.toDomain(item)));
        }
      );
    });
  }
}

export default new PatrimonioRepository();
