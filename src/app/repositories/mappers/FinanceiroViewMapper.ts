import { ViewColumnDomain, ViewColumnPersistence, ViewDetailDomain, ViewDetailPersistence, ViewDomain, ViewPersistence } from '../../../types/FinanceiroViewTypes';

class FinanceiroViewMapper {
  toViewDomain(persistence: ViewPersistence): ViewDomain {
    return {
      id: persistence.ID,
      nome: persistence.NOME,
      situacao: persistence.SITUACAO
    };
  }

  toViewColumnDomain(persistence: ViewColumnPersistence): ViewColumnDomain {
    return {
      id: persistence.ID,
      idFinanceiroViewM: persistence.ID_FINANCEIRO_VIEW_M,
      nome: persistence.NOME,
      apropriacaoCusto1: Boolean(persistence.APROPRIACAO_CUSTO_1),
      apropriacaoCusto2: Boolean(persistence.APROPRIACAO_CUSTO_2),
      apropriacaoCusto3: Boolean(persistence.APROPRIACAO_CUSTO_3),
      apropriacaoCusto4: Boolean(persistence.APROPRIACAO_CUSTO_4),
      apropriacaoCusto44: Boolean(persistence.APROPRIACAO_CUSTO_44),
      filtrarPlanoConta: Boolean(persistence.FILTRAR_PLANO_CONTA),
      filtrarCentroCusto: Boolean(persistence.FILTRAR_CENTRO_CUSTO),
      filtrarSafra: Boolean(persistence.FILTRAR_SAFRA),
      filtrarPatrimonio: Boolean(persistence.FILTRAR_PATRIMONIO),
      filtrarEmpresa: Boolean(persistence.FILTRAR_EMPRESA)
    };
  }

  toViewDetailDomain(persistence: ViewDetailPersistence): ViewDetailDomain {
    return {
      data: persistence.DATA,
      valor: persistence.VALOR,
      contaBancaria: persistence.CONTA_BANCARIA,
      pessoa: persistence.PESSOA,
      documento: persistence.DOCUMENTO,
      descricao: persistence.DESCRICAO,
      tipoDocumento: persistence.TIPO_DOCUMENTO ? persistence.TIPO_DOCUMENTO.trim() : '',
    };
  }
}

export default new FinanceiroViewMapper();
