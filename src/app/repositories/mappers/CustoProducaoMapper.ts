import {
  CustoCategoriaDomain,
  CustoCategoriaPersistence,
  CustoTalhaoDomain,
  CustoTalhaoPersistence,
} from '../../../types/CustoProducaoTypes';

class CustoProducaoMapper {
  toCategoriaDomain(
    persistence: CustoCategoriaPersistence,
  ): CustoCategoriaDomain {
    return {
      categoria: persistence.CATEGORIA.trim(),
      total: persistence.TOTAL,
    };
  }

  toTalhaoDomain(persistence: CustoTalhaoPersistence): CustoTalhaoDomain {
    return {
      talhao: persistence.TALHAO,
      variedade: persistence.VARIEDADE,
      talhaoVariedade: `${persistence.TALHAO} (${persistence.VARIEDADE})`,
      total: persistence.TOTAL,
      totalPorHectare: persistence.TOTAL / persistence.AREA,
      area: persistence.AREA,
      safra: persistence.SAFRA,
    };
  }
}

export default new CustoProducaoMapper();
