import database from '../../database';
import ProdutoAlmoxarifadoMapper from './mappers/ProdutoAlmoxarifadoMapper';

class ProdutoAlmoxarifadoRepository {
  findAllCombustiveis(databaseName: string) {
    return new Promise((resolve, reject) => {
      database.query(
        databaseName,
        `
        SELECT * FROM produto_almoxarifado
        WHERE status = 1
        AND tipo = 3
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(
            result.map((item) =>
              ProdutoAlmoxarifadoMapper.toCombustivelDomain(item),
            ),
          );
        },
      );
    });
  }
}

export default new ProdutoAlmoxarifadoRepository();
