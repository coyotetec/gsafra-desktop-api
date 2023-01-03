import database from '../../database';
import { ViewColumnDomain, ViewDetailDomain } from '../../types/FinanceiroViewTypes';
import FinanceiroViewMapper from './mappers/FinanceiroViewMapper';

class FinanceiroViewRepository {
  findAll() {
    return new Promise((resolve, reject) => {
      database.query(
        `
        select * from financeiro_view_m
        where situacao = 1
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((view) => FinanceiroViewMapper.toViewDomain(view)));
        }
      );
    });
  }

  findViewColumns(idView: number): Promise<ViewColumnDomain[]> {
    return new Promise((resolve, reject) => {
      database.query(
        `
        select * from financeiro_view_d
        where id_financeiro_view_m = ?
        `, [idView],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((column) => FinanceiroViewMapper.toViewColumnDomain(column)));
        });
    });
  }

  findViewTotal(query: string): Promise<number> {
    return new Promise((resolve, reject) => {
      database.query(
        query, [],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(result.TOTAL);
        });
    });
  }

  findViewDetails(nome: string, query: string): Promise<ViewDetailDomain[]> {
    return new Promise((resolve, reject) => {
      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((column) => ({ nome, ...FinanceiroViewMapper.toViewDetailDomain(column) })));
        });
    });
  }
}

export default new FinanceiroViewRepository();
