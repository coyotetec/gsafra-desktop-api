import { Request, Response } from 'express';
import TipoPatrimonioRepository from '../repositories/TipoPatrimonioRepository';

class TipoPatrimonioController {
  async index(request: Request, response: Response) {
    const tiposPatrimonio = await TipoPatrimonioRepository.findAll(
      request.databaseName,
    );

    response.json(tiposPatrimonio);
  }
}

export default new TipoPatrimonioController();
