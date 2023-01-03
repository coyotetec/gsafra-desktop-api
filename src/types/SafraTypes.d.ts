export interface SafraPersistence {
  ID: number;
  NOME: string;
  ID_CULTURA: number;
  DATA_INICIO?: Date;
  DATA_FINAL?: Date;
  STATUS: number;
  PRODUCAO_ESTIMADA: number;
  PRODUCAO_MINIMA: number;
  VALOR_MEDIO_VENDA: number;
}

export interface SafraDomain {
  id: number;
  nome: string;
  idCultura: number;
  dataIncio?: Date;
  dataFinal?: Date;
  status: number;
  producaoEstimada: number;
  producaoMinima: number;
  valorMedioVenda: number;
}
