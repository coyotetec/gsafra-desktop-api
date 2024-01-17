import { format } from 'date-fns';
import database from '../../database';
import ContratoMapper from './mappers/ContratoMapper';

interface FindRomaneiosArgs {
  idContrato: number;
  startDate?: Date;
  endDate?: Date;
}

class ContratoRepository {
  findAll(databaseName: string, idSafra: number) {
    return new Promise((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
          contrato.id as id,
          pessoa.razao_social as cliente,
          contrato.numero as numero_contrato,
          contrato.qtde_kgs as total_contrato,
          case when (select count(id) from venda_agricultura where venda_agricultura.id_contrato = contrato.id) > 0
          then (
            select sum(venda_agricultura_saida.qtde_kgs)
            from venda_agricultura_saida
            inner join venda_agricultura_item on venda_agricultura_item.id = venda_agricultura_saida.id_venda_agricultura_item
            inner join venda_agricultura on venda_agricultura.id = venda_agricultura_item.id_venda_agricultura
            where venda_agricultura_saida.situacao = 2
            and venda_agricultura.id_contrato = contrato.id
          ) else 0 end as total_entregue
        from contrato
        inner join pessoa on pessoa.id = contrato.id_pessoa
        where contrato.id_ciclo_producao = ${idSafra}
        order by total_contrato desc
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => ContratoMapper.toDomain(item)));
        },
      );
    });
  }

  findRomaneios(
    databaseName: string,
    { idContrato, startDate, endDate }: FindRomaneiosArgs,
  ) {
    return new Promise((resolve, reject) => {
      database.query(
        databaseName,
        `
        select
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
        where venda_agricultura_saida.situacao = 2
        and venda_agricultura.id_contrato = ${idContrato}
        ${startDate ? `and venda_agricultura_saida.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
        ${endDate ? `and venda_agricultura_saida.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
        order by data
        `,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => ContratoMapper.toRomaneioDomain(item)));
        },
      );
    });
  }
}

export default new ContratoRepository();
