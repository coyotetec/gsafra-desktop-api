export interface TotalPersistence {
  TOTAL: number;
  MES: number;
  ANO: number;
}

export interface TotalDomain {
  total: number;
  mes: number;
  ano: number;
}

export interface TotalFuelPersistence {
  TOTAL: number;
  COMBUSTIVEL: string;
}

export interface TotalFuelDomain {
  total: number;
  combustivel: string;
}

export interface TotalPatrimonyPersistence {
  TOTAL: number;
  TIPO_PATRIMONIO: string;
}

export interface TotalPatrimonyDomain {
  total: number;
  tipoPatrimonio: string;
}

export interface DetailsPersistence {
  MES: number;
  ANO: number;
  DATA: Date;
  NUMERO_REQUISICAO?: string;
  PATRIMONIO: string;
  TIPO_PATRIMONIO: string;
  COMBUSTIVEL: string;
  LOCAL_SAIDA: string;
  QUANTIDADE: number;
  CUSTO_INDIVIDUAL: number;
  TOTAL: number;
}

export interface DetailsDomain {
  mes: string;
  data: Date;
  numeroRequisicao?: string;
  patrimonio: string;
  tipoPatrimonio: string;
  combustivel: string;
  localSaida: string;
  quantidade: number;
  custoIndividual: number;
  total: number;
}

export interface TotalBySafraPersistence {
  INSUMO: string;
  TOTAL: number;
  QUANTIDADE: number;
  UNIDADE: string;
}

export interface TotalBySafraDomain {
  insumo: string;
  total: number;
  quantidade: number;
  unidade: string;
}
