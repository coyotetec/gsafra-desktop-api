export const cashFlowBalanceQuery = (startDate: string, endDate: string) => `
select sum(total) as total, mes, ano
from(
    select sum(
        case when tipo_lancamento = 'D'
        then(valor_principal * -1)
        else(valor_principal) end
    ) as total, extract(month from data_compensacao) as mes, extract(year from data_compensacao) as ano
    from movimento_conta_m
    where compensado = 'S'
    and data_compensacao >= '${startDate}'
    and data_compensacao <= '${endDate}'
    group by mes, ano

    union all

    select sum(
        (
            conta_receber_pagar.valor_parcela -
            conta_receber_pagar.total_pago +
            conta_receber_pagar.total_multa +
            conta_receber_pagar.total_juros -
            conta_receber_pagar.total_desconto
        ) * (case when crp_m.tipo = 2 then(-1) else(1) end)
    ) as total, extract(month from conta_receber_pagar.data_vencimento) as mes, extract(year from conta_receber_pagar.data_vencimento) as ano
    from conta_receber_pagar
    left join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
    where conta_receber_pagar.situacao = 'A'
    and conta_receber_pagar.data_vencimento >= '${startDate}'
    and conta_receber_pagar.data_vencimento <= '${endDate}'
    group by mes, ano

    union all

    select sum(
        case when tipo = 'E'
        then(valor * -1)
        else(valor) end
    ) as total, extract(month from data_vencimento) as mes, extract(year from data_vencimento) as ano
    from cheque
    where situacao = 'A'
    and data_vencimento >= '${startDate}'
    and data_vencimento <= '${endDate}'
    group by mes, ano

    union all

    select sum(valor * -1) as total, extract(month from vencimento) as mes, extract(year from vencimento) as ano
    from cartao_pagar_d
    where situacao = 0
    and vencimento >= '${startDate}'
    and vencimento <= '${endDate}'
    group by mes, ano
)
group by mes, ano
order by ano, mes
`;

export const cashFlowBalanceQueryBySafra = (startDate: string, endDate: string, idSafra: number) => `
select sum(total) as total, mes, ano
from(
  select sum(
    case when movimento_conta_m.tipo_lancamento = 'D'
    then(movimento_conta_m.valor_principal * -1)
    else(movimento_conta_m.valor_principal) end
  ) as total, extract(month from movimento_conta_m.data_compensacao) as mes, extract(year from movimento_conta_m.data_compensacao) as ano
  from movimento_conta_ciclo
  left join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
  left join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
  left join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
  where movimento_conta_m.compensado = 'S'
  and movimento_conta_m.data_compensacao >= '${startDate}'
  and movimento_conta_m.data_compensacao <= '${endDate}'
  and movimento_conta_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano

  union all

  select sum(
    (
      conta_receber_pagar.valor_parcela -
      conta_receber_pagar.total_pago +
      conta_receber_pagar.total_multa +
      conta_receber_pagar.total_juros -
      conta_receber_pagar.total_desconto
    ) * (case when crp_m.tipo = 2 then(-1) else(1) end)
  ) as total, extract(month from conta_receber_pagar.data_vencimento) as mes, extract(year from conta_receber_pagar.data_vencimento) as ano
  from conta_receber_pagar_ciclo
  left join crp_apropriacao on crp_apropriacao.id = conta_receber_pagar_ciclo.id_crp_apropriacao
  left join conta_receber_pagar on conta_receber_pagar.id = crp_apropriacao.id_conta_receber_pagar
  left join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
  where conta_receber_pagar.situacao = 'A'
  and conta_receber_pagar.data_vencimento >= '${startDate}'
  and conta_receber_pagar.data_vencimento <= '${endDate}'
  and conta_receber_pagar_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano

  union all

  select sum(
    case when cheque.tipo = 'E'
    then(cheque.valor * -1)
    else(cheque.valor) end
  ) as total, extract(month from cheque.data_vencimento) as mes, extract(year from cheque.data_vencimento) as ano
  from cheque_ciclo
  left join cheque_apropriacao on cheque_apropriacao.id = cheque_ciclo.id_cheque_apropriacao
  left join cheque on cheque.id = cheque_apropriacao.id_cheque
  where cheque.situacao = 'A'
  and cheque.data_vencimento >= '${startDate}'
  and cheque.data_vencimento <= '${endDate}'
  and cheque_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano

  union all

  select sum(cartao_pagar_d.valor * -1) as total, extract(month from cartao_pagar_d.vencimento) as mes, extract(year from cartao_pagar_d.vencimento) as ano
  from cartao_pagar_d_ciclo
  left join cartao_pagar_d_apropriacao on  cartao_pagar_d_apropriacao.id = cartao_pagar_d_ciclo.id_cartao_pagar_d_apropriacao
  left join cartao_pagar_d on cartao_pagar_d.id = cartao_pagar_d_apropriacao.id_cartao_pagar_d
  where situacao = 0
  and cartao_pagar_d.vencimento >= '${startDate}'
  and cartao_pagar_d.vencimento <= '${endDate}'
  and cartao_pagar_d_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano
)
group by mes, ano
order by ano, mes
`;

export const cashFlowBalancePlanQuery = (startDate: string, endDate: string) => `
select sum(
  case when plano_conta.tipo = 'D'
  then (plan_financeiro_valores.valor * -1)
  else (plan_financeiro_valores.valor) end
) as total, mes, ano
from plan_financeiro_valores
left join plan_financeiro_d on plan_financeiro_d.id = plan_financeiro_valores.id_plan_financeiro_d
left join plano_conta on plano_conta.id = plan_financeiro_d.id_plano_conta
where CAST((ano||'-'||mes||'-1') as date) >= '${startDate}'
and CAST((ano||'-'||mes||'-1') as date) <= '${endDate}'
group by mes, ano
order by ano, mes
`;

export const cashFlowBalancePlanBySafraQuery = (startDate: string, endDate: string, idSafra: number) => `
select sum(
  case when plano_conta.tipo = 'D'
  then (plan_financeiro_valores.valor * -1)
  else (plan_financeiro_valores.valor) end
) as total, mes, ano
from plan_financeiro_valores
left join plan_financeiro_d on plan_financeiro_d.id = plan_financeiro_valores.id_plan_financeiro_d
left join plan_financeiro on plan_financeiro.id = plan_financeiro_d.id_plan_financeiro
left join plano_conta on plano_conta.id = plan_financeiro_d.id_plano_conta
where CAST((ano||'-'||mes||'-1') as date) >= '${startDate}'
and CAST((ano||'-'||mes||'-1') as date) <= '${endDate}'
and plan_financeiro.id_ciclo_producao = ${idSafra}
group by mes, ano
order by ano, mes
`;

export const cashFlowCreditsQuery = (startDate: string, endDate: string) => `
select sum(total) as total, mes, ano
from(
    select sum(valor_principal) as total, extract(month from data_compensacao) as mes, extract(year from data_compensacao) as ano
    from movimento_conta_m
    where compensado = 'S'
    and tipo_lancamento = 'C'
    and data_compensacao >= '${startDate}'
    and data_compensacao <= '${endDate}'
    group by mes, ano

    union all

    select sum((
        conta_receber_pagar.valor_parcela -
        conta_receber_pagar.total_pago +
        conta_receber_pagar.total_multa +
        conta_receber_pagar.total_juros -
        conta_receber_pagar.total_desconto
    )) as total, extract(month from conta_receber_pagar.data_vencimento) as mes, extract(year from conta_receber_pagar.data_vencimento) as ano
    from conta_receber_pagar
    left join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
    where conta_receber_pagar.situacao = 'A'
    and crp_m.tipo = 1
    and conta_receber_pagar.data_vencimento >= '${startDate}'
    and conta_receber_pagar.data_vencimento <= '${endDate}'
    group by mes, ano

    union all

    select sum(valor) as total, extract(month from data_vencimento) as mes, extract(year from data_vencimento) as ano
    from cheque
    where situacao = 'A'
    and tipo = 'R'
    and data_vencimento >= '${startDate}'
    and data_vencimento <= '${endDate}'
    group by mes, ano
)
group by mes, ano
order by ano, mes
`;

export const cashFlowCreditsQueryBySafra = (startDate: string, endDate: string, idSafra: number) => `
select sum(total) as total, mes, ano
from(
  select sum(movimento_conta_m.valor_principal) as total, extract(month from movimento_conta_m.data_compensacao) as mes, extract(year from movimento_conta_m.data_compensacao) as ano
  from movimento_conta_ciclo
  left join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
  left join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
  left join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
  where movimento_conta_m.compensado = 'S'
  and movimento_conta_m.tipo_lancamento = 'C'
  and movimento_conta_m.data_compensacao >= '${startDate}'
  and movimento_conta_m.data_compensacao <= '${endDate}'
  and movimento_conta_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano

  union all

  select sum((
    conta_receber_pagar.valor_parcela -
    conta_receber_pagar.total_pago +
    conta_receber_pagar.total_multa +
    conta_receber_pagar.total_juros -
    conta_receber_pagar.total_desconto
  )) as total, extract(month from conta_receber_pagar.data_vencimento) as mes, extract(year from conta_receber_pagar.data_vencimento) as ano
  from conta_receber_pagar_ciclo
  left join crp_apropriacao on crp_apropriacao.id = conta_receber_pagar_ciclo.id_crp_apropriacao
  left join conta_receber_pagar on conta_receber_pagar.id = crp_apropriacao.id_conta_receber_pagar
  left join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
  where conta_receber_pagar.situacao = 'A'
  and crp_m.tipo = 1
  and conta_receber_pagar.data_vencimento >= '${startDate}'
  and conta_receber_pagar.data_vencimento <= '${endDate}'
  and conta_receber_pagar_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano

  union all

  select sum(cheque.valor) as total, extract(month from cheque.data_vencimento) as mes, extract(year from cheque.data_vencimento) as ano
  from cheque_ciclo
  left join cheque_apropriacao on cheque_apropriacao.id = cheque_ciclo.id_cheque_apropriacao
  left join cheque on cheque.id = cheque_apropriacao.id_cheque
  where cheque.situacao = 'A'
  and cheque.tipo = 'R'
  and cheque.data_vencimento >= '${startDate}'
  and cheque.data_vencimento <= '${endDate}'
  and cheque_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano
)
group by mes, ano
order by ano, mes
`;

export const cashFlowCreditsPlanQuery = (startDate: string, endDate: string) => `
select sum(valor) as total, mes, ano
from plan_financeiro_valores
left join plan_financeiro_d on plan_financeiro_d.id = plan_financeiro_valores.id_plan_financeiro_d
left join plano_conta on plano_conta.id = plan_financeiro_d.id_plano_conta
where CAST((ano||'-'||mes||'-1') as date) >= '${startDate}'
and CAST((ano||'-'||mes||'-1') as date) <= '${endDate}'
and plano_conta.tipo = 'R'
group by mes, ano
order by ano, mes
`;

export const cashFlowCreditsPlanBySafraQuery = (startDate: string, endDate: string, idSafra: number) => `
select sum(valor) as total, mes, ano
from plan_financeiro_valores
left join plan_financeiro_d on plan_financeiro_d.id = plan_financeiro_valores.id_plan_financeiro_d
left join plan_financeiro on plan_financeiro.id = plan_financeiro_d.id_plan_financeiro
left join plano_conta on plano_conta.id = plan_financeiro_d.id_plano_conta
where CAST((ano||'-'||mes||'-1') as date) >= '${startDate}'
and CAST((ano||'-'||mes||'-1') as date) <= '${endDate}'
and plano_conta.tipo = 'D'
and plan_financeiro.id_ciclo_producao = ${idSafra}
group by mes, ano
order by ano, mes
`;

export const cashFlowDebitsQuery = (startDate: string, endDate: string) => `
select sum(total) as total, mes, ano
from(
  select sum(valor_principal * -1) as total, extract(month from data_compensacao) as mes, extract(year from data_compensacao) as ano
  from movimento_conta_m
  where compensado = 'S'
  and tipo_lancamento = 'D'
    and data_compensacao >= '${startDate}'
    and data_compensacao <= '${endDate}'
    group by mes, ano

    union all

    select sum((
      conta_receber_pagar.valor_parcela -
      conta_receber_pagar.total_pago +
      conta_receber_pagar.total_multa +
      conta_receber_pagar.total_juros -
      conta_receber_pagar.total_desconto
      ) * -1) as total, extract(month from conta_receber_pagar.data_vencimento) as mes, extract(year from conta_receber_pagar.data_vencimento) as ano
    from conta_receber_pagar
    left join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
    where conta_receber_pagar.situacao = 'A'
    and crp_m.tipo = 2
    and conta_receber_pagar.data_vencimento >= '${startDate}'
    and conta_receber_pagar.data_vencimento <= '${endDate}'
    group by mes, ano

    union all

    select sum(valor * -1) as total, extract(month from data_vencimento) as mes, extract(year from data_vencimento) as ano
    from cheque
    where situacao = 'A'
    and tipo = 'E'
    and data_vencimento >= '${startDate}'
    and data_vencimento <= '${endDate}'
    group by mes, ano

    union all

    select sum(valor * -1) as total, extract(month from vencimento) as mes, extract(year from vencimento) as ano
    from cartao_pagar_d
    where situacao = 0
    and vencimento >= '${startDate}'
    and vencimento <= '${endDate}'
    group by mes, ano
    )
    group by mes, ano
    order by ano, mes
`;

export const cashFlowDebitsQueryBySafra = (startDate: string, endDate: string, idSafra: number) => `
select sum(total) as total, mes, ano
from(
  select sum(movimento_conta_m.valor_principal * -1) as total, extract(month from movimento_conta_m.data_compensacao) as mes, extract(year from movimento_conta_m.data_compensacao) as ano
  from movimento_conta_ciclo
  left join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
  left join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
  left join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
  where movimento_conta_m.compensado = 'S'
  and movimento_conta_m.tipo_lancamento = 'D'
  and movimento_conta_m.data_compensacao >= '${startDate}'
  and movimento_conta_m.data_compensacao <= '${endDate}'
  and movimento_conta_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano

  union all

  select sum((
    conta_receber_pagar.valor_parcela -
    conta_receber_pagar.total_pago +
    conta_receber_pagar.total_multa +
    conta_receber_pagar.total_juros -
    conta_receber_pagar.total_desconto
    ) * -1) as total, extract(month from conta_receber_pagar.data_vencimento) as mes, extract(year from conta_receber_pagar.data_vencimento) as ano
    from conta_receber_pagar_ciclo
    left join crp_apropriacao on crp_apropriacao.id = conta_receber_pagar_ciclo.id_crp_apropriacao
  left join conta_receber_pagar on conta_receber_pagar.id = crp_apropriacao.id_conta_receber_pagar
  left join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
  where conta_receber_pagar.situacao = 'A'
  and crp_m.tipo = 2
  and conta_receber_pagar.data_vencimento >= '${startDate}'
  and conta_receber_pagar.data_vencimento <= '${endDate}'
  and conta_receber_pagar_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano

  union all

  select sum(cheque.valor * -1) as total, extract(month from cheque.data_vencimento) as mes, extract(year from cheque.data_vencimento) as ano
  from cheque_ciclo
  left join cheque_apropriacao on cheque_apropriacao.id = cheque_ciclo.id_cheque_apropriacao
  left join cheque on cheque.id = cheque_apropriacao.id_cheque
  where cheque.situacao = 'A'
  and cheque.tipo = 'E'
  and cheque.data_vencimento >= '${startDate}'
  and cheque.data_vencimento <= '${endDate}'
  and cheque_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano

  union all

  select sum(cartao_pagar_d.valor * -1) as total, extract(month from cartao_pagar_d.vencimento) as mes, extract(year from cartao_pagar_d.vencimento) as ano
  from cartao_pagar_d_ciclo
  left join cartao_pagar_d_apropriacao on cartao_pagar_d_apropriacao.id = cartao_pagar_d_ciclo.id_cartao_pagar_d_apropriacao
  left join cartao_pagar_d on cartao_pagar_d.id = cartao_pagar_d_apropriacao.id_cartao_pagar_d
  where cartao_pagar_d.situacao = 0
  and cartao_pagar_d.vencimento >= '${startDate}'
  and cartao_pagar_d.vencimento <= '${endDate}'
  and cartao_pagar_d_ciclo.id_ciclo_producao = ${idSafra}
  group by mes, ano
  )
group by mes, ano
order by ano, mes
`;

export const cashFlowDebitsPlanQuery = (startDate: string, endDate: string) => `
select sum(valor * -1) as total, mes, ano
from plan_financeiro_valores
left join plan_financeiro_d on plan_financeiro_d.id = plan_financeiro_valores.id_plan_financeiro_d
left join plano_conta on plano_conta.id = plan_financeiro_d.id_plano_conta
where CAST((ano||'-'||mes||'-1') as date) >= '${startDate}'
and CAST((ano||'-'||mes||'-1') as date) <= '${endDate}'
and plano_conta.tipo = 'D'
group by mes, ano
order by ano, mes
`;

export const cashFlowDebitsPlanBySafraQuery = (startDate: string, endDate: string, idSafra: number) => `
select sum(valor * -1) as total, mes, ano
from plan_financeiro_valores
left join plan_financeiro_d on plan_financeiro_d.id = plan_financeiro_valores.id_plan_financeiro_d
left join plan_financeiro on plan_financeiro.id = plan_financeiro_d.id_plan_financeiro
left join plano_conta on plano_conta.id = plan_financeiro_d.id_plano_conta
where CAST((ano||'-'||mes||'-1') as date) >= '${startDate}'
and CAST((ano||'-'||mes||'-1') as date) <= '${endDate}'
and plano_conta.tipo = 'R'
and plan_financeiro.id_ciclo_producao = ${idSafra}
group by mes, ano
order by ano, mes
`;
