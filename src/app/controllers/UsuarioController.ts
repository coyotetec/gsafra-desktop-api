import { Request, Response } from 'express';
import DashboardSecaoRepository from '../repositories/DashboardSecaoRepository';
import UsuarioRepository from '../repositories/UsuarioRepository';

class UsuarioController {
  async permissions(request: Request, response: Response) {
    const { id } = request.params;

    let permissionsList: string[] = [];

    if (id === '0') {
      permissionsList = await DashboardSecaoRepository.findAllCodigos(
        request.databaseName,
      );
    } else {
      permissionsList = await UsuarioRepository.findPermissions(
        request.databaseName,
        Number(id),
      );
    }

    response.json(permissionsList);
  }
}

export default new UsuarioController();
