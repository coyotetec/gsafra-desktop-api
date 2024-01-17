import database from '../../database';
import TipoPatrimonioMapper from './mappers/TipoPatrimonioMapper';

class TipoPatrimonioRepository {
  findAll(databaseName: string) {
    return new Promise((resolve, reject) => {
      database.query(
        databaseName,
        `
        SELECT * FROM tipo_patrimonio
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => TipoPatrimonioMapper.toDomain(item)));
        },
      );
    });
  }
}

export default new TipoPatrimonioRepository();
