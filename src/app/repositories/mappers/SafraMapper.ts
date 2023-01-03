import { SafraDomain, SafraPersistence } from '../../../types/SafraTypes';

class SafraMapper {
  toTotalDomain(persistence: SafraPersistence): SafraDomain {
    return {
      id: persistence.ID,
      nome: persistence.NOME,
      idCultura: persistence.ID_CULTURA,
      dataIncio: persistence.DATA_INICIO,
      dataFinal: persistence.DATA_FINAL,
      status: persistence.STATUS,
      producaoEstimada: persistence.PRODUCAO_ESTIMADA,
      producaoMinima: persistence.PRODUCAO_MINIMA,
      valorMedioVenda: persistence.VALOR_MEDIO_VENDA,
    };
  }
}

export default new SafraMapper();
