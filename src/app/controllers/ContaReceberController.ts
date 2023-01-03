import { Request, Response } from 'express';
import FinanceiroRepository from '../repositories/FinanceiroRepository';

class ContaReceberController {
  async total(request: Request, response: Response) {
    const { idSafra } = request.query;
    const parsedIdSafra = Number(idSafra);

    const total = await FinanceiroRepository.findTotal('receber', 0, parsedIdSafra);
    const totalNextSeven = await FinanceiroRepository.findTotal('receber', 7, parsedIdSafra);
    const totalNextFifteen = await FinanceiroRepository.findTotal('receber', 15, parsedIdSafra);

    response.json({
      ...total,
      totalNextSeven: totalNextSeven,
      totalNextFifteen: totalNextFifteen,
    });
  }
}

export default new ContaReceberController();
