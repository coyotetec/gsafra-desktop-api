import {
  DescontoTotalDomain,
  DescontoTotalPersistence,
  TotalDomain,
  TotalPersistence,
} from '../../../types/ColheitaTypes';

class SafraMapper {
  toTotalDomain(persistence: TotalPersistence): TotalDomain {
    return {
      talhao: persistence.TALHAO,
      tamanhoTalhao: persistence.TAMANHO_TALHAO,
      total: persistence.TOTAL_PRODUCAO,
      sacas: Number((persistence.TOTAL_PRODUCAO / 60).toFixed(2)),
      totalPorHectare: Number(
        (persistence.TOTAL_PRODUCAO / persistence.TAMANHO_TALHAO).toFixed(2),
      ),
      sacasPorHectare: Number(
        (persistence.TOTAL_PRODUCAO / 60 / persistence.TAMANHO_TALHAO).toFixed(
          2,
        ),
      ),
    };
  }

  toDescontoTotalDomain(
    persistence: DescontoTotalPersistence,
  ): DescontoTotalDomain {
    return {
      talhao: persistence.TALHAO,
      pesoTotal: persistence.PESO_TOTAL,
      descontoTotal: persistence.DESCONTO_TOTAL,
      descontoPorcentagem: Number(
        ((persistence.DESCONTO_TOTAL * 100) / persistence.PESO_TOTAL).toFixed(
          2,
        ),
      ),
      descontoReal: persistence.DESCONTO_REAL,
    };
  }
}

export default new SafraMapper();
