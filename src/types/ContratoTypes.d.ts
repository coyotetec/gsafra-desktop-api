export interface ContratoPersistence {
  ID: number;
  CLIENTE: string;
  NUMERO_CONTRATO: string;
  TOTAL_CONTRATO: number;
  TOTAL_ENTREGUE: number;
  VALOR_CONTRATO: number;
  VALOR_SACA: number;
  DATA_VENCIMENTO: Date;
}

export interface ContratoDomain {
  id: number;
  cliente: string;
  numeroContrato: string;
  totalContrato: number;
  totalEntregue: number;
  porcentagem: number;
  valorContrato: number;
  valorSaca: number;
  dataVencimento: Date;
}

export interface RomaneioPersistence {
  DATA: Date;
  NUMERO_ORDEM: number;
  QUANTIDADE: number;
  LOCAL_SAIDA: string;
  MOTORISTA: string;
  PLACA: string;
}

export interface RomaneioDomain {
  data: Date;
  numeroOrdem: number;
  quantidade: number;
  localSaida: string;
  motorista: string;
  placa: string;
}
