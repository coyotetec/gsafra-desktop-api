import { Request, Response } from 'express';
import SafraRepository from '../repositories/SafraRepository';

class SafraController {
  async index(request: Request, response: Response) {
    const safras = await SafraRepository.findAll(request.databaseName);

    response.json(safras);
  }
}

export default new SafraController();
