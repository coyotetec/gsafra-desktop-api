import { ViewColumnDomain } from '../../types/FinanceiroViewTypes';

interface ViewTotalQueryArgs {
  viewColumn: ViewColumnDomain;
  startDate?: string;
  endDate?: string;
}

function createApropriacaoArray(viewColumn: ViewColumnDomain) {
  const apropriacaoArray = [];

  if (viewColumn.apropriacaoCusto1) {
    apropriacaoArray.push(1);
  }

  if (viewColumn.apropriacaoCusto2) {
    apropriacaoArray.push(2);
  }

  if (viewColumn.apropriacaoCusto3) {
    apropriacaoArray.push(3);
  }

  if (viewColumn.apropriacaoCusto4) {
    apropriacaoArray.push(4);
  }

  if (viewColumn.apropriacaoCusto44) {
    apropriacaoArray.push(44);
  }

  return apropriacaoArray.join(', ');
}

export const viewTotalQuery = ({
  viewColumn,
  startDate,
  endDate,
}: ViewTotalQueryArgs) =>
  `
${
  viewColumn.filtrarSafra
    ? `
select sum(
  case when movimento_conta_m.tipo_lancamento = 'D'
  then(movimento_conta_ciclo.valor * -1)
  else(movimento_conta_ciclo.valor) end
) as total
from movimento_conta_apropriacao
inner join movimento_conta_ciclo on movimento_conta_ciclo.id_movimento_conta_apropriacao = movimento_conta_apropriacao.id
`
    : `
select sum(
  case when movimento_conta_m.tipo_lancamento = 'D'
  then(movimento_conta_apropriacao.valor * -1)
  else(movimento_conta_apropriacao.valor) end
) as total
from movimento_conta_apropriacao
`
}
inner join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
inner join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
where movimento_conta_m.compensado = 'S'
${startDate ? `and movimento_conta_m.data_compensacao >= '${startDate}'` : ''}
${endDate ? `and movimento_conta_m.data_compensacao <= '${endDate}'` : ''}
and movimento_conta_apropriacao.apropriacao_custo in (${createApropriacaoArray(viewColumn)})
${
  viewColumn.filtrarPlanoConta
    ? `
and movimento_conta_apropriacao.id_plano_conta in
  (select id_plano_conta from financeiro_view_d_pc where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarCentroCusto
    ? `
and movimento_conta_apropriacao.id_centro_custo in
  (select id_centro_custo from financeiro_view_d_cc where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarPatrimonio
    ? `
and movimento_conta_apropriacao.id_patrimonio in
  (select id_patrimonio from financeiro_view_d_patrimonio where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarEmpresa
    ? `
and movimento_conta_apropriacao.id_empresa in
  (select id_empresa from financeiro_view_d_empresa where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarPessoa
    ? `
and movimento_conta.id_pessoa in
  (select id_pessoa from financeiro_view_d_pessoa where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarSafra
    ? `
and movimento_conta_ciclo.id_ciclo_producao in
  (select id_ciclo_producao from financeiro_view_d_ciclo where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
`.replace(/^\s*$(?:\r\n?|\n)/gm, '');

export const viewDetailQuery = ({
  viewColumn,
  startDate,
  endDate,
}: ViewTotalQueryArgs) =>
  `
${
  viewColumn.filtrarSafra
    ? `
select
  movimento_conta_m.data_compensacao as data,
  sum(movimento_conta_ciclo.valor) as valor,
  movimento_conta_m.tipo_lancamento,
  conta.descricao as conta_bancaria,
  pessoa.razao_social as pessoa,
  movimento_conta.documento,
  movimento_conta.descricao,
  case movimento_conta.tipo_documento
    when 1 then 'Nota Fiscal'
    when 2 then 'Fatura'
    when 3 then 'Recibo'
    when 4 then 'Contrato'
    when 5 then 'Folha de Pagamento'
    when 6 then 'Outro'
  end as tipo_documento
from movimento_conta_apropriacao
inner join movimento_conta_ciclo on movimento_conta_ciclo.id_movimento_conta_apropriacao = movimento_conta_apropriacao.id
`
    : `
select
  movimento_conta_m.data_compensacao as data,
  sum(movimento_conta_apropriacao.valor) as valor,
  movimento_conta_m.tipo_lancamento,
  conta.descricao as conta_bancaria,
  pessoa.razao_social as pessoa,
  movimento_conta.documento,
  movimento_conta.descricao,
  case movimento_conta.tipo_documento
    when 1 then 'Nota Fiscal'
    when 2 then 'Fatura'
    when 3 then 'Recibo'
    when 4 then 'Contrato'
    when 5 then 'Folha de Pagamento'
    when 6 then 'Outro'
  end as tipo_documento
from movimento_conta_apropriacao
`
}
inner join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
inner join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
inner join conta on conta.id = movimento_conta_m.id_conta
left join pessoa on pessoa.id = movimento_conta.id_pessoa
where movimento_conta_m.compensado = 'S'
${startDate ? `and movimento_conta_m.data_compensacao >= '${startDate}'` : ''}
${endDate ? `and movimento_conta_m.data_compensacao <= '${endDate}'` : ''}
and movimento_conta_apropriacao.apropriacao_custo in (${createApropriacaoArray(viewColumn)})
${
  viewColumn.filtrarPlanoConta
    ? `
and movimento_conta_apropriacao.id_plano_conta in
  (select id_plano_conta from financeiro_view_d_pc where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarCentroCusto
    ? `
and movimento_conta_apropriacao.id_centro_custo in
  (select id_centro_custo from financeiro_view_d_cc where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarPatrimonio
    ? `
and movimento_conta_apropriacao.id_patrimonio in
  (select id_patrimonio from financeiro_view_d_patrimonio where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarEmpresa
    ? `
and movimento_conta_apropriacao.id_empresa in
  (select id_empresa from financeiro_view_d_empresa where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarPessoa
    ? `
and movimento_conta.id_pessoa in
  (select id_pessoa from financeiro_view_d_pessoa where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
${
  viewColumn.filtrarSafra
    ? `
and movimento_conta_ciclo.id_ciclo_producao in
  (select id_ciclo_producao from financeiro_view_d_ciclo where id_financeiro_view_d = ${viewColumn.id})
`
    : ''
}
group by
  movimento_conta_m.data_compensacao,
  movimento_conta_m.tipo_lancamento,
  conta.descricao,
  pessoa.razao_social,
  movimento_conta.documento,
  movimento_conta.descricao,
  movimento_conta.tipo_documento
`.replace(/^\s*$(?:\r\n?|\n)/gm, '');
