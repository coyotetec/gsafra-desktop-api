import { Request, Response } from 'express';
import ChequeRepository from '../repositories/ChequeRepository';

class ChequeReceberController {
  async total(request: Request, response: Response) {
    const { idSafra } = request.query;
    const parsedIdSafra = Number(idSafra);

    const total = await ChequeRepository.findTotal('receber', 0, parsedIdSafra);
    const totalNextSeven = await ChequeRepository.findTotal('receber', 7, parsedIdSafra);
    const totalNextFifteen = await ChequeRepository.findTotal('receber', 15, parsedIdSafra);

    response.json({
      ...total,
      totalNextSeven: totalNextSeven,
      totalNextFifteen: totalNextFifteen,
    });
  }
}

export default new ChequeReceberController();
