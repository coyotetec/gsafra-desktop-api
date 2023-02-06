import { InputsBySafraDomain, InputsBySafraPersistence } from '../../../types/ManutencaoTypes';

class ManutencaoMapper {
  toInputsBySafraDomain(persistence: InputsBySafraPersistence): InputsBySafraDomain {
    return {
      insumo: persistence.INSUMO,
      total: persistence.TOTAL,
      quantidade: persistence.QUANTIDADE
    };
  }
}

export default new ManutencaoMapper();
