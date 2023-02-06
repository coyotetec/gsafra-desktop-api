import { Request, Response } from 'express';
import TalhaoRepository from '../repositories/TalhaoRepository';

class TalhaoController {
  async index(request: Request, response: Response) {
    const {idSafra} = request.params;

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra obrigatório' });
    }

    const parsedIdSafra = Number(idSafra);
    const talhoes = await TalhaoRepository.findAll(parsedIdSafra);

    response.json(talhoes);
  }
}

export default new TalhaoController();
