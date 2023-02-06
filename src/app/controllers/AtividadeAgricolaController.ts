import { Request, Response } from 'express';
import { parse } from 'date-fns';
import AtividadeAgricolaRepository from '../repositories/AtividadeAgricolaRepository';

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

    const parsedIdSafra = Number(idSafra);
    const parsedIdTalhao = idTalhao ? Number(idTalhao) : undefined;
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const inputsTotal = await AtividadeAgricolaRepository.findInputsBySafra({
      idSafra: parsedIdSafra,
      idTalhao: parsedIdTalhao,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    });
    const inputsTotalSafra = inputsTotal.reduce((acc, curr) => acc + curr.total, 0);
    const inputsTotalQtySafra = inputsTotal.reduce((acc, curr) => acc + curr.quantidade, 0);

    response.json({ inputsTotalSafra, inputsTotalQtySafra, inputsTotal });
  }
}

export default new AtividadeAgricolaController();
