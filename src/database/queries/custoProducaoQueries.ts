interface custoCategoriaQueryArgs {
  idSafra: string;
  idTalhao?: number;
  startDate?: string;
  endDate?: string;
}

export const custoCategoriaQuery = ({
  idSafra,
  idTalhao,
  startDate,
  endDate,
}: custoCategoriaQueryArgs) => `
select
    coalesce(cast(sum(abastecimento_ciclo_ts.valor) as numeric(15,2)), 0) as total,
    'Abastecimento' as categoria
from abastecimento_ciclo_ts
inner join abastecimento_ciclo on abastecimento_ciclo.id = abastecimento_ciclo_ts.id_abastecimento_ciclo
inner join abastecimento on abastecimento.id = abastecimento_ciclo.id_abastecimento
where abastecimento.status_processamento = 2
and abastecimento_ciclo.id_ciclo_producao in (${idSafra})
${idTalhao ? `and abastecimento_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
${startDate ? `and abastecimento.data >= '${startDate}'` : ''}
${endDate ? `and abastecimento.data <= '${endDate}'` : ''}

union

select
    coalesce(cast(sum(movimento_conta_ciclo_ts.valor) as numeric(15,2)), 0) as total,
    'Despesas Financeiras' as categoria
from movimento_conta_ciclo_ts
inner join movimento_conta_ciclo on movimento_conta_ciclo.id = movimento_conta_ciclo_ts.id_movimento_conta_ciclo
inner join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
inner join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
inner join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
where movimento_conta_m.tipo_lancamento = 'D'
and movimento_conta_apropriacao.apropriacao_custo = 1
and movimento_conta_ciclo.id_ciclo_producao in (${idSafra})
${idTalhao ? `and movimento_conta_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
and movimento_conta_m.compensado = 'S'
${startDate ? `and movimento_conta_m.data_compensacao >= '${startDate}'` : ''}
${endDate ? `and movimento_conta_m.data_compensacao <= '${endDate}'` : ''}

union

select
    coalesce(cast(sum(total) as numeric(15,2)), 0) as total,
    categoria
from (
    select
        sum(manutencao_m_ciclo_ts.valor) as total,
        'Despesas Patrimônio' as categoria
    from manutencao_m_ciclo_ts
    inner join manutencao_m_ciclo on manutencao_m_ciclo.id = manutencao_m_ciclo_ts.id_manutencao_m_ciclo
    inner join manutencao_m on manutencao_m.id = manutencao_m_ciclo.id_manutencao_m
    where manutencao_m_ciclo.id_ciclo_producao in (${idSafra})
    ${idTalhao ? `and manutencao_m_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
    ${startDate ? `and manutencao_m.data >= '${startDate}'` : ''}
    ${endDate ? `and manutencao_m.data <= '${endDate}'` : ''}

    union all

    select
        sum(movimento_conta_ciclo_ts.valor) as total,
        'Despesas Patrimônio' as categoria
    from movimento_conta_ciclo_ts
    inner join movimento_conta_ciclo on movimento_conta_ciclo.id = movimento_conta_ciclo_ts.id_movimento_conta_ciclo
    inner join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
    inner join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
    inner join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
    where movimento_conta_m.tipo_lancamento = 'D'
    and movimento_conta_apropriacao.apropriacao_custo = 4
    and movimento_conta_ciclo.id_ciclo_producao in (${idSafra})
    ${idTalhao ? `and movimento_conta_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
    and movimento_conta_m.compensado = 'S'
    ${startDate ? `and movimento_conta_m.data_compensacao >= '${startDate}'` : ''}
    ${endDate ? `and movimento_conta_m.data_compensacao <= '${endDate}'` : ''}
) group by categoria

union

select
    coalesce(cast(sum(
        (cast(agri_atv_talhao_safra.proporcao as numeric(15,5)) / 100) *
        (
            select sum(agri_atv_insumo.qtde * agri_atv_insumo.custo_medio)
            from agri_atv_insumo
            where agri_atv_insumo.id_agri_atv = agri_atv_talhao_safra.id_agri_atv
        )
    ) as numeric(15,2)), 0),
    'Atividades Agrícolas' as categoria
from agri_atv_talhao_safra
inner join agri_atv on agri_atv.id = agri_atv_talhao_safra.id_agri_atv
where agri_atv.id_ciclo_producao in (${idSafra})
and agri_atv.status_processamento = 2
${idTalhao ? `and agri_atv_talhao_safra.id_talhao_safra = ${idTalhao}` : ''}
${startDate ? `and agri_atv.data_inicio >= '${startDate}'` : ''}
${endDate ? `and agri_atv.data_inicio <= '${endDate}'` : ''}
`;

export const custoPorTalhaoQuery = ({
  idSafra,
  idTalhao,
  startDate,
  endDate,
}: custoCategoriaQueryArgs) => `
select
  sum(total) as total,
  talhao,
  variedade,
  area,
  safra
from(
  select
    sum(abastecimento_ciclo_ts.valor) as total,
    talhao.descricao as talhao,
    variedade.nome as variedade,
    talhao_safra.hectares as area,
    ciclo_producao.nome as safra
  from abastecimento_ciclo_ts
  inner join abastecimento_ciclo on abastecimento_ciclo.id = abastecimento_ciclo_ts.id_abastecimento_ciclo
  inner join abastecimento on abastecimento.id = abastecimento_ciclo.id_abastecimento
  inner join talhao_safra on talhao_safra.id = abastecimento_ciclo_ts.id_talhao_safra
  inner join talhao on talhao.id = talhao_safra.id_talhao
  inner join variedade on variedade.id = talhao_safra.id_variedade
  inner join ciclo_producao on ciclo_producao.id = talhao_safra.id_ciclo_producao
  where abastecimento.status_processamento = 2
  and abastecimento_ciclo.id_ciclo_producao in (${idSafra})
  ${idTalhao ? `and abastecimento_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
  ${startDate ? `and abastecimento.data >= '${startDate}'` : ''}
  ${endDate ? `and abastecimento.data <= '${endDate}'` : ''}
  group by talhao, variedade, area, safra

  union all

  select
    sum(movimento_conta_ciclo_ts.valor) as total,
    talhao.descricao as talhao,
    variedade.nome as variedade,
    talhao_safra.hectares as area,
    ciclo_producao.nome as safra
  from movimento_conta_ciclo_ts
  inner join movimento_conta_ciclo on movimento_conta_ciclo.id = movimento_conta_ciclo_ts.id_movimento_conta_ciclo
  inner join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
  inner join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
  inner join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
  inner join talhao_safra on talhao_safra.id = movimento_conta_ciclo_ts.id_talhao_safra
  inner join talhao on talhao.id = talhao_safra.id_talhao
  inner join variedade on variedade.id = talhao_safra.id_variedade
  inner join ciclo_producao on ciclo_producao.id = talhao_safra.id_ciclo_producao
  where movimento_conta_m.tipo_lancamento = 'D'
  and movimento_conta_apropriacao.apropriacao_custo = 1
  and movimento_conta_ciclo.id_ciclo_producao in (${idSafra})
  ${idTalhao ? `and movimento_conta_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
  and movimento_conta_m.compensado = 'S'
  ${startDate ? `and movimento_conta_m.data_compensacao >= '${startDate}'` : ''}
  ${endDate ? `and movimento_conta_m.data_compensacao <= '${endDate}'` : ''}
  group by talhao, variedade, area, safra

  union all

  select
    sum(manutencao_m_ciclo_ts.valor) as total,
    talhao.descricao as talhao,
    variedade.nome as variedade,
    talhao_safra.hectares as area,
    ciclo_producao.nome as safra
  from manutencao_m_ciclo_ts
  inner join manutencao_m_ciclo on manutencao_m_ciclo.id = manutencao_m_ciclo_ts.id_manutencao_m_ciclo
  inner join manutencao_m on manutencao_m.id = manutencao_m_ciclo.id_manutencao_m
  inner join talhao_safra on talhao_safra.id = manutencao_m_ciclo_ts.id_talhao_safra
  inner join talhao on talhao.id = talhao_safra.id_talhao
  inner join variedade on variedade.id = talhao_safra.id_variedade
  inner join ciclo_producao on ciclo_producao.id = talhao_safra.id_ciclo_producao
  where manutencao_m_ciclo.id_ciclo_producao in (${idSafra})
  ${idTalhao ? `and manutencao_m_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
  ${startDate ? `and manutencao_m.data >= '${startDate}'` : ''}
  ${endDate ? `and manutencao_m.data <= '${endDate}'` : ''}
  group by talhao, variedade, area, safra

  union all

  select
    sum(movimento_conta_ciclo_ts.valor) as total,
    talhao.descricao as talhao,
    variedade.nome as variedade,
    talhao_safra.hectares as area,
    ciclo_producao.nome as safra
  from movimento_conta_ciclo_ts
  inner join movimento_conta_ciclo on movimento_conta_ciclo.id = movimento_conta_ciclo_ts.id_movimento_conta_ciclo
  inner join movimento_conta_apropriacao on movimento_conta_apropriacao.id = movimento_conta_ciclo.id_movimento_conta_apropriacao
  inner join movimento_conta on movimento_conta.id = movimento_conta_apropriacao.id_movimento_conta
  inner join movimento_conta_m on movimento_conta_m.id = movimento_conta.id_movimento_conta_m
  inner join talhao_safra on talhao_safra.id = movimento_conta_ciclo_ts.id_talhao_safra
  inner join talhao on talhao.id = talhao_safra.id_talhao
  inner join variedade on variedade.id = talhao_safra.id_variedade
  inner join ciclo_producao on ciclo_producao.id = talhao_safra.id_ciclo_producao
  where movimento_conta_m.tipo_lancamento = 'D'
  and movimento_conta_apropriacao.apropriacao_custo = 4
  and movimento_conta_ciclo.id_ciclo_producao in (${idSafra})
  ${idTalhao ? `and movimento_conta_ciclo_ts.id_talhao_safra = ${idTalhao}` : ''}
  and movimento_conta_m.compensado = 'S'
  ${startDate ? `and movimento_conta_m.data_compensacao >= '${startDate}'` : ''}
  ${endDate ? `and movimento_conta_m.data_compensacao <= '${endDate}'` : ''}
  group by talhao, variedade, area, safra

  union all

  select
    sum(
      (cast(agri_atv_talhao_safra.proporcao as numeric(15,5)) / 100) *
      (
        select sum(agri_atv_insumo.qtde * agri_atv_insumo.custo_medio)
        from agri_atv_insumo
        where agri_atv_insumo.id_agri_atv = agri_atv_talhao_safra.id_agri_atv
      )
    ),
    talhao.descricao as talhao,
    variedade.nome as variedade,
    talhao_safra.hectares as area,
    ciclo_producao.nome as safra
  from agri_atv_talhao_safra
  inner join agri_atv on agri_atv.id = agri_atv_talhao_safra.id_agri_atv
  inner join talhao_safra on talhao_safra.id = agri_atv_talhao_safra.id_talhao_safra
  inner join talhao on talhao.id = talhao_safra.id_talhao
  inner join variedade on variedade.id = talhao_safra.id_variedade
  inner join ciclo_producao on ciclo_producao.id = talhao_safra.id_ciclo_producao
  where agri_atv.id_ciclo_producao in (${idSafra})
  and agri_atv.status_processamento = 2
  ${idTalhao ? `and agri_atv_talhao_safra.id_talhao_safra = ${idTalhao}` : ''}
  ${startDate ? `and agri_atv.data_inicio >= '${startDate}'` : ''}
  ${endDate ? `and agri_atv.data_inicio <= '${endDate}'` : ''}
  group by talhao, variedade, area, safra
) group by talhao, variedade, area, safra
order by total desc
`;
