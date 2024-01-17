import {
  PatrimonioDomain,
  PatrimonioPersistence,
} from '../../../types/PatrimonioTypes';

class PatrimonioMapper {
  toDomain(persistence: PatrimonioPersistence): PatrimonioDomain {
    return {
      id: persistence.ID,
      descricao: persistence.DESCRICAO,
      marca: persistence.MARCA,
      placa: persistence.PLACA,
      chassisSerie: persistence.CHASSIS_SERIE,
      anoFabricacao: persistence.ANO_FABRICACAO,
      renavam: persistence.RENAVAM,
      proprietario: persistence.PROPRIETARIO,
      tipoBem: persistence.TIPO_BEM,
      nomeResponsavel: persistence.NOME_RESPONSAVEL,
      idTipoPatriomonio: persistence.ID_TIPO_PATRIMONIO,
      status: persistence.STATUS,
      horimetro: persistence.HORIMETRO,
      identificador: persistence.IDENTIFICADOR,
    };
  }
}

export default new PatrimonioMapper();
