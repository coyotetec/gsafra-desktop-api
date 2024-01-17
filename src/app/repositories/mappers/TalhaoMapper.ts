import { TalhaoDomain, TalhaoPersistence } from '../../../types/TalhaoTypes';

class TalhaoMapper {
  toDomain(persistence: TalhaoPersistence): TalhaoDomain {
    return {
      id: persistence.ID,
      talhao: persistence.TALHAO,
      variedade: persistence.VARIEDADE,
      safra: persistence.SAFRA,
    };
  }
}

export default new TalhaoMapper();
