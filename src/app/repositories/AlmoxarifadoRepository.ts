import database from '../../database';
import AlmoxarifadoMapper from './mappers/AlmoxarifadoMapper';

class AlmoxarifadoRepository {
  findAll(databaseName: string) {
    return new Promise((resolve, reject) => {
      database.query(
        databaseName,
        `
        SELECT * FROM almoxarifado
        WHERE status = 1
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AlmoxarifadoMapper.toDomain(item)));
        },
      );
    });
  }
}

export default new AlmoxarifadoRepository();
