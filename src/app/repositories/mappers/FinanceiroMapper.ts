import { CashFlowDomain, CashFlowPersistence } from '../../../types/FinanceiroTypes';

class FinanceiroMapper {
  toCashFlowDomain(persistence: CashFlowPersistence): CashFlowDomain {
    return {
      total: persistence.TOTAL,
      mes: persistence.MES,
      ano: persistence.ANO
    };
  }
}

export default new FinanceiroMapper();
