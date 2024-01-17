import {
  ProdutorDomain,
  ProdutorPersistence,
} from '../../../types/PessoaTypes';

class PessoaMapper {
  toProdutorDomain(persistence: ProdutorPersistence): ProdutorDomain {
    return {
      id: persistence.ID,
      nome: persistence.NOME,
    };
  }
}

export default new PessoaMapper();
