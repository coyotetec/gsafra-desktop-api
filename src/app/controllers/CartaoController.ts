import { Request, Response } from 'express';
import CartaoRepository from '../repositories/CartaoRepository';

class CartaoController {
  async total(request: Request, response: Response) {
    const { idSafra } = request.query;
    const parsedIdSafra = Number(idSafra);

    const total = await CartaoRepository.findTotal(parsedIdSafra);
    const totalLimit = await CartaoRepository.findLimitTotal();
    let availableLimit = totalLimit - total.total;

    if (parsedIdSafra) {
      const realTotal = await CartaoRepository.findTotal();

      availableLimit = totalLimit - realTotal.total;
    }

    const usagePercentage = Math.round(100 - ((availableLimit * 100) / totalLimit));

    response.json({ ...total, availableLimit, totalLimit, usagePercentage });
  }
}

export default new CartaoController();
