import database from '../../database';
import TotalMapper from './mappers/TotalMapper';

import { TotalDomain } from '../../types/TotalTypes';
import { format } from 'date-fns';

interface FindTotalArgs {
  tipo: 'pagar' | 'receber';
  period: 0 | 7 | 15;
  startDate?: Date;
  endDate?: Date;
  idSafra?: string;
}

class ChequeRepository {
  findTotal(
    databaseName: string,
    { tipo, startDate, endDate, period = 0, idSafra }: FindTotalArgs,
  ) {
    return new Promise<TotalDomain>((resolve, reject) => {
      let query = `
      SELECT
      COUNT(id) AS quantidade,
      SUM(valor) AS total
      FROM cheque
      WHERE tipo = ? AND situacao = 'A'
      ${
        period !== 0
          ? `
      ${startDate ? `AND data_vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${startDate ? `AND data_vencimento <= dateadd(day, ${period}, date '${format(startDate, 'yyyy-MM-dd')}')` : ''}
      `
          : `
      ${startDate ? `AND data_vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND data_vencimento <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      `
      }
      `;

      if (idSafra) {
        query = `
        SELECT
        COUNT(cheque.id) as quantidade,
        CAST(
          SUM(
            cheque.valor *
            (((cheque_apropriacao.valor * 100) / cheque.valor) / 100) *
            (cheque_ciclo.proporcao / 100)
          ) AS NUMERIC(15,2)
        ) AS total
        FROM cheque_ciclo
        INNER JOIN cheque_apropriacao ON cheque_apropriacao.id = cheque_ciclo.id_cheque_apropriacao
        INNER JOIN cheque ON cheque.id = cheque_apropriacao.id_cheque
        WHERE cheque.tipo = ? AND cheque.situacao = 'A'
        AND cheque_ciclo.id_ciclo_producao in (${idSafra})
        ${
          period !== 0
            ? `
        ${startDate ? `AND data_vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${startDate ? `AND data_vencimento <= dateadd(day, ${period}, date '${format(startDate, 'yyyy-MM-dd')}')` : ''}
        `
            : `
        ${startDate ? `AND data_vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `AND data_vencimento <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        `
        }
        `;
      }

      database.query(
        databaseName,
        query,
        [tipo === 'receber' ? 'R' : 'E'],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(TotalMapper.toTotalDomain(result));
        },
      );
    });
  }
}

export default new ChequeRepository();
