export interface ViewPersistence {
  ID: number;
  NOME: string;
  SITUACAO: number;
  PERIODO_PADRAO_MESES: number;
}

export interface ViewDomain {
  id: number;
  nome: string;
  situacao: number;
  periodoPadraoMeses: number;
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
  FILTRAR_EMPRESA: number;
  FILTRAR_PESSOA: number;
  VISIVEL: number;
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
  filtrarEmpresa: boolean;
  filtrarPessoa: boolean;
  visivel: boolean;
}

export interface ViewDetailPersistence {
  DATA: Date;
  VALOR: number;
  TIPO_LANCAMENTO: string;
  CONTA_BANCARIA: string;
  PESSOA: string;
  DOCUMENTO?: string;
  DESCRICAO: string;
  TIPO_DOCUMENTO?: string;
}

export interface ViewDetailDomain {
  data: Date;
  valor: number;
  tipoLancamento: string;
  contaBancaria: string;
  pessoa: string;
  documento?: string;
  descricao: string;
  tipoDocumento?: string;
}

export interface ViewTotalizadorPersistence {
  ID: number;
  ID_FINANCEIRO_VIEW_M: number;
  TOTALIZADOR_NOME: string;
  FORMULA: string;
  FORMATO: number;
}

export interface ViewTotalizadorDomain {
  id: number;
  idFinanceiroViewM: number;
  totalizadorNome: string;
  formula: string;
  formato: number;
}
