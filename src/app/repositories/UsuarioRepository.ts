import database from '../../database';

class UsuarioRepository {
  findPermissions(databaseName: string, idUsuario: number) {
    return new Promise<string[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select dashboard_secao.codigo from usuario
        inner join papel on papel.id = usuario.id_papel
        left join papel_dashboard on papel_dashboard.id_papel = papel.id
        left join dashboard_secao on  dashboard_secao.id = papel_dashboard.id_dashboard_secao
        where usuario.id = ?
        `,
        [idUsuario],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((permissao) => permissao.CODIGO));
        },
      );
    });
  }
}

export default new UsuarioRepository();
