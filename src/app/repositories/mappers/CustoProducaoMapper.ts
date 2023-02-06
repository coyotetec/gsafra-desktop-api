import { CustoCategoriaDomain, CustoCategoriaPersistence } from '../../../types/CustoProducaoTypes';

class CustoProducaoMapper {
  toCategoriaDomain(persistence: CustoCategoriaPersistence): CustoCategoriaDomain {
    return {
      categoria: persistence.CATEGORIA.trim(),
      total: persistence.TOTAL
    };
  }
}

export default new CustoProducaoMapper();
