import { parse } from 'date-fns';
import { Request, Response } from 'express';
import ContratoRepository from '../repositories/ContratoRepository';

class ContratoController {
  async index(request: Request, response: Response) {
    const { idSafra } = request.query;

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra é obrigatório' });
    }

    const parsedIdSafra = Number(idSafra);

    const contratos = await ContratoRepository.findAll(
      request.databaseName,
      parsedIdSafra,
    );

    response.json(contratos);
  }

  async romaneios(request: Request, response: Response) {
    const { id } = request.params;
    const { startDate, endDate } = request.query as {
      startDate?: string;
      endDate?: string;
    };

    if (!id) {
      return response
        .status(400)
        .json({ message: 'Id do contrato é obrigatório' });
    }

    const parsedIdContrato = Number(id);
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

    const romaneios = await ContratoRepository.findRomaneios(
      request.databaseName,
      {
        idContrato: parsedIdContrato,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      },
    );

    response.json(romaneios);
  }
}

export default new ContratoController();
