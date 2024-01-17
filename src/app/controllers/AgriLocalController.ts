import { Request, Response } from 'express';
import AgriLocalRepository from '../repositories/AgriLocalRepository';

class AgriLocalController {
  async index(request: Request, response: Response) {
    const locaisArmazenagem = await AgriLocalRepository.findAll(
      request.databaseName,
    );

    response.json(locaisArmazenagem);
  }
}

export default new AgriLocalController();
