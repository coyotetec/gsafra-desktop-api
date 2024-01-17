import { Request, Response } from 'express';
import ProdutoAlmoxarifadoRepository from '../repositories/ProdutoAlmoxarifadoRepository';

class CombustivelController {
  async index(request: Request, response: Response) {
    const combustiveis =
      await ProdutoAlmoxarifadoRepository.findAllCombustiveis(
        request.databaseName,
      );

    response.json(combustiveis);
  }
}

export default new CombustivelController();
