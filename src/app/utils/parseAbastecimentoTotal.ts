import { getMonth, getYear } from 'date-fns';
import { TotalDomain } from '../../types/AbastecimentoTypes';

export default function parseAbastecimentoTotal(months: Date[], data: TotalDomain[]) {
  return months.map((monthDate) => {
    const monthNumber = getMonth(monthDate) + 1;
    const yearNumber = getYear(monthDate);
    const item = data.find(
      (i) => i.mes === monthNumber && i.ano === yearNumber
    );

    return {
      month: `${monthNumber < 10 ? `0${monthNumber}` : monthNumber}/${yearNumber}`,
      value: item?.total || 0,
    };
  });
}
