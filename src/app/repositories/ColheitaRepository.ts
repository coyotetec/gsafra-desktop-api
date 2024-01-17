import database from '../../database';
import { DescontoTotalDomain, TotalDomain } from '../../types/ColheitaTypes';
import ColheitaMapper from './mappers/ColheitaMapper';

export type descontoType =
  | 'umidade'
  | 'impureza'
  | 'avariados'
  | 'quebrados'
  | 'esverdeados'
  | 'taxa_recepcao'
  | 'cota';

class ColheitaRepository {
  findTotal(databaseName: string, idSafra: number) {
    return new Promise<TotalDomain[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
          coalesce(sum(colheita_talhao.peso_liquido + colheita_talhao.cota_desc_kg + colheita_talhao.taxa_recepcao_desc_kg), 0) as total_producao,
          talhao.descricao as talhao,
          talhao_safra.hectares as tamanho_talhao
        from colheita_talhao
        inner join colheita on colheita.id = colheita_talhao.id_colheita
        right join talhao_safra on talhao_safra.id = colheita_talhao.id_talhao_safra
        right join talhao on talhao.id = talhao_safra.id_talhao
        where talhao_safra.id_ciclo_producao = ${idSafra}
        and colheita.tipo_romaneio = 1
        and colheita.situacao = 2
        group by talhao, tamanho_talhao
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => ColheitaMapper.toTotalDomain(item)));
        },
      );
    });
  }

  findDescontoTotal(
    databaseName: string,
    idSafra: number,
    desconto: descontoType,
  ) {
    return new Promise<DescontoTotalDomain[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
          coalesce(sum(colheita_talhao.peso), 0) as peso_total,
          ${
            desconto === 'umidade'
              ? `
          coalesce(sum((colheita.umidade_classificacao / 100) * colheita_talhao.peso), 0) as desconto_total,
          coalesce(sum(colheita_talhao.umidade_desc_kg), 0) as desconto_real,
          `
              : ''
          }
          ${
            desconto === 'impureza'
              ? `
          coalesce(sum((colheita.impureza_classificacao / 100) * colheita_talhao.peso), 0) as desconto_total,
          coalesce(sum(colheita_talhao.impureza_desc_kg), 0) as desconto_real,
          `
              : ''
          }
          ${
            desconto === 'avariados'
              ? `
          coalesce(sum((colheita.avariados_classificacao / 100) * colheita_talhao.peso), 0) as desconto_total,
          coalesce(sum(colheita_talhao.avariados_desc_kg), 0) as desconto_real,
          `
              : ''
          }
          ${
            desconto === 'quebrados'
              ? `
          coalesce(sum((colheita.quebrado_classificacao / 100) * colheita_talhao.peso), 0) as desconto_total,
          coalesce(sum(colheita_talhao.quebrado_desc_kg), 0) as desconto_real,
          `
              : ''
          }
          ${
            desconto === 'esverdeados'
              ? `
          coalesce(sum((colheita.esverdeados_classificacao / 100) * colheita_talhao.peso), 0) as desconto_total,
          coalesce(sum(colheita_talhao.esverdeados_desc_kg), 0) as desconto_real,
          `
              : ''
          }
          ${
            desconto === 'taxa_recepcao'
              ? `
          coalesce(sum((colheita.taxa_recepcao_classificacao / 100) * colheita_talhao.peso), 0) as desconto_total,
          coalesce(sum(colheita_talhao.taxa_recepcao_desc_kg), 0) as desconto_real,
          `
              : ''
          }
          ${
            desconto === 'cota'
              ? `
          coalesce(sum((colheita.cota_classificacao / 100) * colheita_talhao.peso), 0) as desconto_total,
          coalesce(sum(colheita_talhao.cota_desc_kg), 0) as desconto_real,
          `
              : ''
          }
          talhao.descricao as talhao
        from colheita_talhao
        inner join colheita on colheita.id = colheita_talhao.id_colheita
        inner join talhao_safra on talhao_safra.id = colheita_talhao.id_talhao_safra
        inner join talhao on talhao.id = talhao_safra.id_talhao
        where talhao_safra.id_ciclo_producao = ${idSafra}
        and colheita.tipo_romaneio = 1
        and colheita.situacao = 2
        group by talhao
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(
            result.map((item) => ColheitaMapper.toDescontoTotalDomain(item)),
          );
        },
      );
    });
  }
}

export default new ColheitaRepository();
