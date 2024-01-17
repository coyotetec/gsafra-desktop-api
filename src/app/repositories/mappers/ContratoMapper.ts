import {
  ContratoDomain,
  ContratoPersistence,
  RomaneioDomain,
  RomaneioPersistence,
} from '../../../types/ContratoTypes';

class ContratoMapper {
  toDomain(persistence: ContratoPersistence): ContratoDomain {
    return {
      id: persistence.ID,
      cliente: persistence.CLIENTE,
      numeroContrato: persistence.NUMERO_CONTRATO,
      totalContrato: persistence.TOTAL_CONTRATO,
      totalEntregue: persistence.TOTAL_ENTREGUE,
      porcentagem:
        (persistence.TOTAL_ENTREGUE * 100) / persistence.TOTAL_CONTRATO,
    };
  }

  toRomaneioDomain(persistence: RomaneioPersistence): RomaneioDomain {
    return {
      data: persistence.DATA,
      numeroOrdem: persistence.NUMERO_ORDEM,
      quantidade: persistence.QUANTIDADE,
      localSaida: persistence.LOCAL_SAIDA,
      motorista: persistence.MOTORISTA,
      placa: persistence.PLACA,
    };
  }
}

export default new ContratoMapper();
