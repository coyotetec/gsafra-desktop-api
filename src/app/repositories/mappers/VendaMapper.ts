import {
  PrecoMedioClienteDomain,
  PrecoMedioClientePersistence,
  PrecoMedioMesDomain,
  PrecoMedioMesPersistence,
  RomaneioDomain,
  RomaneioPersistence,
  VendaDomain,
  VendaPersistence,
} from '../../../types/VendaTypes';

class VendaMapper {
  toDomain(persistence: VendaPersistence): VendaDomain {
    return {
      idCliente: persistence.ID_CLIENTE,
      cliente: persistence.CLIENTE,
      total: persistence.TOTAL,
      totalEntregue: persistence.TOTAL_ENTREGUE,
      porcentagem: (persistence.TOTAL_ENTREGUE * 100) / persistence.TOTAL,
    };
  }

  toRomaneioDomain(persistence: RomaneioPersistence): RomaneioDomain {
    return {
      cliente: persistence.CLIENTE,
      data: persistence.DATA,
      numeroOrdem: persistence.NUMERO_ORDEM,
      quantidade: persistence.QUANTIDADE,
      localSaida: persistence.LOCAL_SAIDA,
      motorista: persistence.MOTORISTA,
      placa: persistence.PLACA,
    };
  }

  toPrecoMedioClienteDomain(
    persistence: PrecoMedioClientePersistence,
  ): PrecoMedioClienteDomain {
    return {
      cliente: persistence.CLIENTE,
      precoMedioKg: persistence.PRECO_MEDIO_KG,
      precoMedioSaca: persistence.PRECO_MEDIO_KG * 60,
    };
  }

  toPrecoMedioMesDomain(
    persistence: PrecoMedioMesPersistence,
  ): PrecoMedioMesDomain {
    return {
      mes: persistence.MES,
      ano: persistence.ANO,
      valorTotal: persistence.VALOR_TOTAL,
      quantidadeTotal: persistence.QUANTIDADE_TOTAL,
      precoMedioKg: persistence.VALOR_TOTAL / persistence.QUANTIDADE_TOTAL,
      precoMedioSaca:
        (persistence.VALOR_TOTAL / persistence.QUANTIDADE_TOTAL) * 60,
    };
  }
}

export default new VendaMapper();
