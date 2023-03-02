export interface EntradasGraosPersistence {
  PESO: number;
  DESCONTO_CLASSIFICACAO: number;
  TAXA_RECEPCAO: number;
  COTA_CAPITAL: number;
  TAXA_ARMAZENAMENTO: number;
  QUEBRA_TECNICA: number;
}

export interface EntradasGraosDomain {
  peso: number;
  descontoClassificacao: number;
  taxaRecepcao: number;
  cotaCapital: number;
  taxaArmazenamento: number;
  quebraTecnica: number;
  pesoLiquido: number;
}

export interface SaidasGraosPersistence {
  PESO: number;
  DESCONTO_CLASSIFICACAO: number;
}

export interface SaidasGraosDomain {
  peso: number;
  descontoClassificacao: number;
  pesoLiquido: number;
}

export interface EntradasGraosProdutorPersistence {
  ID_PRODUTOR: number;
  PRODUTOR: string;
  PESO: number;
  DESCONTO_CLASSIFICACAO: number;
  TAXA_RECEPCAO: number;
  COTA_CAPITAL: number;
  TAXA_ARMAZENAMENTO: number;
  QUEBRA_TECNICA: number;
}

export interface EntradasGraosProdutorDomain {
  idProdutor: number;
  produtor: string;
  peso: number;
  descontoClassificacao: number;
  taxaRecepcao: number;
  cotaCapital: number;
  taxaArmazenamento: number;
  quebraTecnica: number;
  pesoLiquido: number;
}

export interface SaidasGraosProdutorPersistence {
  ID_PRODUTOR: number;
  PRODUTOR: string;
  PESO: number;
  DESCONTO_CLASSIFICACAO: number;
}

export interface SaidasGraosProdutorDomain {
  idProdutor: number;
  produtor: string;
  peso: number;
  descontoClassificacao: number;
  pesoLiquido: number;
}

export interface SaldoProdutorPersistence {
  ID_PRODUTOR: number;
  PRODUTOR: string;
  SALDO: number;
}

export interface SaldoProdutorDomain {
  idProdutor: number;
  produtor: string;
  saldo: number;
}
