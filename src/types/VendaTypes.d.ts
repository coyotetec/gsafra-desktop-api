export interface VendaPersistence {
  ID_CLIENTE: number;
  CLIENTE: string;
  TOTAL: number;
  TOTAL_ENTREGUE: number;
}

export interface VendaDomain {
  idCliente: number;
  cliente: string;
  total: number;
  totalEntregue: number;
  porcentagem: number;
}

export interface RomaneioPersistence {
  CLIENTE: string;
  DATA: Date;
  NUMERO_ORDEM: number;
  QUANTIDADE: number;
  LOCAL_SAIDA: string;
  MOTORISTA: string;
  PLACA: string;
}

export interface RomaneioDomain {
  cliente: string;
  data: Date;
  numeroOrdem: number;
  quantidade: number;
  localSaida: string;
  motorista: string;
  placa: string;
}

export interface PrecoMedioClientePersistence {
  CLIENTE: string;
  PRECO_MEDIO_KG: number;
}

export interface PrecoMedioClienteDomain {
  cliente: string;
  precoMedioKg: number;
  precoMedioSaca: number;
}

export interface PrecoMedioMesPersistence {
  MES: number;
  ANO: number;
  VALOR_TOTAL: number;
  QUANTIDADE_TOTAL: number;
}

export interface PrecoMedioMesDomain {
  mes: number;
  ano: number;
  valorTotal: number;
  quantidadeTotal: number;
  precoMedioKg: number;
  precoMedioSaca: number;
}
