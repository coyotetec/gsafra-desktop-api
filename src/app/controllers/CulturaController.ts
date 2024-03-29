import { Request, Response } from 'express';
import CulturaRepository from '../repositories/CulturaRepository';

class CulturaController {
  async index(request: Request, response: Response) {
    const culturas = await CulturaRepository.findAll(request.databaseName);

    response.json(culturas);
  }
}

export default new CulturaController();
