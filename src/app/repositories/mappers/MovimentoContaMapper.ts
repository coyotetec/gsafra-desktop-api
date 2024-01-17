import {
  MovimentoContaDomain,
  MovimentoContaPersistence,
} from '../../../types/MovimentoContaTypes';

class MovimentoConta {
  toMovimentoContaDomain(
    persistence: MovimentoContaPersistence,
  ): MovimentoContaDomain {
    return {
      data: persistence.DATA,
      valorTotal: persistence.VALOR_TOTAL,
      valorApropriado: persistence.VALOR_APROPRIADO,
      contaBancaria: persistence.CONTA_BANCARIA,
      pessoa: persistence.PESSOA,
      documento: persistence.DOCUMENTO,
      descricao: persistence.DESCRICAO,
      planoConta: persistence.PLANO_CONTA,
      tipoDocumento: persistence.TIPO_DOCUMENTO
        ? persistence.TIPO_DOCUMENTO.trim()
        : '',
    };
  }
}

export default new MovimentoConta();
