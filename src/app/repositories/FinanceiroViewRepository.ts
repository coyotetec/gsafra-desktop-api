import database from '../../database';
import {
  ViewColumnDomain,
  ViewDetailDomain,
  ViewTotalizadorDomain,
} from '../../types/FinanceiroViewTypes';
import FinanceiroViewMapper from './mappers/FinanceiroViewMapper';

class FinanceiroViewRepository {
  findAll(databaseName: string) {
    return new Promise((resolve, reject) => {
      database.query(
        databaseName,
        `
        select * from financeiro_view_m
        where situacao = 1
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(
            result.map((view) => FinanceiroViewMapper.toViewDomain(view)),
          );
        },
      );
    });
  }

  findViewColumns(
    databaseName: string,
    idView: number,
  ): Promise<ViewColumnDomain[]> {
    return new Promise((resolve, reject) => {
      database.query(
        databaseName,
        `
        select * from financeiro_view_d
        where id_financeiro_view_m = ?
        `,
        [idView],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(
            result.map((column) =>
              FinanceiroViewMapper.toViewColumnDomain(column),
            ),
          );
        },
      );
    });
  }

  findViewTotal(databaseName: string, query: string): Promise<number> {
    return new Promise((resolve, reject) => {
      database.query(databaseName, query, [], (err, [result]) => {
        if (err) {
          reject(err);
        }

        resolve(result.TOTAL || 0);
      });
    });
  }

  findViewDetails(
    databaseName: string,
    nome: string,
    query: string,
  ): Promise<ViewDetailDomain[]> {
    return new Promise((resolve, reject) => {
      database.query(databaseName, query, [], (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(
          result.map((column) => ({
            nome,
            ...FinanceiroViewMapper.toViewDetailDomain(column),
          })),
        );
      });
    });
  }

  findTotalizadores(
    databaseName: string,
    idView: number,
  ): Promise<ViewTotalizadorDomain[]> {
    return new Promise((resolve, reject) => {
      database.query(
        databaseName,
        `
        select * from financeiro_view_totalizador
        where financeiro_view_totalizador.id_financeiro_view_m = ?
        `,
        [idView],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(
            result.map((totalizador) =>
              FinanceiroViewMapper.toTotalizadorDomain(totalizador),
            ),
          );
        },
      );
    });
  }
}

export default new FinanceiroViewRepository();
