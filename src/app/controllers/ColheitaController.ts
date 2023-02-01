import { Request, Response } from 'express';
import ColheitaRepository from '../repositories/ColheitaRepository';

class ColheitaController {
  async total(request: Request, response: Response) {
    const { idSafra } = request.query;

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra obrigatório' });
    }

    const parsedIdSafra = Number(idSafra);

    const talhoesTotal = await ColheitaRepository.findTotal(parsedIdSafra);
    const totalHectares = talhoesTotal.reduce((acc, curr) => acc + curr.tamanhoTalhao, 0);
    const totalSafra = talhoesTotal.reduce((acc, curr) => acc + curr.total, 0);
    const sacasSafra = Number((totalSafra / 60).toFixed(2));
    const totalPorHectareSafra = Number((totalSafra / totalHectares).toFixed(2));
    const sacasPorHectareSafra = Number(((totalSafra / 60) / totalHectares).toFixed(2));

    response.json({ totalSafra, sacasSafra, totalPorHectareSafra, sacasPorHectareSafra, talhoesTotal });
  }
}

export default new ColheitaController();
