import { InputsBySafraDomain, InputsBySafraPersistence } from '../../../types/AtividadeAgricolaTypes';

class AtividadeAgricolaMapper {
  toInputsBySafraDomain(persistence: InputsBySafraPersistence): InputsBySafraDomain {
    return {
      insumo: persistence.INSUMO,
      total: persistence.TOTAL,
      quantidade: persistence.QUANTIDADE
    };
  }
}

export default new AtividadeAgricolaMapper();
