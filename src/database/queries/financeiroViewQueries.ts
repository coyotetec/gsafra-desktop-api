import { ViewColumnDomain } from '../../types/FinanceiroViewTypes';

export const viewTotalQuery = (viewColumn: ViewColumnDomain, startDate: string, endDate: string) => `
${viewColumn.filtrarSafra ? `
select sum(
  case when movimento_conta_m.tipo_lancamento = 'D'
  then(movimento_conta_ciclo.valor * -1)
  else(movimento_conta_ciclo.valor) end
) as total
from financeiro_view_d
left join financeiro_view_d_ciclo on financeiro_view_d_ciclo.id_financeiro_view_d = financeiro_view_d.id
` : `
select sum(
  case when movimento_conta_m.tipo_lancamento = 'D'
  then(movimento_conta_apropriacao.valor * -1)
  else(movimento_conta_apropriacao.valor) end
) as total
from financeiro_view_d
`}
${viewColumn.filtrarPlanoConta ? `
left join financeiro_view_d_pc on financeiro_view_d_pc.id_financeiro_view_d = financeiro_view_d.id
` : ''}
${viewColumn.filtrarCentroCusto ? `
left join financeiro_view_d_cc on financeiro_view_d_cc.id_financeiro_view_d = financeiro_view_d.id
` : ''}
${viewColumn.filtrarPatrimonio ? `
left join financeiro_view_d_patrimonio on financeiro_view_d_patrimonio.id_financeiro_view_d = financeiro_view_d.id
` : ''}
${viewColumn.filtrarEmpresa ? `
left join financeiro_view_d_empresa on financeiro_view_d_empresa.id_financeiro_view_d = financeiro_view_d.id
` : ''}
inner join movimento_conta_apropriacao
on movimento_conta_apropriacao.id > 0
${viewColumn.filtrarPlanoConta ? 'and movimento_conta_apropriacao.id_plano_conta = financeiro_view_d_pc.id_plano_conta' : ''}
${viewColumn.filtrarCentroCusto ? 'and movimento_conta_apropriacao.id_centro_custo = financeiro_view_d_cc.id_centro_custo' : ''}
${viewColumn.filtrarPatrimonio ? 'and movimento_conta_apropriacao.id_patrimonio = financeiro_view_d_patrimonio.id_patrimonio' : ''}
${viewColumn.filtrarEmpresa ? 'and movimento_conta_apropriacao.id_empresa = financeiro_view_d_empresa.id_empresa' : ''}
${viewColumn.filtrarSafra ? `
inner join movimento_conta_ciclo
on movimento_conta_ciclo.id_movimento_conta_apropriacao = movimento_conta_apropriacao.id
and movimento_conta_ciclo.id_ciclo_producao = financeiro_view_d_ciclo.id_ciclo_producao
` : ''}
left join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
left join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
where financeiro_view_d.id = ${viewColumn.id}
and movimento_conta_m.compensado = 'S'
and movimento_conta_m.data_compensacao >= '${startDate}'
and movimento_conta_m.data_compensacao <= '${endDate}'
`.replace(/^\s*$(?:\r\n?|\n)/gm, '');

export const viewDetailQuery = (viewColumn: ViewColumnDomain, startDate: string, endDate: string) => `
${viewColumn.filtrarSafra ? `
select
  movimento_conta_m.data_compensacao as data,
  sum(movimento_conta_ciclo.valor) as valor,
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
from financeiro_view_d
left join financeiro_view_d_ciclo on financeiro_view_d_ciclo.id_financeiro_view_d = financeiro_view_d.id
` : `
select
  movimento_conta_m.data_compensacao as data,
  sum(movimento_conta_apropriacao.valor) as valor,
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
from financeiro_view_d
`}
${viewColumn.filtrarPlanoConta ? `
left join financeiro_view_d_pc on financeiro_view_d_pc.id_financeiro_view_d = financeiro_view_d.id
` : ''}
${viewColumn.filtrarCentroCusto ? `
left join financeiro_view_d_cc on financeiro_view_d_cc.id_financeiro_view_d = financeiro_view_d.id
` : ''}
${viewColumn.filtrarPatrimonio ? `
left join financeiro_view_d_patrimonio on financeiro_view_d_patrimonio.id_financeiro_view_d = financeiro_view_d.id
` : ''}
${viewColumn.filtrarEmpresa ? `
left join financeiro_view_d_empresa on financeiro_view_d_empresa.id_financeiro_view_d = financeiro_view_d.id
` : ''}
inner join movimento_conta_apropriacao
on movimento_conta_apropriacao.id > 0
${viewColumn.filtrarPlanoConta ? 'and movimento_conta_apropriacao.id_plano_conta = financeiro_view_d_pc.id_plano_conta' : ''}
${viewColumn.filtrarCentroCusto ? 'and movimento_conta_apropriacao.id_centro_custo = financeiro_view_d_cc.id_centro_custo' : ''}
${viewColumn.filtrarPatrimonio ? 'and movimento_conta_apropriacao.id_patrimonio = financeiro_view_d_patrimonio.id_patrimonio' : ''}
${viewColumn.filtrarEmpresa ? 'and movimento_conta_apropriacao.id_empresa = financeiro_view_d_empresa.id_empresa' : ''}
${viewColumn.filtrarSafra ? `
inner join movimento_conta_ciclo
on movimento_conta_ciclo.id_movimento_conta_apropriacao = movimento_conta_apropriacao.id
and movimento_conta_ciclo.id_ciclo_producao = financeiro_view_d_ciclo.id_ciclo_producao
` : ''}
left join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
left join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
left join conta on conta.id = movimento_conta_m.id_conta
left join pessoa on pessoa.id = movimento_conta.id_pessoa
where financeiro_view_d.id = ${viewColumn.id}
and movimento_conta_m.compensado = 'S'
and movimento_conta_m.data_compensacao >= '${startDate}'
and movimento_conta_m.data_compensacao <= '${endDate}'
group by
  movimento_conta_m.data_compensacao,
  conta.descricao,
  pessoa.razao_social,
  movimento_conta.documento,
  movimento_conta.descricao,
  movimento_conta.tipo_documento
`.replace(/^\s*$(?:\r\n?|\n)/gm, '');
