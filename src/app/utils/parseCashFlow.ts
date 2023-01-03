import { getMonth, getYear } from 'date-fns';
import { CashFlowDomain } from '../../types/FinanceiroTypes';

export default function parseCashFlow(months: Date[], data: CashFlowDomain[], currentBalance?: number) {
  return months.map((monthDate) => {
    const monthNumber = getMonth(monthDate) + 1;
    const yearNumber = getYear(monthDate);
    const monthCashFlow = data.find(
      (i) => i.mes === monthNumber && i.ano === yearNumber
    );
    let value = currentBalance || 0;

    if (monthCashFlow) {
      if (currentBalance !== undefined) {
        currentBalance = Number((currentBalance + monthCashFlow.total).toFixed(2));
        value = currentBalance;
      } else {
        value = monthCashFlow.total;
      }
    }

    return {
      month: `${monthNumber < 10 ? `0${monthNumber}` : monthNumber}/${yearNumber}`,
      value,
    };
  });
}
