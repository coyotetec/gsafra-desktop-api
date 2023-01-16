import database from '../../database';
import AlmoxarifadoMapper from './mappers/AlmoxarifadoMapper';

class AlmoxarifadoRepository {
  findAll() {
    return new Promise((resolve, reject) => {
      database.query(
        `
        SELECT * FROM almoxarifado
        WHERE status = 1
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map(item => AlmoxarifadoMapper.toDomain(item)));
        }
      );
    });
  }
}

export default new AlmoxarifadoRepository();
