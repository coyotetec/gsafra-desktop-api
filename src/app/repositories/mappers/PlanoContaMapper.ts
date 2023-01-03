import { PlanoContaDomain, PlanoContaPersistence, PlanoContaTotalDomain, PlanoContaTotalPersistence } from '../../../types/PlanoContaTypes';

class PlanoContaMapper {
  toPlanoContaDomain(persistence: PlanoContaPersistence): PlanoContaDomain {
    return {
      id: persistence.ID,
      idPai: persistence.ID_PAI,
      codigo: persistence.CODIGO,
      descricao: persistence.DESCRICAO.trim(),
      descricaoImpressao: persistence.DESCRICAO_IMPRESSAO.trim(),
      tipo: persistence.TIPO.trim(),
      nivel: persistence.NIVEL,
      categoria: persistence.CATEGORIA,
      status: persistence.STATUS,
      dedutivel: persistence.DEDUTIVEL,
      idPlanoContaTipoGrupo: persistence.ID_PLANO_CONTA_TIPO_GRUPO,
    };
  }

  toTotalDomain(persistence: PlanoContaTotalPersistence): PlanoContaTotalDomain {
    return {
      descricao: persistence.DESCRICAO,
      total: persistence.TOTAL
    };
  }
}

export default new PlanoContaMapper();
