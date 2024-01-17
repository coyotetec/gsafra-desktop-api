import { Request, Response } from 'express';
import { parse } from 'date-fns';
import AtividadeAgricolaRepository from '../repositories/AtividadeAgricolaRepository';
import TalhaoRepository from '../repositories/TalhaoRepository';

class AtividadeAgricolaController {
  async totalInputsBySafra(request: Request, response: Response) {
    const { idSafra, idTalhao, startDate, endDate } = request.query as {
      idSafra?: string;
      idTalhao?: string;
      startDate?: string;
      endDate?: string;
    };

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra é obrigatório' });
    }

    const parsedIdTalhao = idTalhao ? Number(idTalhao) : undefined;
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

    const [inputsTotalData, totalArea] = await Promise.all([
      AtividadeAgricolaRepository.findInputsBySafra(request.databaseName, {
        idSafra,
        idTalhao: parsedIdTalhao,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      }),
      TalhaoRepository.findArea(request.databaseName, idSafra, parsedIdTalhao),
    ]);

    const inputsTotalSafra = inputsTotalData.reduce(
      (acc, curr) => acc + curr.total,
      0,
    );
    const inputsTotalPorHectareSafra = Number(
      (inputsTotalSafra / totalArea).toFixed(2),
    );
    const inputsTotal = inputsTotalData.map((item) => ({
      insumo: item.insumo,
      total: item.total,
      quantidade: item.quantidade,
      porcentagem: Number(((item.total * 100) / inputsTotalSafra).toFixed(2)),
      totalPorHectare: Number((item.total / totalArea).toFixed(2)),
      quantidadePorHectare: Number((item.quantidade / totalArea).toFixed(2)),
      unidade: item.unidade,
    }));

    response.json({
      inputsTotalSafra,
      inputsTotalPorHectareSafra,
      inputsTotal,
    });
  }
}

export default new AtividadeAgricolaController();
