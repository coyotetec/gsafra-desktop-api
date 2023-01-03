export interface ViewPersistence {
  ID: number;
  NOME: string;
  SITUACAO: number;
}

export interface ViewDomain {
  id: number;
  nome: string;
  situacao: number;
}

export interface ViewColumnPersistence {
  ID: number;
  ID_FINANCEIRO_VIEW_M: number;
  NOME: string;
  APROPRIACAO_CUSTO_1: number;
  APROPRIACAO_CUSTO_2: number;
  APROPRIACAO_CUSTO_3: number;
  APROPRIACAO_CUSTO_4: number;
  APROPRIACAO_CUSTO_44: number;
  FILTRAR_PLANO_CONTA: number;
  FILTRAR_CENTRO_CUSTO: number;
  FILTRAR_SAFRA: number;
  FILTRAR_PATRIMONIO: number;
  FILTRAR_EMPRESA: number
}

export interface ViewColumnDomain {
  id: number;
  idFinanceiroViewM: number;
  nome: string;
  apropriacaoCusto1: boolean;
  apropriacaoCusto2: boolean;
  apropriacaoCusto3: boolean;
  apropriacaoCusto4: boolean;
  apropriacaoCusto44: boolean;
  filtrarPlanoConta: boolean;
  filtrarCentroCusto: boolean;
  filtrarSafra: boolean;
  filtrarPatrimonio: boolean;
  filtrarEmpresa: boolean
}

export interface ViewDetailPersistence {
  DATA: Date;
  VALOR: number;
  CONTA_BANCARIA: string;
  PESSOA: string;
  DOCUMENTO?: string;
  DESCRICAO: string;
  TIPO_DOCUMENTO?: string;
}

export interface ViewDetailDomain {
  data: Date;
  valor: number;
  contaBancaria: string;
  pessoa: string;
  documento?: string;
  descricao: string;
  tipoDocumento?: string;
}
