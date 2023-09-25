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
import { CashFlowDomain, financialStatus } from '../../types/FinanceiroTypes';
import FinanceiroMapper from './mappers/FinanceiroMapper';

interface FindTotalArgs {
  tipo: 'pagar' | 'receber';
  period: 0 | 7 | 15;
  status?: financialStatus;
  startDate?: Date;
  endDate?: Date;
  idSafra?: string;
}

class FinanceiroRepository {
  findTotal({
    tipo,
    status,
    startDate,
    endDate,
    period = 0,
    idSafra,
  }: FindTotalArgs) {
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
      INNER JOIN crp_m ON crp_m.id = conta_receber_pagar.id_crp_m
      WHERE crp_m.tipo = ?
      AND conta_receber_pagar.situacao = 'A'
      ${status ? `AND crp_m.tipo_lancto_financeiro = ${status === 'real' ? 1 : 2}` : ''}
      ${period !== 0 ? `
      ${startDate ? `AND conta_receber_pagar.data_vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${startDate ? `AND conta_receber_pagar.data_vencimento <= dateadd(day, ${period}, date '${format(startDate, 'yyyy-MM-dd')}')` : ''}
      ` : `
      ${startDate ? `AND conta_receber_pagar.data_vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND conta_receber_pagar.data_vencimento <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      `}
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
          (CAST(conta_receber_pagar_ciclo.proporcao as NUMERIC(15,5)) / 100)
        ) AS NUMERIC(15,2)) AS total
        FROM conta_receber_pagar_ciclo
        INNER JOIN crp_apropriacao ON crp_apropriacao.id = conta_receber_pagar_ciclo.id_crp_apropriacao
        INNER JOIN conta_receber_pagar ON conta_receber_pagar.id = crp_apropriacao.id_conta_receber_pagar
        INNER JOIN crp_m ON crp_m.id = conta_receber_pagar.id_crp_m
        WHERE crp_m.tipo = ?
        AND conta_receber_pagar_ciclo.id_ciclo_producao in (${idSafra})
        AND conta_receber_pagar.situacao = 'A'
        ${status ? `AND crp_m.tipo_lancto_financeiro = ${status === 'real' ? 1 : 2}` : ''}
        ${period !== 0 ? `
        ${startDate ? `AND conta_receber_pagar.data_vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${startDate ? `AND conta_receber_pagar.data_vencimento <= dateadd(day, ${period}, date '${format(startDate, 'yyyy-MM-dd')}')` : ''}
        ` : `
        ${startDate ? `AND conta_receber_pagar.data_vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `AND conta_receber_pagar.data_vencimento <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        `}
        `;
      }

      database.query(
        query, [tipo === 'receber' ? 1 : 2],
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
        where data_compensacao < '${parsedDate}'
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

  findCashFlowBalance(startDate: Date, endDate: Date, idSafra?: string, status?: financialStatus) {
    return new Promise<CashFlowDomain[]>((resolve, reject) => {
      const query = idSafra
        ? cashFlowBalanceQueryBySafra(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          idSafra,
          status
        )
        : cashFlowBalanceQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          status
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

  findCashFlowBalancePlan(startDate: Date, endDate: Date, idSafra?: string) {
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

  findCashFlowCredits(startDate: Date, endDate: Date, idSafra?: string, status?: financialStatus) {
    return new Promise<CashFlowDomain[]>((resolve, reject) => {
      const query = idSafra
        ? cashFlowCreditsQueryBySafra(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          idSafra,
          status
        )
        : cashFlowCreditsQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          status
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

  findCashFlowCreditsPlan(startDate: Date, endDate: Date, idSafra?: string) {
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

  findCashFlowDebits(startDate: Date, endDate: Date, idSafra?: string, status?: financialStatus) {
    return new Promise<CashFlowDomain[]>((resolve, reject) => {
      const query = idSafra
        ? cashFlowDebitsQueryBySafra(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          idSafra,
          status
        )
        : cashFlowDebitsQuery(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          status
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

  findCashFlowDebitsPlan(startDate: Date, endDate: Date, idSafra?: string) {
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
