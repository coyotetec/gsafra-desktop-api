import { Request, Response } from 'express';
import AlmoxarifadoRepository from '../repositories/AlmoxarifadoRepository';

class AlmoxarifadoController {
  async index(request: Request, response: Response) {
    const almoxarifados = await AlmoxarifadoRepository.findAll(
      request.databaseName,
    );

    response.json(almoxarifados);
  }
}

export default new AlmoxarifadoController();
