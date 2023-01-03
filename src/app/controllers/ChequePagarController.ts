import { Request, Response } from 'express';
import ChequeRepository from '../repositories/ChequeRepository';

class ChequePagarController {
  async total(request: Request, response: Response) {
    const { idSafra } = request.query;
    const parsedIdSafra = Number(idSafra);

    const total = await ChequeRepository.findTotal('pagar', 0, parsedIdSafra);
    const totalNextSeven = await ChequeRepository.findTotal('pagar', 7, parsedIdSafra);
    const totalNextFifteen = await ChequeRepository.findTotal('pagar', 15, parsedIdSafra);

    response.json({
      ...total,
      totalNextSeven: totalNextSeven,
      totalNextFifteen: totalNextFifteen,
    });
  }
}

export default new ChequePagarController();
