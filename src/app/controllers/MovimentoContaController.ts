import { parse } from 'date-fns';
import { Request, Response } from 'express';
import MovimentoContaRepository from '../repositories/MovimentoContaRepository';

class MovimentoContaController {
  async index(request: Request, response: Response) {
    const { codigo } = request.params;
    const { startDate, endDate, idSafra } = request.query as {
      startDate: string,
      endDate: string,
      idSafra?: string
    };

    if (!codigo) {
      return response.status(400).json({ message: 'Código é obrigatório' });
    }

    if (!startDate || !endDate) {
      return response.status(400).json({ message: 'Datas inicial e final são obrigatórias' });
    }

    const parsedStartDate = parse(startDate, 'dd-MM-yyyy', new Date());
    const parsedEndDate = parse(endDate, 'dd-MM-yyyy', new Date());
    const parsedIdSafra = idSafra ? Number(idSafra) : undefined;

    if (parsedStartDate >= parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const accountMovements = await MovimentoContaRepository.findAll({
      codigo,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      idSafra: parsedIdSafra
    });

    response.json(accountMovements);
  }
}

export default new MovimentoContaController();
