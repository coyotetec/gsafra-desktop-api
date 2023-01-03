export interface PlanoContaPersistence {
  ID: number;
  ID_PAI: number;
  CODIGO: string;
  DESCRICAO: string;
  DESCRICAO_IMPRESSAO: string;
  TIPO: string;
  NIVEL: number;
  CATEGORIA: number;
  STATUS: number;
  DEDUTIVEL: number;
  ID_PLANO_CONTA_TIPO_GRUPO?: number;
}

export interface PlanoContaDomain {
  id: number;
  idPai: number;
  codigo: string;
  descricao: string;
  descricaoImpressao: string;
  tipo: string;
  nivel: number;
  categoria: number;
  status: number;
  dedutivel: number;
  idPlanoContaTipoGrupo?: number;
}

export interface PlanoContaTotalPersistence {
  DESCRICAO: string;
  TOTAL: number;
}

export interface PlanoContaTotalDomain {
  descricao: string;
  total: number;
}
