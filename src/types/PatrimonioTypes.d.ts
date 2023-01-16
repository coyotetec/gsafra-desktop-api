export interface PatrimonioPersistence {
  ID: number;
  DESCRICAO: string;
  MARCA: string;
  PLACA: string;
  CHASSIS_SERIE: string;
  ANO_FABRICACAO: number;
  RENAVAM: string;
  PROPRIETARIO: string;
  TIPO_BEM: number;
  NOME_RESPONSAVEL: string;
  ID_TIPO_PATRIMONIO: number;
  STATUS: number;
  HORIMETRO: number;
  IDENTIFICADOR: string;
}

export interface PatrimonioDomain {
  id: number;
  descricao: string;
  marca: string;
  placa: string;
  chassisSerie: string;
  anoFabricacao: number;
  renavam: string;
  proprietario: string;
  tipoBem: number;
  nomeResponsavel: string;
  idTipoPatriomonio: number;
  status: number;
  horimetro: number;
  identificador: string;
}
