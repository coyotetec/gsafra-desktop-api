export interface MovimentoContaPersistence {
  DATA: Date;
  VALOR_TOTAL: number;
  VALOR_APROPRIADO: number;
  CONTA_BANCARIA: string;
  PESSOA: string;
  DOCUMENTO?: string;
  DESCRICAO: string;
  PLANO_CONTA: string;
  TIPO_DOCUMENTO?: string;
}

export interface MovimentoContaDomain {
  data: Date;
  valorTotal: number;
  valorApropriado: number;
  contaBancaria: string;
  pessoa: string;
  documento?: string;
  descricao: string;
  planoConta: string;
  tipoDocumento?: string;
}
