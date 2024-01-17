import database from '../../database';

class DashboardSecaoRepository {
  findAllCodigos(databaseName: string) {
    return new Promise<string[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        SELECT * FROM dashboard_secao
        WHERE situacao = 1
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => item.CODIGO));
        },
      );
    });
  }
}

export default new DashboardSecaoRepository();
