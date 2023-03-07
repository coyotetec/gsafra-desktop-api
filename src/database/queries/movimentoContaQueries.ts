export const accountMovementsQuery = (codigo: string, startDate?: string, endDate?: string) => `
select
  movimento_conta_m.data_compensacao as data,
  movimento_conta.valor as valor_total,
  movimento_conta_apropriacao.valor as valor_apropriado,
  conta.descricao as conta_bancaria,
  pessoa.razao_social as pessoa,
  movimento_conta.documento,
  movimento_conta.descricao,
  (plano_conta.codigo || ' - ' || plano_conta.descricao) as plano_conta,
  case movimento_conta.tipo_documento
    when 1 then 'Nota Fiscal'
    when 2 then 'Fatura'
    when 3 then 'Recibo'
    when 4 then 'Contrato'
    when 5 then 'Folha de Pagamento'
    when 6 then 'Outro'
  end as tipo_documento
from movimento_conta_apropriacao
inner join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
inner join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
inner join conta on conta.id = movimento_conta_m.id_conta
inner join plano_conta on plano_conta.id = movimento_conta_apropriacao.id_plano_conta
left join pessoa on pessoa.id = movimento_conta.id_pessoa
where plano_conta.codigo like '${codigo}.%'
and plano_conta.categoria = 2
and (movimento_conta.entre_empresas is null or movimento_conta.entre_empresas <> 1)
${startDate ? `and movimento_conta_m.data_compensacao >= '${startDate}'` : ''}
${endDate ? `and movimento_conta_m.data_compensacao <= '${endDate}'` : ''}
`;

export const accountMovementsBySafraQuery = (codigo: string, idSafra: number, startDate?: string, endDate?: string) => `
select
  movimento_conta_m.data_compensacao as data,
  movimento_conta.valor as valor_total,
  movimento_conta_ciclo.valor as valor_apropriado,
  conta.descricao as conta_bancaria,
  pessoa.razao_social as pessoa,
  movimento_conta.documento,
  movimento_conta.descricao,
  (plano_conta.codigo || ' - ' || plano_conta.descricao) as plano_conta,
  case movimento_conta.tipo_documento
    when 1 then 'Nota Fiscal'
    when 2 then 'Fatura'
    when 3 then 'Recibo'
    when 4 then 'Contrato'
    when 5 then 'Folha de Pagamento'
    when 6 then 'Outro'
  end as tipo_documento
from movimento_conta_ciclo
inner join movimento_conta_apropriacao on  movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
inner join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
inner join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
inner join conta on conta.id = movimento_conta_m.id_conta
inner join plano_conta on plano_conta.id = movimento_conta_apropriacao.id_plano_conta
left join pessoa on pessoa.id = movimento_conta.id_pessoa
where plano_conta.codigo like '${codigo}.%'
and plano_conta.categoria = 2
and (movimento_conta.entre_empresas is null or movimento_conta.entre_empresas <> 1)
and movimento_conta_ciclo.id_ciclo_producao = ${idSafra}
${startDate ? `and movimento_conta_m.data_compensacao >= '${startDate}'` : ''}
${endDate ? `and movimento_conta_m.data_compensacao <= '${endDate}'` : ''}
`;
