import { Request, Response } from 'express';
import DashboardSecaoRepository from '../repositories/DashboardSecaoRepository';
import UsuarioRepository from '../repositories/UsuarioRepository';

class UsuarioController {
  async permissions(request: Request, response: Response) {
    const { id } = request.params;

    let permissionsList: string[]  = [];

    if (id === '0') {
      permissionsList = await DashboardSecaoRepository.findAllCodigos();
    } else {
      permissionsList = await UsuarioRepository.findPermissions(Number(id));
    }


    response.json(permissionsList);
  }
}

export default new UsuarioController();
