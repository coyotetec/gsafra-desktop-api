import { Request, Response } from 'express';
import FinanceiroRepository from '../repositories/FinanceiroRepository';

class ContaPagarController {
  async total(request: Request, response: Response) {
    const { idSafra } = request.query;
    const parsedIdSafra = Number(idSafra);

    const total = await FinanceiroRepository.findTotal('pagar', 0, parsedIdSafra);
    const totalNextSeven = await FinanceiroRepository.findTotal('pagar', 7, parsedIdSafra);
    const totalNextFifteen = await FinanceiroRepository.findTotal('pagar', 15, parsedIdSafra);

    response.json({
      ...total,
      totalNextSeven: totalNextSeven,
      totalNextFifteen: totalNextFifteen,
    });
  }
}

export default new ContaPagarController();
