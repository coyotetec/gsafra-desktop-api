import { TotalDomain, TotalPersistence } from '../../../types/TotalTypes';

class TotalMapper {
  toTotalDomain(persistence: TotalPersistence): TotalDomain {
    return {
      quantity: Number(persistence.QUANTIDADE),
      total: Number(persistence.TOTAL),
    };
  }
}

export default new TotalMapper();
