import { Request, Response } from 'express';
import PessoaRepository from '../repositories/PessoaRepository';

class PessoaController {
  async indexProdutor(request: Request, response: Response) {
    const produtores = await PessoaRepository.findAllProdutores(
      request.databaseName,
    );

    response.json(produtores);
  }
}

export default new PessoaController();
