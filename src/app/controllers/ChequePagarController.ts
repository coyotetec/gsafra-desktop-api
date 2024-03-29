import { parse } from 'date-fns';
import { Request, Response } from 'express';
import { TotalDomain } from '../../types/TotalTypes';
import ChequeRepository from '../repositories/ChequeRepository';

class ChequePagarController {
  async total(request: Request, response: Response) {
    const { startDate, endDate, idSafra } = request.query as {
      startDate?: string;
      endDate?: string;
      idSafra?: string;
    };

    const parsedStartDate = startDate
      ? parse(startDate, 'dd-MM-yyyy', new Date())
      : undefined;
    const parsedEndDate = endDate
      ? parse(endDate, 'dd-MM-yyyy', new Date())
      : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response
        .status(400)
        .json({ message: 'Data final precisa ser depois da inicial' });
    }

    let totalNextSeven: TotalDomain = {
      total: 0,
      quantity: 0,
    };
    let totalNextFifteen: TotalDomain = {
      total: 0,
      quantity: 0,
    };

    const total = await ChequeRepository.findTotal(request.databaseName, {
      tipo: 'pagar',
      period: 0,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      idSafra,
    });

    if (parsedStartDate) {
      [totalNextSeven, totalNextFifteen] = await Promise.all([
        ChequeRepository.findTotal(request.databaseName, {
          tipo: 'pagar',
          period: 7,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          idSafra,
        }),
        ChequeRepository.findTotal(request.databaseName, {
          tipo: 'pagar',
          period: 15,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          idSafra,
        }),
      ]);
    }

    response.json({
      ...total,
      totalNextSeven,
      totalNextFifteen,
    });
  }
}

export default new ChequePagarController();
