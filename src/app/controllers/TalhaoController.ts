import { Request, Response } from 'express';
import TalhaoRepository from '../repositories/TalhaoRepository';

class TalhaoController {
  async index(request: Request, response: Response) {
    const { idSafra } = request.params;

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra obrigatório' });
    }

    const talhoes = await TalhaoRepository.findAll(
      request.databaseName,
      idSafra,
    );

    response.json(talhoes);
  }
}

export default new TalhaoController();
