export const paymentsQuery = (startDate: string, endDate: string) => `
select
plano_conta.codigo as codigo,
sum(crp_apropriacao.valor) * -1 as total,
extract(month from conta_receber_pagar.data_vencimento) as mes,
extract(year from conta_receber_pagar.data_vencimento) as ano
from crp_apropriacao
inner join conta_receber_pagar on conta_receber_pagar.id = crp_apropriacao.id_conta_receber_pagar
inner join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
inner join plano_conta on plano_conta.id = crp_apropriacao.id_plano_conta
where conta_receber_pagar.data_vencimento >= '${startDate}'
and conta_receber_pagar.data_vencimento <= '${endDate}'
and conta_receber_pagar.situacao = 'A'
and crp_m.tipo = 2
group by codigo, ano, mes
`;

export const receivablesQuery = (startDate: string, endDate: string) => `
select
plano_conta.codigo as codigo,
sum(crp_apropriacao.valor) as total,
extract(month from conta_receber_pagar.data_vencimento) as mes,
extract(year from conta_receber_pagar.data_vencimento) as ano
from crp_apropriacao
inner join conta_receber_pagar on conta_receber_pagar.id = crp_apropriacao.id_conta_receber_pagar
inner join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
inner join plano_conta on plano_conta.id = crp_apropriacao.id_plano_conta
where conta_receber_pagar.data_vencimento >= '${startDate}'
and conta_receber_pagar.data_vencimento <= '${endDate}'
and conta_receber_pagar.situacao = 'A'
and crp_m.tipo = 1
group by codigo, ano, mes
`;

export const checksQuery = (startDate: string, endDate: string) => `
select
plano_conta.codigo as codigo,
sum(
  case when cheque.tipo = 'R'
  then cheque_apropriacao.valor
  else cheque_apropriacao.valor * -1 end
) as total,
extract(month from cheque.data_vencimento) as mes,
extract(year from cheque.data_vencimento) as ano
from cheque_apropriacao
inner join cheque on cheque.id = cheque_apropriacao.id_cheque
inner join plano_conta on plano_conta.id = cheque_apropriacao.id_plano_conta
where cheque.data_vencimento >= '${startDate}'
and cheque.data_vencimento <= '${endDate}'
and cheque.situacao = 'A'
group by codigo, ano, mes
`;

export const creditCardQuery = (startDate: string, endDate: string) => `
select
plano_conta.codigo as codigo,
sum(cartao_pagar_d_apropriacao.valor) * -1 as total,
extract(month from cartao_pagar_d.vencimento) as mes,
extract(year from cartao_pagar_d.vencimento) as ano
from cartao_pagar_d_apropriacao
inner join cartao_pagar_d on cartao_pagar_d.id = cartao_pagar_d_apropriacao.id_cartao_pagar_d
inner join plano_conta on plano_conta.id = cartao_pagar_d_apropriacao.id_plano_conta
where cartao_pagar_d.vencimento >= '${startDate}'
and cartao_pagar_d.vencimento <= '${endDate}'
and cartao_pagar_d.situacao = 0
group by codigo, ano, mes
`;
