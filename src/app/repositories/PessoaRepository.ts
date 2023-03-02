import database from '../../database';
import { ProdutorDomain } from '../../types/PessoaTypes';
import PessoaMapper from './mappers/PessoaMapper';

class PessoaRepository {
  findAllProdutores() {
    return new Promise<ProdutorDomain[]>((resolve, reject) => {
      database.query(
        `
        select id, razao_social as nome from pessoa
        where produtor_rural = 1
        and status = 1
        order by razao_social
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((produtor) => PessoaMapper.toProdutorDomain(produtor)));
        }
      );
    });
  }
}

export default new PessoaRepository();
