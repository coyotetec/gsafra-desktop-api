import { format } from 'date-fns';
import database from '../../database';
import { accountMovementsBySafraQuery, accountMovementsQuery } from '../../database/queries/movimentoContaQueries';
import MovimentoContaMapper from './mappers/MovimentoContaMapper';

interface FindAllArgs {
  codigo: string;
  startDate?: Date;
  endDate?: Date;
  idSafra?: string;
}

class MovimentoContaRepository {
  findAll({ codigo, startDate, endDate, idSafra }: FindAllArgs) {
    return new Promise((resolve, reject) => {
      let query = accountMovementsQuery(
        codigo,
        startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      );

      if (idSafra) {
        query = accountMovementsBySafraQuery(
          codigo,
          idSafra,
          startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
          endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        );
      }

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((movimentoConta) => (
            MovimentoContaMapper.toMovimentoContaDomain(movimentoConta)
          )));
        }
      );
    });
  }
}

export default new MovimentoContaRepository();
