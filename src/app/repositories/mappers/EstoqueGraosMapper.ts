import {
  EntradasGraosDomain,
  EntradasGraosPersistence,
  EntradasGraosProdutorDomain,
  EntradasGraosProdutorPersistence,
  SaidasGraosDomain,
  SaidasGraosPersistence,
  SaidasGraosProdutorDomain,
  SaidasGraosProdutorPersistence,
  SaldoProdutorDomain,
  SaldoProdutorPersistence,
} from '../../../types/EstoqueGraos';

class EstoqueGraosMapper {
  toEntradaDomain(persistence: EntradasGraosPersistence): EntradasGraosDomain {
    return {
      peso: persistence.PESO,
      descontoClassificacao: persistence.DESCONTO_CLASSIFICACAO,
      taxaRecepcao: persistence.TAXA_RECEPCAO,
      cotaCapital: persistence.COTA_CAPITAL,
      taxaArmazenamento: persistence.TAXA_ARMAZENAMENTO,
      quebraTecnica: persistence.QUEBRA_TECNICA,
      pesoLiquido:
        persistence.PESO -
        (persistence.DESCONTO_CLASSIFICACAO +
          persistence.TAXA_RECEPCAO +
          persistence.COTA_CAPITAL +
          persistence.TAXA_ARMAZENAMENTO +
          persistence.QUEBRA_TECNICA),
    };
  }

  toSaidaDomain(persistence: SaidasGraosPersistence): SaidasGraosDomain {
    return {
      peso: persistence.PESO,
      descontoClassificacao: persistence.DESCONTO_CLASSIFICACAO,
      pesoLiquido: persistence.PESO - persistence.DESCONTO_CLASSIFICACAO,
    };
  }

  toEntradaProdutorDomain(
    persistence: EntradasGraosProdutorPersistence,
  ): EntradasGraosProdutorDomain {
    return {
      idProdutor: persistence.ID_PRODUTOR,
      produtor: persistence.PRODUTOR,
      peso: persistence.PESO,
      descontoClassificacao: persistence.DESCONTO_CLASSIFICACAO,
      taxaRecepcao: persistence.TAXA_RECEPCAO,
      cotaCapital: persistence.COTA_CAPITAL,
      taxaArmazenamento: persistence.TAXA_ARMAZENAMENTO,
      quebraTecnica: persistence.QUEBRA_TECNICA,
      pesoLiquido:
        persistence.PESO -
        (persistence.DESCONTO_CLASSIFICACAO +
          persistence.TAXA_RECEPCAO +
          persistence.COTA_CAPITAL +
          persistence.TAXA_ARMAZENAMENTO +
          persistence.QUEBRA_TECNICA),
    };
  }

  toSaidaProdutorDomain(
    persistence: SaidasGraosProdutorPersistence,
  ): SaidasGraosProdutorDomain {
    return {
      idProdutor: persistence.ID_PRODUTOR,
      produtor: persistence.PRODUTOR,
      peso: persistence.PESO,
      descontoClassificacao: persistence.DESCONTO_CLASSIFICACAO,
      pesoLiquido: persistence.PESO - persistence.DESCONTO_CLASSIFICACAO,
    };
  }

  toSaldoProdutorDomain(
    persistence: SaldoProdutorPersistence,
  ): SaldoProdutorDomain {
    return {
      idProdutor: persistence.ID_PRODUTOR,
      produtor: persistence.PRODUTOR,
      saldo: persistence.SALDO,
    };
  }
}

export default new EstoqueGraosMapper();
