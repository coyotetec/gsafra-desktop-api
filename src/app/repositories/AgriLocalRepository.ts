import database from '../../database';
import { AgriLocalDomain } from '../../types/AgriLocalTypes';
import PessoaMapper from './mappers/PessoaMapper';

class AgriLocalRepository {
  findAll(databaseName: string) {
    return new Promise<AgriLocalDomain[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select id, nome
        from estoque_agri_local
        order by nome
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((local) => PessoaMapper.toProdutorDomain(local)));
        },
      );
    });
  }
}

export default new AgriLocalRepository();
