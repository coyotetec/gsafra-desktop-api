import {
  TotalPersistence,
  TotalDomain,
  TotalFuelPersistence,
  TotalFuelDomain,
  TotalPatrimonyPersistence,
  TotalPatrimonyDomain,
  DetailsPersistence,
  DetailsDomain
} from '../../../types/AbastecimentoTypes';

class AbastecimentoMapper {
  toTotalDomain(persistence: TotalPersistence): TotalDomain {
    return {
      total: persistence.TOTAL,
      mes: persistence.MES,
      ano: persistence.ANO
    };
  }

  toTotalFuelDomain(persistence: TotalFuelPersistence): TotalFuelDomain {
    return {
      total: persistence.TOTAL,
      combustivel: persistence.COMBUSTIVEL
    };
  }

  toTotalPatrimonyDomain(persistence: TotalPatrimonyPersistence): TotalPatrimonyDomain {
    return {
      total: persistence.TOTAL,
      tipoPatrimonio: persistence.TIPO_PATRIMONIO
    };
  }

  toDetailsDomain(persistence: DetailsPersistence): DetailsDomain {
    return {
      mes: `${persistence.MES < 10 ? `0${persistence.MES}` : persistence.MES}/${persistence.ANO}`,
      data: persistence.DATA,
      numeroRequisicao: persistence.NUMERO_REQUISICAO,
      patrimonio: persistence.PATRIMONIO,
      tipoPatrimonio: persistence.TIPO_PATRIMONIO,
      combustivel: persistence.COMBUSTIVEL,
      localSaida: persistence.LOCAL_SAIDA,
      quantidade: persistence.QUANTIDADE,
      custoIndividual: persistence.CUSTO_INDIVIDUAL,
      total: persistence.TOTAL,
    };
  }
}

export default new AbastecimentoMapper();
