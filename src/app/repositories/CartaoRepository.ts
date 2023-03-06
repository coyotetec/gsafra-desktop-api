import database from '../../database';
import TotalMapper from './mappers/TotalMapper';

import { TotalDomain } from '../../types/TotalTypes';
import { format } from 'date-fns';

interface FindTotalArgs {
  startDate?: Date;
  endDate?: Date;
  idSafra?: number;
}

class CartaoRepository {
  findLimitTotal() {
    return new Promise<number>((resolve, reject) => {
      database.query(
        `
        SELECT
        SUM(limite) AS total
        FROM cartao
        `, [],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(result.TOTAL || 0);
        }
      );
    });
  }

  findTotal({ startDate, endDate, idSafra }: FindTotalArgs) {
    return new Promise<TotalDomain>((resolve, reject) => {
      let query = `
      SELECT
      COUNT(id) AS quantidade,
      SUM(valor) AS total
      FROM cartao_pagar_d
      WHERE situacao = 0
      ${startDate ? `AND vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND vencimento <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      `;

      if (idSafra) {
        query = `
        SELECT
        COUNT(cartao_pagar_d.id) as quantidade,
        CAST(
          SUM(
            cartao_pagar_d.valor *
            (((cartao_pagar_d_apropriacao.valor * 100) / cartao_pagar_d.valor) / 100) *
            (cartao_pagar_d_ciclo.proporcao / 100)
          ) AS NUMERIC(15,2)
        ) AS total
        FROM cartao_pagar_d_ciclo
        INNER JOIN cartao_pagar_d_apropriacao ON cartao_pagar_d_apropriacao.id = cartao_pagar_d_ciclo.id_cartao_pagar_d_apropriacao
        INNER JOIN cartao_pagar_d ON cartao_pagar_d.id = cartao_pagar_d_apropriacao.id_cartao_pagar_d
        WHERE cartao_pagar_d.situacao = 0
        ${startDate ? `AND cartao_pagar_d.vencimento >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `AND cartao_pagar_d.vencimento <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        AND cartao_pagar_d_ciclo.id_ciclo_producao = ?
        `;
      }

      database.query(
        query, [...(idSafra ? [idSafra] : [])],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(TotalMapper.toTotalDomain(result));
        }
      );
    });
  }
}

export default new CartaoRepository();
