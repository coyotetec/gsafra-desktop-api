export interface CustoCategoriaPersistence {
  TOTAL: number;
  CATEGORIA: string;
}

export interface CustoCategoriaDomain {
  total: number;
  categoria: string;
}

export interface CustoTalhaoPersistence {
  TOTAL: number;
  TALHAO: string;
  VARIEDADE: string;
  AREA: number;
  SAFRA: string;
}

export interface CustoTalhaoDomain {
  total: number;
  totalPorHectare: number;
  talhao: string;
  variedade: string;
  talhaoVariedade: string;
  area: number;
  safra: string;
}
