import { CulturaDomain, CulturaPersistence } from '../../../types/CulturaTypes';

class CulturaMapper {
  toDomain(persistence: CulturaPersistence): CulturaDomain {
    return {
      id: persistence.ID,
      nome: persistence.NOME,
    };
  }
}

export default new CulturaMapper();
