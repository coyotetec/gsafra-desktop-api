import database from '../../database';

import { custoCategoriaQuery, custoPorTalhaoQuery } from '../../database/queries/custoProducaoQueries';
import { format } from 'date-fns';
import CustoProducaoMapper from './mappers/CustoProducaoMapper';
import { CustoCategoriaDomain, CustoTalhaoDomain } from '../../types/CustoProducaoTypes';

interface FindCustoCategoriaArgs {
  idSafra: string;
  idTalhao?: number;
  startDate?: Date;
  endDate?: Date
}

class CustoProducaoRepository {
  findCustoCategoria({ idSafra, idTalhao, startDate, endDate }: FindCustoCategoriaArgs) {
    return new Promise<CustoCategoriaDomain[]>((resolve, reject) => {
      const query = custoCategoriaQuery({
        idSafra,
        idTalhao,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined
      });

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => CustoProducaoMapper.toCategoriaDomain(item)));
        }
      );
    });
  }

  findCustoTalhao({ idSafra, idTalhao, startDate, endDate }: FindCustoCategoriaArgs) {
    return new Promise<CustoTalhaoDomain[]>((resolve, reject) => {
      const query = custoPorTalhaoQuery({
        idSafra,
        idTalhao,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined
      });

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => CustoProducaoMapper.toTalhaoDomain(item)));
        }
      );
    });
  }
}

export default new CustoProducaoRepository();
