import { AgriLocalDomain, AgriLocalPersistence } from '../../../types/AgriLocalTypes';

class AgriLocalMapper {
  toDomain(persistence: AgriLocalPersistence): AgriLocalDomain {
    return {
      id: persistence.ID,
      nome: persistence.NOME,
    };
  }
}

export default new AgriLocalMapper();
