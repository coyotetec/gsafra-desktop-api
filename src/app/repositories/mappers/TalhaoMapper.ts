import { TalhaoDomain, TalhaoPersistence } from '../../../types/TalhaoTypes';

class TalhaoMapper {
  toDomain(persistence: TalhaoPersistence): TalhaoDomain {
    return {
      id: persistence.ID,
      nomeTalhao: persistence.NOME_TALHAO,
      nomeVariedade: persistence.NOME_VARIEDADE
    };
  }
}

export default new TalhaoMapper();
