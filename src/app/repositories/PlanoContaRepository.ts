import { format } from 'date-fns';
import database from '../../database';
import PlanoContaMapper from './mappers/PlanoContaMapper';

interface FindTotalArgs {
  codigo: string;
  startDate?: Date;
  endDate?: Date;
  idSafra?: number;
}

class PlanoContaRepository {
  findAll(type?: 'receita' | 'despesa', category?: 'sintetica' | 'analitica') {
    return new Promise((resolve, reject) => {
      const query = `
      select * from plano_conta
      where id > 0
      ${type ? `and tipo = ${type === 'receita' ? '\'R\'' : '\'D\''}` : ''}
      ${category ? `and categoria = ${category === 'sintetica' ? 1 : 2}` : ''}
      order by codigo
      `;

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((planoConta) => PlanoContaMapper.toPlanoContaDomain(planoConta)));
        }
      );
    });
  }

  findTotal({ codigo, startDate, endDate, idSafra }: FindTotalArgs) {
    return new Promise((resolve, reject) => {
      let query = `
      select sum(movimento_conta_apropriacao.valor) as total, plano_conta.descricao as descricao
      from movimento_conta_apropriacao
      left join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
      left join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
      left join plano_conta on movimento_conta_apropriacao.id_plano_conta = plano_conta.id
      where plano_conta.codigo like '${codigo}.%'
      and plano_conta.categoria = 2
      ${startDate ? `and movimento_conta_m.data_compensacao >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `and movimento_conta_m.data_compensacao <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      group by descricao
      order by total desc
      `;

      if (idSafra) {
        query = `
        select sum(movimento_conta_ciclo.valor) as total, plano_conta.descricao as descricao
        from movimento_conta_ciclo
        left join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
        left join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
        left join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
        left join plano_conta on plano_conta.id = movimento_conta_apropriacao.id_plano_conta
        where plano_conta.codigo like '${codigo}.%'
        and plano_conta.categoria = 2
        and movimento_conta_ciclo.id_ciclo_producao = ${idSafra}
        ${startDate ? `and movimento_conta_m.data_compensacao >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and movimento_conta_m.data_compensacao <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        group by descricao
        order by total desc
        `;
      }

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((planoConta) => PlanoContaMapper.toTotalDomain(planoConta)));
        }
      );
    });
  }
}

export default new PlanoContaRepository();
