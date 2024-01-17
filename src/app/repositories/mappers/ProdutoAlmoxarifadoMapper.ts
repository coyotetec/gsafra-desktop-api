import {
  CombustivelDomain,
  CombustivelPersistence,
} from '../../../types/ProdutoAlmoxarifadoTypes';

class ProdutoAlmoxarifadoMapper {
  toCombustivelDomain(persistence: CombustivelPersistence): CombustivelDomain {
    return {
      id: persistence.ID,
      tipo: persistence.TIPO,
      nome: persistence.NOME,
      status: persistence.STATUS,
    };
  }
}

export default new ProdutoAlmoxarifadoMapper();
