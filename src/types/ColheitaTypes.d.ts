export interface TotalPersistence {
  TOTAL_PRODUCAO: number;
  TALHAO: string;
  TAMANHO_TALHAO: number;
}

export interface TotalDomain {
  total: number;
  sacas: number;
  totalPorHectare: number;
  sacasPorHectare: number;
  talhao: string;
  tamanhoTalhao: number;
}

export interface DescontoTotalPersistence {
  PESO_TOTAL: number;
  DESCONTO_TOTAL: number;
  DESCONTO_REAL: number;
  TALHAO: string;
}

export interface DescontoTotalDomain {
  pesoTotal: number;
  descontoTotal: number;
  descontoPorcentagem: number;
  descontoReal: number;
  talhao: string;
}
