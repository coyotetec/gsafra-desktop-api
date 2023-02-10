import { InputsBySafraDomain, InputsBySafraPersistence } from '../../../types/ManutencaoTypes';

class ManutencaoMapper {
  toInputsBySafraDomain(persistence: InputsBySafraPersistence): InputsBySafraDomain {
    return {
      insumo: persistence.INSUMO,
      total: persistence.TOTAL,
      quantidade: persistence.QUANTIDADE,
      unidade: persistence.UNIDADE,
    };
  }
}

export default new ManutencaoMapper();
