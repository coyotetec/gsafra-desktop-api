interface custoCategoriaQueryArgs {
  idSafra: number;
  idTalhao?: number;
  startDate?: string;
  endDate?: string
}

export const custoCategoriaQuery = ({idSafra, idTalhao, startDate, endDate}: custoCategoriaQueryArgs) => `
select
    coalesce(cast(sum(abastecimento_ciclo_ts.valor) as numeric(15,2)), 0) as total,
    'Abastecimento' as categoria
from abastecimento_ciclo_ts
left join abastecimento_ciclo on abastecimento_ciclo.id = abastecimento_ciclo_ts.id_abastecimento_ciclo
left join abastecimento on abastecimento.id = abastecimento_ciclo.id_abastecimento
where abastecimento_ciclo.id_ciclo_producao = ${idSafra}
${idTalhao ? `and abastecimento_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
${startDate ? `and abastecimento.data >= ${startDate}` : ''}
${endDate ? `and abastecimento.data <= ${endDate}` :  ''}

union

select
    coalesce(cast(sum(movimento_conta_ciclo_ts.valor) as numeric(15,2)), 0) as total,
    'Despesas Financeiras' as categoria
from movimento_conta_ciclo_ts
left join movimento_conta_ciclo on movimento_conta_ciclo.id = movimento_conta_ciclo_ts.id_movimento_conta_ciclo
left join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
left join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
left join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
where movimento_conta_m.tipo_lancamento = 'D'
and movimento_conta_apropriacao.apropriacao_custo = 1
and movimento_conta_ciclo.id_ciclo_producao = ${idSafra}
${idTalhao ? `and movimento_conta_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
and movimento_conta_m.compensado = 'S'
${startDate ? `and movimento_conta_m.data_compensacao >= ${startDate}` : ''}
${endDate ? `and movimento_conta_m.data_compensacao <= ${endDate}` : ''}

union

select
    coalesce(cast(sum(total) as numeric(15,2)), 0) as total,
    categoria
from (
    select
        sum(manutencao_m_ciclo_ts.valor) as total,
        'Despesas Patrimônio' as categoria
    from manutencao_m_ciclo_ts
    left join manutencao_m_ciclo on manutencao_m_ciclo.id = manutencao_m_ciclo_ts.id_manutencao_m_ciclo
    where manutencao_m_ciclo.id_ciclo_producao = ${idSafra}
    ${idTalhao ? `and manutencao_m_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
    ${startDate ? `and manutencao_m.data >= ${startDate}` : ''}
    ${endDate ? `and manutencao_m.data <= ${endDate}` : ''}

    union all

    select
        sum(movimento_conta_ciclo_ts.valor) as total,
        'Despesas Patrimônio' as categoria
    from movimento_conta_ciclo_ts
    left join movimento_conta_ciclo on movimento_conta_ciclo.id = movimento_conta_ciclo_ts.id_movimento_conta_ciclo
    left join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
    left join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
    left join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
    where movimento_conta_m.tipo_lancamento = 'D'
    and movimento_conta_apropriacao.apropriacao_custo = 4
    and movimento_conta_ciclo.id_ciclo_producao = ${idSafra}
    ${idTalhao ? `and movimento_conta_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
    and movimento_conta_m.compensado = 'S'
    ${startDate ? `and movimento_conta_m.data_compensacao >= ${startDate}` : ''}
    ${endDate ? `and movimento_conta_m.data_compensacao <= ${endDate}` : ''}
) group by categoria

union

select
    coalesce(cast(sum(
        (cast(agri_atv_talhao_safra.proporcao as numeric(15,8)) / 100) *
        (
            select sum(agri_atv_insumo.qtde * agri_atv_insumo.custo_medio)
            from agri_atv_insumo
            where agri_atv_insumo.id_agri_atv = agri_atv_talhao_safra.id_agri_atv
        )
    ) as numeric(15,2)), 0),
    'Atividades Agrícolas' as categoria
from agri_atv_talhao_safra
left join agri_atv on agri_atv.id = agri_atv_talhao_safra.id_agri_atv
where agri_atv.id_ciclo_producao = ${idSafra}
${idTalhao ? `and agri_atv_talhao_safra.id_talhao_safra = ${idTalhao}` : ''}
${startDate ? `and agri_atv.data_inicio >= ${startDate}` : ''}
${endDate ? `and agri_atv.data_inicio <= ${endDate}` : ''}
`;
