import { Request, Response } from 'express';
import ColheitaRepository, { descontoType } from '../repositories/ColheitaRepository';

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

  async descontoTotal(request: Request, response: Response) {
    const { idSafra, desconto } = request.query as {
      idSafra?: string;
      desconto?: descontoType;
    };

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra obrigatório' });
    }

    if (!desconto) {
      return response.status(400).json({ message: 'Desconto é obrigatório' });
    }

    const parsedIdSafra = Number(idSafra);

    const talhoesDescontoTotal = await ColheitaRepository.findDescontoTotal(parsedIdSafra, desconto);

    const pesoTotalSafra = talhoesDescontoTotal.reduce((acc, curr) => acc + curr.pesoTotal, 0);
    const totalDescontoSafra = talhoesDescontoTotal.reduce((acc, curr) => acc + curr.descontoTotal, 0);
    const porcentagemDescontoSafra = Number(((totalDescontoSafra * 100) / pesoTotalSafra).toFixed(2));
    const totalDescontoRealSafra = talhoesDescontoTotal.reduce((acc, curr) => acc + curr.descontoReal, 0);

    response.json({
      pesoTotalSafra,
      totalDescontoSafra,
      porcentagemDescontoSafra,
      totalDescontoRealSafra,
      talhoesDescontoTotal
    });
  }
}

export default new ColheitaController();
