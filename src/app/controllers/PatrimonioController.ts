import { Request, Response } from 'express';
import PatrimonioRepository from '../repositories/PatrimonioRepository';

class PatrimonioController {
  async index(request: Request, response: Response) {
    const patrimonios = await PatrimonioRepository.findAll(
      request.databaseName,
    );

    response.json(patrimonios);
  }
}

export default new PatrimonioController();
