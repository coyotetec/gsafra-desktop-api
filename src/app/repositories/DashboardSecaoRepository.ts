import database from '../../database';

class DashboardSecaoRepository {
  findAllCodigos() {
    return new Promise<string[]>((resolve, reject) => {
      database.query(
        `
        SELECT * FROM dashboard_secao
        WHERE situacao = 1
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => item.CODIGO));
        }
      );
    });
  }
}

export default new DashboardSecaoRepository();
