import { Request, Response } from 'express';
import UsuarioRepository from '../repositories/UsuarioRepository';

class UsuarioController {
  async permissions(request: Request, response: Response) {
    const { id } = request.params;

    let permissionsList: string[]  = [];

    if (id === '0') {
      permissionsList = [
        'resumo_pendentes_pagamento',
        'resumo_pendentes_recebimento',
        'resumo_cartao_credito',
        'fluxo_caixa',
        'debitos_compensados',
        'creditos_compensados',
        'indicadores_financeiros',
      ];
    } else {
      permissionsList = await UsuarioRepository.findPermissions(Number(id));
    }


    response.json(permissionsList);
  }
}

export default new UsuarioController();
