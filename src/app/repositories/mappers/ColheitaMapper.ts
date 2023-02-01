import { TotalDomain, TotalPersistence } from '../../../types/ColheitaTypes';

class SafraMapper {
  toTotalDomain(persistence: TotalPersistence): TotalDomain {
    return {
      talhao: persistence.TALHAO,
      tamanhoTalhao: persistence.TAMANHO_TALHAO,
      total: persistence.TOTAL_PRODUCAO,
      sacas: Number((persistence.TOTAL_PRODUCAO / 60).toFixed(2)),
      totalPorHectare: Number((persistence.TOTAL_PRODUCAO / persistence.TAMANHO_TALHAO).toFixed(2)),
      sacasPorHectare: Number(((persistence.TOTAL_PRODUCAO / 60) / persistence.TAMANHO_TALHAO).toFixed(2)),
    };
  }
}

export default new SafraMapper();
