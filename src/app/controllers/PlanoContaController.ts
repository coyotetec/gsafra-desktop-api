import { parse } from 'date-fns';
import { Request, Response } from 'express';
import PlanoContaRepository from '../repositories/PlanoContaRepository';

class PlanoContaController {
  async index(request: Request, response: Response) {
    const { type, category } = request.query as {
      type?: 'receita' | 'despesa',
      category?: 'sintetica' | 'analitica',
    };

    const planosContas = await PlanoContaRepository.findAll(type, category);

    response.json(planosContas);
  }

  async total(request: Request, response: Response) {
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

    const total = await PlanoContaRepository.findTotal({
      codigo,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      idSafra: parsedIdSafra
    });

    response.json(total);
  }
}

export default new PlanoContaController();
