import database from '../../database';

import { custoCategoriaQuery } from '../../database/queries/custoProducaoQueries';
import { format } from 'date-fns';
import CustoProducaoMapper from './mappers/CustoProducaoMapper';
import { CustoCategoriaDomain } from '../../types/CustoProducaoTypes';

interface FindCustoCategoriaArgs {
  idSafra: number;
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
}

export default new CustoProducaoRepository();
