export interface ContratoPersistence {
  ID: number;
  CLIENTE: string;
  NUMERO_CONTRATO: string;
  TOTAL_CONTRATO: number;
  TOTAL_ENTREGUE: number;
}

export interface ContratoDomain {
  id: number;
  cliente: string;
  numeroContrato: string;
  totalContrato: number;
  totalEntregue: number;
  porcentagem: number;
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
