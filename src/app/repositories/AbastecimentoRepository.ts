import { format } from 'date-fns';
import database from '../../database';
import { DetailsDomain, TotalBySafraDomain, TotalDomain, TotalFuelDomain, TotalPatrimonyDomain } from '../../types/AbastecimentoTypes';
import AbastecimentoMapper from './mappers/AbastecimentoMapper';

interface FindTotalValueArgs {
  startDate?: Date,
  endDate?: Date,
  idPatrimonio?: number,
  idProdutoAlmoxarifado?: number
  idAlmoxarifado?: number,
  idTipoPatrimonio?: number,
  custo: 'atual' | 'medio',
}

interface FindTotalQtyArgs {
  startDate?: Date,
  endDate?: Date,
  idPatrimonio?: number,
  idProdutoAlmoxarifado?: number
  idAlmoxarifado?: number,
  idTipoPatrimonio?: number,
}

interface FindTotalBySafraArgs {
  idSafra: string;
  idTalhao?: number;
  startDate?: Date;
  endDate?: Date;
}

class AbastecimentoRepository {
  findTotalMonthlyValue({
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
    custo,
  }: FindTotalValueArgs): Promise<TotalDomain[]> {
    return new Promise((resolve, reject) => {
      const query = `
      select
        ${custo === 'atual' ? 'sum(abastecimento.total_atual)' : 'sum(abastecimento.total_medio)'} as total,
        extract(month from abastecimento.data) as mes,
        extract(year from abastecimento.data) as ano
      from abastecimento
      left join patrimonio on patrimonio.id = abastecimento.id_patrimonio
      where abastecimento.estoque_movimentado = 1
      ${idPatrimonio ? `and abastecimento.id_patrimonio = ${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `and abastecimento.id_produto_almoxarifado = ${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `and abastecimento.id_almoxarifado = ${idAlmoxarifado}` : ''}
      ${idTipoPatrimonio ? `and patrimonio.id_tipo_patrimonio = ${idTipoPatrimonio}` : ''}
      ${startDate ? `AND abastecimento.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND abastecimento.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      group by mes, ano
      order by ano, mes
      `;

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AbastecimentoMapper.toTotalDomain(item)));
        }
      );
    });
  }

  findTotalMonthlyQty({
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
  }: FindTotalQtyArgs): Promise<TotalDomain[]> {
    return new Promise((resolve, reject) => {
      const query = `
      select
        sum(abastecimento.quantidade) as total,
        extract(month from abastecimento.data) as mes,
        extract(year from abastecimento.data) as ano
      from abastecimento
      left join patrimonio on patrimonio.id = abastecimento.id_patrimonio
      where abastecimento.estoque_movimentado = 1
      ${idPatrimonio ? `and abastecimento.id_patrimonio = ${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `and abastecimento.id_produto_almoxarifado = ${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `and abastecimento.id_almoxarifado = ${idAlmoxarifado}` : ''}
      ${idTipoPatrimonio ? `and patrimonio.id_tipo_patrimonio = ${idTipoPatrimonio}` : ''}
      ${startDate ? `AND abastecimento.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND abastecimento.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      group by mes, ano
      order by ano, mes
      `;

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AbastecimentoMapper.toTotalDomain(item)));
        }
      );
    });
  }

  findDetails({
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
    custo,
  }: FindTotalValueArgs): Promise<DetailsDomain[]> {
    return new Promise((resolve, reject) => {
      const query = `
      select
        extract(month from abastecimento.data) as mes,
        extract(year from abastecimento.data) as ano,
        abastecimento.data,
        abastecimento.numero_requisicao,
        patrimonio.descricao as patrimonio,
        tipo_patrimonio.nome as tipo_patrimonio,
        produto_almoxarifado.nome as combustivel,
        almoxarifado.nome as local_saida,
        abastecimento.quantidade,
        ${custo === 'atual' ? 'abastecimento.custo_atual' : 'abastecimento.custo_medio'} as custo_individual,
        ${custo === 'atual' ? 'abastecimento.total_atual' : 'abastecimento.total_medio'} as total
      from abastecimento
      left join patrimonio on patrimonio.id = abastecimento.id_patrimonio
      left join tipo_patrimonio on tipo_patrimonio.id = patrimonio.id_tipo_patrimonio
      left join produto_almoxarifado on produto_almoxarifado.id = abastecimento.id_produto_almoxarifado
      left join almoxarifado on almoxarifado.id = abastecimento.id_almoxarifado
      where abastecimento.estoque_movimentado = 1
      ${idPatrimonio ? `and abastecimento.id_patrimonio = ${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `and abastecimento.id_produto_almoxarifado = ${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `and abastecimento.id_almoxarifado = ${idAlmoxarifado}` : ''}
      ${idTipoPatrimonio ? `and patrimonio.id_tipo_patrimonio = ${idTipoPatrimonio}` : ''}
      ${startDate ? `AND abastecimento.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND abastecimento.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      order by ano, mes
      `;

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AbastecimentoMapper.toDetailsDomain(item)));
        }
      );
    });
  }

  findTotalFuelValue({
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
    custo,
  }: FindTotalValueArgs): Promise<TotalFuelDomain[]> {
    return new Promise((resolve, reject) => {
      const query = `
      select
        ${custo === 'atual' ? 'sum(abastecimento.total_atual)' : 'sum(abastecimento.total_medio)'} as total,
        produto_almoxarifado.nome as combustivel
      from abastecimento
      left join produto_almoxarifado on produto_almoxarifado.id = abastecimento.id_produto_almoxarifado
      left join patrimonio on patrimonio.id = abastecimento.id_patrimonio
      where abastecimento.estoque_movimentado = 1
      ${idPatrimonio ? `and abastecimento.id_patrimonio = ${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `and abastecimento.id_produto_almoxarifado = ${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `and abastecimento.id_almoxarifado = ${idAlmoxarifado}` : ''}
      ${idTipoPatrimonio ? `and patrimonio.id_tipo_patrimonio = ${idTipoPatrimonio}` : ''}
      ${startDate ? `AND abastecimento.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND abastecimento.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      group by combustivel
      `;

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AbastecimentoMapper.toTotalFuelDomain(item)));
        }
      );
    });
  }

  findTotalFuelQty({
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
  }: FindTotalQtyArgs): Promise<TotalFuelDomain[]> {
    return new Promise((resolve, reject) => {
      const query = `
      select
        sum(abastecimento.quantidade) as total,
        produto_almoxarifado.nome as combustivel
      from abastecimento
      left join produto_almoxarifado on produto_almoxarifado.id = abastecimento.id_produto_almoxarifado
      left join patrimonio on patrimonio.id = abastecimento.id_patrimonio
      where abastecimento.estoque_movimentado = 1
      ${idPatrimonio ? `and abastecimento.id_patrimonio = ${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `and abastecimento.id_produto_almoxarifado = ${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `and abastecimento.id_almoxarifado = ${idAlmoxarifado}` : ''}
      ${idTipoPatrimonio ? `and patrimonio.id_tipo_patrimonio = ${idTipoPatrimonio}` : ''}
      ${startDate ? `AND abastecimento.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND abastecimento.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      group by combustivel
      `;

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AbastecimentoMapper.toTotalFuelDomain(item)));
        }
      );
    });
  }

  findTotalPatrimonyValue({
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    custo,
  }: FindTotalValueArgs): Promise<TotalPatrimonyDomain[]> {
    return new Promise((resolve, reject) => {
      const query = `
      select
        ${custo === 'atual' ? 'sum(abastecimento.total_atual)' : 'sum(abastecimento.total_medio)'} as total,
        tipo_patrimonio.nome as tipo_patrimonio
      from abastecimento
      left join patrimonio on patrimonio.id = abastecimento.id_patrimonio
      left join tipo_patrimonio on tipo_patrimonio.id = patrimonio.id_tipo_patrimonio
      where abastecimento.estoque_movimentado = 1
      ${idPatrimonio ? `and abastecimento.id_patrimonio = ${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `and abastecimento.id_produto_almoxarifado = ${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `and abastecimento.id_almoxarifado = ${idAlmoxarifado}` : ''}
      ${startDate ? `AND abastecimento.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND abastecimento.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      group by tipo_patrimonio
      `;

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AbastecimentoMapper.toTotalPatrimonyDomain(item)));
        }
      );
    });
  }

  findTotalPatrimonyQty({
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
  }: FindTotalQtyArgs): Promise<TotalPatrimonyDomain[]> {
    return new Promise((resolve, reject) => {
      const query = `
      select
        sum(abastecimento.quantidade) as total,
        tipo_patrimonio.nome as tipo_patrimonio
      from abastecimento
      left join patrimonio on patrimonio.id = abastecimento.id_patrimonio
      left join tipo_patrimonio on tipo_patrimonio.id = patrimonio.id_tipo_patrimonio
      where abastecimento.estoque_movimentado = 1
      ${idPatrimonio ? `and abastecimento.id_patrimonio = ${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `and abastecimento.id_produto_almoxarifado = ${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `and abastecimento.id_almoxarifado = ${idAlmoxarifado}` : ''}
      ${startDate ? `AND abastecimento.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `AND abastecimento.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      group by tipo_patrimonio
      `;

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AbastecimentoMapper.toTotalPatrimonyDomain(item)));
        }
      );
    });
  }

  findTotalFuelBySafra({ idSafra, idTalhao, startDate, endDate }: FindTotalBySafraArgs) {
    return new Promise<TotalBySafraDomain[]>((resolve, reject) => {
      const query = `
      select
        produto_almoxarifado.nome as insumo,
        cast(sum(abastecimento_ciclo_ts.valor) as numeric(15,2)) as total,
        cast(sum(
          (cast(abastecimento_ciclo_ts.proporcao as numeric(15,8)) / 100) *
          (abastecimento.quantidade)
        ) as numeric(15,2)) as quantidade,
        'Lt' as unidade
      from abastecimento_ciclo_ts
      left join abastecimento_ciclo on abastecimento_ciclo.id = abastecimento_ciclo_ts.id_abastecimento_ciclo
      left join abastecimento on abastecimento.id = abastecimento_ciclo.id_abastecimento
      left join produto_almoxarifado on produto_almoxarifado.id = abastecimento.id_produto_almoxarifado
      where abastecimento.status_processamento = 2
      and abastecimento_ciclo.id_ciclo_producao in (${idSafra})
      ${idTalhao ? `and abastecimento_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
      ${startDate ? `and abastecimento.data >= '${format(startDate, 'yyyy-MM-dd')}'` : ''}
      ${endDate ? `and abastecimento.data <= '${format(endDate, 'yyyy-MM-dd')}'` : ''}
      group by insumo, unidade
      order by total desc
      `;

      database.query(
        query, [],
        (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.map((item) => AbastecimentoMapper.toTotalBySafraDomain(item)));
        }
      );
    });
  }
}

export default new AbastecimentoRepository();
