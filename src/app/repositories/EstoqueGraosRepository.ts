import { format } from 'date-fns';
import database from '../../database';
import { EntradasGraosDomain, EntradasGraosProdutorDomain, SaidasGraosDomain, SaidasGraosProdutorDomain, SaldoProdutorDomain } from '../../types/EstoqueGraos';
import EstoqueGraosMapper from './mappers/EstoqueGraosMapper';

interface EstoqueGraosArgs {
  idCultura: number;
  startDate?: Date;
  endDate?: Date;
  idProdutor?: number;
  idArmazenamento?: number;
  idSafra?: number;
}

class EstoqueGraosRepository {
  findEntradas({ idCultura, startDate, endDate, idProdutor, idArmazenamento, idSafra }: EstoqueGraosArgs) {
    return new Promise<EntradasGraosDomain>((resolve, reject) => {
      database.query(
        `
        select
          sum(colheita.subtotal) as peso,
          sum(
            colheita.avariados_desc_kg +
            colheita.esverdeados_desc_kg +
            colheita.quebrado_desc_kg +
            colheita.impureza_desc_kg +
            colheita.umidade_desc_kg
          ) as desconto_classificacao,
          sum(colheita.taxa_recepcao_desc_kg) as taxa_recepcao,
          sum(colheita.cota_desc_kg) as cota_capital,
          coalesce(sum(desconto_armazenamento.taxa_armazenamento), 0) as taxa_armazenamento,
          coalesce(sum(desconto_armazenamento.quebra_tecnica), 0) as quebra_tecnica
        from colheita
        left join (
          select
            desconto_armazenamento_d.id_colheita,
            sum(case when desconto_armazenamento_d.tipo = 1 then desconto_armazenamento_d.desconto_kg end) as taxa_armazenamento,
            sum(case when desconto_armazenamento_d.tipo = 2 then desconto_armazenamento_d.desconto_kg end) as quebra_tecnica
          from desconto_armazenamento_d
          inner join desconto_armazenamento_m on desconto_armazenamento_m.id = desconto_armazenamento_d.id_desconto_armazenamento_m
          where desconto_armazenamento_d.id > 0
          ${startDate ? `and desconto_armazenamento_m.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
          ${endDate ? `and desconto_armazenamento_m.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
          group by desconto_armazenamento_d.id_colheita
        ) desconto_armazenamento on desconto_armazenamento.id_colheita = colheita.id
        where colheita.id_cultura = ${idCultura}
        and colheita.situacao = 2
        ${startDate ? `and colheita.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and colheita.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        ${idProdutor ? `and colheita.id_cliente_silo = ${idProdutor}` : ''}
        ${idArmazenamento ? `and colheita.id_estoque_agri_local = ${idArmazenamento}` : ''}
        ${idSafra ? `and colheita.id_ciclo_producao = ${idSafra}` : ''}
        `, [],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(EstoqueGraosMapper.toEntradaDomain(result));
        }
      );
    });
  }

  findSaidas({ idCultura, startDate, endDate, idProdutor, idArmazenamento, idSafra }: EstoqueGraosArgs) {
    return new Promise<SaidasGraosDomain>((resolve, reject) => {
      database.query(
        `
        select
          coalesce(sum(venda_agricultura_saida.subtotal), 0) as peso,
          coalesce(sum(venda_agricultura_saida.total_descontos), 0) as desconto_classificacao
        from venda_agricultura_saida
        inner join venda_agricultura_item on venda_agricultura_item.id = venda_agricultura_saida.id_venda_agricultura_item
        inner join venda_agricultura on venda_agricultura.id = venda_agricultura_item.id_venda_agricultura
        where venda_agricultura_item.id_cultura = ${idCultura}
        and venda_agricultura_saida.situacao = 2
        ${startDate ? `and venda_agricultura_saida.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and venda_agricultura_saida.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        ${idProdutor ? `and venda_agricultura.id_cliente_silo = ${idProdutor}` : ''}
        ${idArmazenamento ? `and venda_agricultura_saida.id_estoque_agri_local = ${idArmazenamento}` : ''}
        ${idSafra ? `and venda_agricultura_item.id_ciclo_producao = ${idSafra}` : ''}
        `, [],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(EstoqueGraosMapper.toSaidaDomain(result));
        }
      );
    });
  }

  findSaldoAnterior({ idCultura, startDate, idProdutor, idArmazenamento, idSafra }: EstoqueGraosArgs) {
    return new Promise<number>((resolve, reject) => {
      database.query(
        `
        select sum(total) as saldo
        from (
          select
            sum(colheita.peso_liquido) as total
          from colheita
          where colheita.id_cultura = ${idCultura}
          ${startDate ? `and colheita.data < '${format(startDate, 'yyyy-MM-dd')}'` : ''}
          ${idProdutor ? `and colheita.id_cliente_silo = ${idProdutor}` : ''}
          ${idArmazenamento ? `and colheita.id_estoque_agri_local = ${idArmazenamento}` : ''}
          ${idSafra ? `and colheita.id_ciclo_producao = ${idSafra}` : ''}

          union all

          select
            sum(venda_agricultura_saida.qtde_kgs) * -1 as total
          from venda_agricultura_saida
          inner join venda_agricultura_item on venda_agricultura_item.id = venda_agricultura_saida.id_venda_agricultura_item
          inner join venda_agricultura on venda_agricultura.id = venda_agricultura_item.id_venda_agricultura
          where venda_agricultura_item.id_cultura = ${idCultura}
          ${startDate ? `and venda_agricultura_saida.data < '${format(startDate, 'yyyy-MM-dd')}'` : ''}
          ${idProdutor ? `and venda_agricultura.id_cliente_silo = ${idProdutor}` : ''}
          ${idArmazenamento ? `and venda_agricultura_saida.id_estoque_agri_local = ${idArmazenamento}` : ''}
          ${idSafra ? `and venda_agricultura_item.id_ciclo_producao = ${idSafra}` : ''}

          union all

          select
            sum(desconto_armazenamento_d.desconto_kg) * -1 as total
          from desconto_armazenamento_d
          inner join colheita on colheita.id = desconto_armazenamento_d.id_colheita
          where colheita.id_cultura = ${idCultura}
          ${startDate ? `and colheita.data < '${format(startDate, 'yyyy-MM-dd')}'` : ''}
          ${idProdutor ? `and colheita.id_cliente_silo = ${idProdutor}` : ''}
          ${idArmazenamento ? `and colheita.id_estoque_agri_local = ${idArmazenamento}` : ''}
          ${idSafra ? `and colheita.id_ciclo_producao = ${idSafra}` : ''}
        )
        `, [],
        (err, [result]) => {
          if (err) {
            reject(err);
          }

          resolve(result.SALDO);
        }
      );
    });
  }

  findEntradasProdutor({ idCultura, startDate, endDate, idProdutor, idArmazenamento, idSafra }: EstoqueGraosArgs) {
    return new Promise<EntradasGraosProdutorDomain[]>((resolve, reject) => {
      database.query(
        `
        select
          pessoa.id as id_produtor,
          pessoa.razao_social as produtor,
          sum(colheita.subtotal) as peso,
          sum(
            colheita.avariados_desc_kg +
            colheita.esverdeados_desc_kg +
            colheita.quebrado_desc_kg +
            colheita.impureza_desc_kg +
            colheita.umidade_desc_kg
          ) as desconto_classificacao,
          sum(colheita.taxa_recepcao_desc_kg) as taxa_recepcao,
          sum(colheita.cota_desc_kg) as cota_capital,
          coalesce(sum(desconto_armazenamento.taxa_armazenamento), 0) as taxa_armazenamento,
          coalesce(sum(desconto_armazenamento.quebra_tecnica), 0) as quebra_tecnica
        from colheita
        inner join pessoa on pessoa.id = colheita.id_cliente_silo
        left join (
          select
            desconto_armazenamento_d.id_colheita,
            sum(case when desconto_armazenamento_d.tipo = 1 then desconto_armazenamento_d.desconto_kg end) as taxa_armazenamento,
            sum(case when desconto_armazenamento_d.tipo = 2 then desconto_armazenamento_d.desconto_kg end) as quebra_tecnica
          from desconto_armazenamento_d
          group by desconto_armazenamento_d.id_colheita
        ) desconto_armazenamento on desconto_armazenamento.id_colheita = colheita.id
        where colheita.id_cultura = ${idCultura}
        ${startDate ? `and colheita.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and colheita.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        ${idProdutor ? `and colheita.id_cliente_silo = ${idProdutor}` : ''}
        ${idArmazenamento ? `and colheita.id_estoque_agri_local = ${idArmazenamento}` : ''}
        ${idSafra ? `and colheita.id_ciclo_producao = ${idSafra}` : ''}
        group by id_produtor, produtor
        order by id_produtor
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map(item => EstoqueGraosMapper.toEntradaProdutorDomain(item)));
        }
      );
    });
  }

  findSaidasProdutor({ idCultura, startDate, endDate, idProdutor, idArmazenamento, idSafra }: EstoqueGraosArgs) {
    return new Promise<SaidasGraosProdutorDomain[]>((resolve, reject) => {
      database.query(
        `
        select
          pessoa.id as id_produtor,
          pessoa.razao_social as produtor,
          coalesce(sum(venda_agricultura_saida.subtotal), 0) as peso,
          coalesce(sum(venda_agricultura_saida.total_descontos), 0) as desconto_classificacao
        from venda_agricultura_saida
        inner join venda_agricultura_item on venda_agricultura_item.id = venda_agricultura_saida.id_venda_agricultura_item
        inner join venda_agricultura on venda_agricultura.id = venda_agricultura_item.id_venda_agricultura
        inner join pessoa on pessoa.id = venda_agricultura.id_cliente_silo
        where venda_agricultura_item.id_cultura = ${idCultura}
        ${startDate ? `and venda_agricultura_saida.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and venda_agricultura_saida.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        ${idProdutor ? `and venda_agricultura.id_cliente_silo = ${idProdutor}` : ''}
        ${idArmazenamento ? `and venda_agricultura_saida.id_estoque_agri_local = ${idArmazenamento}` : ''}
        ${idSafra ? `and venda_agricultura_item.id_ciclo_producao = ${idSafra}` : ''}
        group by id_produtor, produtor
        order by id_produtor
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map(item => EstoqueGraosMapper.toSaidaProdutorDomain(item)));
        }
      );
    });
  }

  findSaldoAnteriorProdutor({ idCultura, startDate, idProdutor, idArmazenamento, idSafra }: EstoqueGraosArgs) {
    return new Promise<SaldoProdutorDomain[]>((resolve, reject) => {
      database.query(
        `
        select id_produtor, produtor, sum(total) as saldo
        from (
          select
            pessoa.id as id_produtor,
            pessoa.razao_social as produtor,
            sum(colheita.peso_liquido) as total
          from colheita
          inner join pessoa on pessoa.id = colheita.id_cliente_silo
          where colheita.id_cultura = ${idCultura}
          ${startDate ? `and colheita.data < '${format(startDate, 'yyyy-MM-dd')}'` : ''}
          ${idProdutor ? `and colheita.id_cliente_silo = ${idProdutor}` : ''}
          ${idArmazenamento ? `and colheita.id_estoque_agri_local = ${idArmazenamento}` : ''}
          ${idSafra ? `and colheita.id_ciclo_producao = ${idSafra}` : ''}
          group by id_produtor, produtor

          union all

          select
            pessoa.id as id_produtor,
            pessoa.razao_social as produtor,
            sum(venda_agricultura_saida.qtde_kgs) * -1 as total
          from venda_agricultura_saida
          inner join venda_agricultura_item on venda_agricultura_item.id = venda_agricultura_saida.id_venda_agricultura_item
          inner join venda_agricultura on venda_agricultura.id = venda_agricultura_item.id_venda_agricultura
          inner join pessoa on pessoa.id = venda_agricultura.id_cliente_silo
          where venda_agricultura_item.id_cultura = ${idCultura}
          ${startDate ? `and venda_agricultura_saida.data < '${format(startDate, 'yyyy-MM-dd')}'` : ''}
          ${idProdutor ? `and venda_agricultura.id_cliente_silo = ${idProdutor}` : ''}
          ${idArmazenamento ? `and venda_agricultura_saida.id_estoque_agri_local = ${idArmazenamento}` : ''}
          ${idSafra ? `and venda_agricultura_item.id_ciclo_producao = ${idSafra}` : ''}
          group by id_produtor, produtor

          union all

          select
            pessoa.id as id_produtor,
            pessoa.razao_social as produtor,
            sum(desconto_armazenamento_d.desconto_kg) * -1 as total
          from desconto_armazenamento_d
          inner join colheita on colheita.id = desconto_armazenamento_d.id_colheita
          inner join pessoa on pessoa.id = colheita.id_cliente_silo
          where colheita.id_cultura = ${idCultura}
          ${startDate ? `and colheita.data < '${format(startDate, 'yyyy-MM-dd')}'` : ''}
          ${idProdutor ? `and colheita.id_cliente_silo = ${idProdutor}` : ''}
          ${idArmazenamento ? `and colheita.id_estoque_agri_local = ${idArmazenamento}` : ''}
          ${idSafra ? `and colheita.id_ciclo_producao = ${idSafra}` : ''}
          group by id_produtor, produtor
        ) group by id_produtor, produtor
        order by id_produtor
        `, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map(item => EstoqueGraosMapper.toSaldoProdutorDomain(item)));
        }
      );
    });
  }
}

export default new EstoqueGraosRepository();
