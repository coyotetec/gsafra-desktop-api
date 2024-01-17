import { format } from 'date-fns';
import database from '../../database';
import {
  PrecoMedioClienteDomain,
  PrecoMedioMesDomain,
  RomaneioDomain,
  VendaDomain,
} from '../../types/VendaTypes';
import VendaMapper from './mappers/VendaMapper';

interface FindVendasArgs {
  idSafra: number;
  startDate?: Date;
  endDate?: Date;
  situacao?: number;
}

class VendaRepository {
  findAll(
    databaseName: string,
    { idSafra, startDate, endDate, situacao }: FindVendasArgs,
  ) {
    return new Promise<VendaDomain[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
          pessoa.id as id_cliente,
          pessoa.razao_social as cliente,
          sum(venda_agricultura_item.qtde_kgs) as total,
          sum(s.total_entregue) as total_entregue
        from venda_agricultura
        inner join venda_agricultura_item on venda_agricultura_item.id_venda_agricultura = venda_agricultura.id
        inner join pessoa on pessoa.id = venda_agricultura.id_pessoa
        left join (
          select
            id_venda_agricultura_item,
            sum(venda_agricultura_saida.qtde_kgs) as total_entregue
          from venda_agricultura_saida
          where venda_agricultura_saida.situacao = 2
          group by id_venda_agricultura_item
        ) s on s.id_venda_agricultura_item = venda_agricultura_item.id
        where venda_agricultura_item.id_ciclo_producao = ${idSafra}
        ${startDate ? `and venda_agricultura.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and venda_agricultura.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        ${situacao ? `and venda_agricultura.situacao = ${situacao}` : ''}
        group by id_cliente, cliente
        order by total desc
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => VendaMapper.toDomain(item)));
        },
      );
    });
  }

  findRomaneios(
    databaseName: string,
    { idSafra, startDate, endDate, situacao }: FindVendasArgs,
  ) {
    return new Promise<RomaneioDomain[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
          pessoa.razao_social as cliente,
          venda_agricultura_saida.data as data,
          venda_agricultura_saida.numero_ordem,
          venda_agricultura_saida.qtde_kgs as quantidade,
          estoque_agri_local.nome as local_saida,
          venda_agricultura_saida.motorista,
          venda_agricultura_saida.placa
        from venda_agricultura_saida
        inner join venda_agricultura_item on venda_agricultura_item.id = venda_agricultura_saida.id_venda_agricultura_item
        inner join venda_agricultura on venda_agricultura.id = venda_agricultura_item.id_venda_agricultura
        inner join estoque_agri_local on estoque_agri_local.id = venda_agricultura_saida.id_estoque_agri_local
        inner join pessoa on pessoa.id = venda_agricultura.id_pessoa
        where venda_agricultura_saida.situacao = 2
        and venda_agricultura_item.id_ciclo_producao = ${idSafra}
        ${startDate ? `and venda_agricultura.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and venda_agricultura.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        ${situacao ? `and venda_agricultura.situacao = ${situacao}` : ''}
        order by cliente, data
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => VendaMapper.toRomaneioDomain(item)));
        },
      );
    });
  }

  findPrecoMedioCliente(
    databaseName: string,
    { idSafra, startDate, endDate, situacao }: FindVendasArgs,
  ) {
    return new Promise<PrecoMedioClienteDomain[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
          pessoa.razao_social as cliente,
          sum(venda_agricultura_item.total) / sum(venda_agricultura_item.qtde_kgs) as preco_medio_kg
        from venda_agricultura
        inner join venda_agricultura_item on venda_agricultura_item.id_venda_agricultura = venda_agricultura.id
        inner join pessoa on pessoa.id = venda_agricultura.id_pessoa
        where venda_agricultura_item.id_ciclo_producao = ${idSafra}
        ${startDate ? `and venda_agricultura.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and venda_agricultura.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        ${situacao ? `and venda_agricultura.situacao = ${situacao}` : ''}
        group by cliente
        order by preco_medio_kg desc
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(
            result.map((item) => VendaMapper.toPrecoMedioClienteDomain(item)),
          );
        },
      );
    });
  }

  findPrecoMedioMes(
    databaseName: string,
    { idSafra, startDate, endDate, situacao }: FindVendasArgs,
  ) {
    return new Promise<PrecoMedioMesDomain[]>((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
          extract(month from venda_agricultura.data) as mes,
          extract(year from venda_agricultura.data) as ano,
          sum(venda_agricultura_item.total) as valor_total,
          sum(venda_agricultura_item.qtde_kgs) as quantidade_total
        from venda_agricultura_item
        inner join venda_agricultura on venda_agricultura.id = venda_agricultura_item.id_venda_agricultura
        where venda_agricultura_item.id_ciclo_producao = ${idSafra}
        ${startDate ? `and venda_agricultura.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and venda_agricultura.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        ${situacao ? `and venda_agricultura.situacao = ${situacao}` : ''}
        group by mes, ano
        order by ano, mes
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(
            result.map((item) => VendaMapper.toPrecoMedioMesDomain(item)),
          );
        },
      );
    });
  }
}

export default new VendaRepository();
