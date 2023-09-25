import { parse } from 'date-fns';
import { Request, Response } from 'express';
import CartaoRepository from '../repositories/CartaoRepository';

class CartaoController {
  async total(request: Request, response: Response) {
    const { startDate, endDate, idSafra } = request.query as {
      startDate?: string,
      endDate?: string,
      idSafra?: string
    };

    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const [total, realTotal, totalLimit] = await Promise.all([
      CartaoRepository.findTotal({
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        idSafra,
      }),
      CartaoRepository.findTotal({}),
      CartaoRepository.findLimitTotal()
    ]);

    const availableLimit = totalLimit - realTotal.total;

    const usagePercentage = Math.round(100 - ((availableLimit * 100) / totalLimit));

    response.json({ ...total, availableLimit, totalLimit, usagePercentage });
  }
}

export default new CartaoController();
