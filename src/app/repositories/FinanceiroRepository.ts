import database from '../../database';
import TotalMapper from './mappers/TotalMapper';

import { TotalDomain } from '../../types/TotalTypes';
import {
  cashFlowBalanceQuery,
  cashFlowBalanceQueryBySafra,
  cashFlowBalancePlanBySafraQuery,
  cashFlowBalancePlanQuery,
  cashFlowCreditsQuery,
  cashFlowCreditsQueryBySafra,
  cashFlowDebitsQuery,
  cashFlowDebitsQueryBySafra,
  cashFlowCreditsPlanBySafraQuery,
  cashFlowCreditsPlanQuery,
  cashFlowDebitsPlanBySafraQuery,
  cashFlowDebitsPlanQuery,
} from '../../database/queries/financeiroQueries';
import { format } from 'date-fns';
import { CashFlowDomain } from '../../types/FinanceiroTypes';
import FinanceiroMapper from './mappers/FinanceiroMapper';

class FinanceiroRepository {
  findTotal(tipo: 'pagar' | 'receber', period: 0 | 7 | 15 = 0, idSafra?: number) {
    return new Promise<TotalDomain>((resolve, reject) => {
      let query = `
      SELECT
      COUNT(conta_receber_pagar.id) AS quantidade,
      SUM(
        conta_receber_pagar.valor_parcela -
        conta_receber_pagar.total_pago +
        conta_receber_pagar.total_multa +
        conta_receber_pagar.total_juros -
        conta_receber_pagar.total_desconto
      ) AS total
      FROM conta_receber_pagar
      LEFT JOIN crp_m ON crp_m.id = conta_receber_pagar.id_crp_m
      WHERE crp_m.tipo = ? AND conta_receber_pagar.situacao = 'A'
      ${period !== 0 ? `
      AND conta_receber_pagar.data_vencimento >= current_date
      AND conta_receber_pagar.data_vencimento < current_date + ${period}
      ` : ''}
      `;

      if (idSafra) {
        query = `
        SELECT
        COUNT(conta_receber_pagar.id) AS quantidade,
        CAST(SUM(
          (
            conta_receber_pagar.valor_parcela -
            conta_receber_pagar.total_pago +
            conta_receber_pagar.total_multa +
            conta_receber_pagar.total_juros -
            conta_receber_pagar.total_desconto
          ) *
          ((crp_apropriacao.valor * 100) / conta_receber_pagar.valor_parcela) / 100 *
          (CAST(conta_receber_pagar_ciclo.proporcao as NUMERIC(15,8)) / 100)
        ) AS NUMERIC(15,2)) AS total
        FROM conta_receber_pagar_ciclo
        LEFT JOIN crp_apropriacao ON crp_apropriacao.id = conta_receber_pagar_ciclo.id_crp_apropriacao
        LEFT JOIN conta_receber_pagar ON conta_receber_pagar.id = crp_apropriacao.id_conta_receber_pagar
        LEFT JOIN crp_m ON crp_m.id = conta_receber_pagar.id_crp_m
        WHERE crp_m.tipo = ? AND conta_receber_pagar.situacao = 'A'
        AND conta_receber_pagar_ciclo.id_ciclo_producao = ?
        ${period !== 0 ? `
        AND conta_receber_pagar.data_vencimento >= current_date
        AND conta_receber_pagar.data_vencimento < current_date + ${period}
        ` : ''}
        `;
      }

      database.query(
        query, [tipo === 'receber' ? 1 : 2, ...(idSafra ? [idSafra] : [])],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(TotalMapper.toTotalDomain(result));
        }
      );
    });
  }

  findCurrentBalance(date: Date) {
    return new Promise<number>((resolve, reject) => {
      const parsedDate = format(date, 'yyyy-MM-dd');

      database.query(
        `
        select sum(
          case when tipo_lancamento = 'D'
          then(valor_principal * -1)
          else(valor_principal) end) as saldo_atual
        from movimento_conta_m
        where data_compensacao < dateadd(day, -1, date '${parsedDate}')
        and compensado = 'S'
        `, [],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(result.SALDO_ATUAL || 0);
        }
      );
    });
  }

  findCashFlowBalance(startDate: Date, endDate: Date, idSafra?: number) {
    return new Promise<CashFlowDomain[]>((resolve, reject) => {
      const query = idSafra
        ? cashFlowBalanceQueryBySafra(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          idSafra
        )
        : cashFlowBalanceQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
        );

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((cashFlow) => FinanceiroMapper.toCashFlowDomain(cashFlow)));
        }
      );
    });
  }

  findCashFlowBalancePlan(startDate: Date, endDate: Date, idSafra?: number) {
    return new Promise<CashFlowDomain[]>((resolve, reject) => {
      const query = idSafra
        ? cashFlowBalancePlanBySafraQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          idSafra
        )
        : cashFlowBalancePlanQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
        );

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((cashFlow) => FinanceiroMapper.toCashFlowDomain(cashFlow)));
        }
      );
    });
  }

  findCashFlowCredits(startDate: Date, endDate: Date, idSafra?: number) {
    return new Promise<CashFlowDomain[]>((resolve, reject) => {
      const query = idSafra
        ? cashFlowCreditsQueryBySafra(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          idSafra,
        )
        : cashFlowCreditsQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
        );

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((cashFlow) => FinanceiroMapper.toCashFlowDomain(cashFlow)));
        }
      );
    });
  }

  findCashFlowCreditsPlan(startDate: Date, endDate: Date, idSafra?: number) {
    return new Promise<CashFlowDomain[]>((resolve, reject) => {
      const query = idSafra
        ? cashFlowCreditsPlanBySafraQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          idSafra
        )
        : cashFlowCreditsPlanQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
        );

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((cashFlow) => FinanceiroMapper.toCashFlowDomain(cashFlow)));
        }
      );
    });
  }

  findCashFlowDebits(startDate: Date, endDate: Date, idSafra?: number) {
    return new Promise<CashFlowDomain[]>((resolve, reject) => {
      const query = idSafra
        ? cashFlowDebitsQueryBySafra(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          idSafra
        )
        : cashFlowDebitsQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
        );

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((cashFlow) => FinanceiroMapper.toCashFlowDomain(cashFlow)));
        }
      );
    });
  }

  findCashFlowDebitsPlan(startDate: Date, endDate: Date, idSafra?: number) {
    return new Promise<CashFlowDomain[]>((resolve, reject) => {
      const query = idSafra
        ? cashFlowDebitsPlanBySafraQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          idSafra
        )
        : cashFlowDebitsPlanQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
        );

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((cashFlow) => FinanceiroMapper.toCashFlowDomain(cashFlow)));
        }
      );
    });
  }
}

export default new FinanceiroRepository();
