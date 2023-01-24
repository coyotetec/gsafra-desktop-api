import { Request, Response } from 'express';
import { parse, eachMonthOfInterval } from 'date-fns';

import FinanceiroRepository from '../repositories/FinanceiroRepository';
import parseCashFlow from '../utils/parseCashFlow';

class FinanceiroController {
  async cashFlow(request: Request, response: Response) {
    const { startDate, endDate, idSafra } = request.query as {
      startDate: string,
      endDate: string,
      idSafra?: string
  };

    if (!startDate || !endDate) {
      return response.status(400).json({ message: 'Datas inicial e final são obrigatórias' });
    }

    const parsedStartDate = parse(startDate, 'dd-MM-yyyy', new Date());
    const parsedEndDate = parse(endDate, 'dd-MM-yyyy', new Date());
    const parsedIdSafra = idSafra ? Number(idSafra) : undefined;

    if (parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const months = eachMonthOfInterval({
      start: parsedStartDate,
      end: parsedEndDate,
    });

    const currentBalance = await FinanceiroRepository.findCurrentBalance(parsedStartDate);
    const cashFlowBalanceData = await FinanceiroRepository.findCashFlowBalance(
      parsedStartDate,
      parsedEndDate,
      parsedIdSafra
    );
    const cashFlowBalancePlanData = await FinanceiroRepository.findCashFlowBalancePlan(
      parsedStartDate,
      parsedEndDate,
      parsedIdSafra
    );
    const cashFlowCreditsData = await FinanceiroRepository.findCashFlowCredits(
      parsedStartDate,
      parsedEndDate,
      parsedIdSafra
    );
    const cashFlowCreditsPlanData = await FinanceiroRepository.findCashFlowCreditsPlan(
      parsedStartDate,
      parsedEndDate,
      parsedIdSafra
    );
    const cashFlowDebitsData = await FinanceiroRepository.findCashFlowDebits(
      parsedStartDate,
      parsedEndDate,
      parsedIdSafra
    );
    const cashFlowDebitsPlanData = await FinanceiroRepository.findCashFlowDebitsPlan(
      parsedStartDate,
      parsedEndDate,
      parsedIdSafra
    );

    const cashFlowBalance = parseCashFlow(months, cashFlowBalanceData, currentBalance);
    const cashFlowBalancePlan = parseCashFlow(months, cashFlowBalancePlanData, currentBalance);
    const cashFlowCredits = parseCashFlow(months, cashFlowCreditsData);
    const cashFlowCreditsPlan = parseCashFlow(months, cashFlowCreditsPlanData);
    const cashFlowDebits = parseCashFlow(months, cashFlowDebitsData);
    const cashFlowDebitsPlan = parseCashFlow(months, cashFlowDebitsPlanData);

    response.json({
      currentBalance,
      cashFlowBalance,
      cashFlowBalancePlan,
      cashFlowCredits,
      cashFlowCreditsPlan,
      cashFlowDebits,
      cashFlowDebitsPlan,
    });
  }
}

export default new FinanceiroController();
