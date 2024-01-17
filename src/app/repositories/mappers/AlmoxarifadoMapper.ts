import {
  AlmoxarifadoDomain,
  AlmoxarifadoPersistence,
} from '../../../types/AlmoxarifadoTypes';

class AlmoxarifadoMapper {
  toDomain(persistence: AlmoxarifadoPersistence): AlmoxarifadoDomain {
    return {
      id: persistence.ID,
      nome: persistence.NOME,
      idFazenda: persistence.ID_FAZENDA,
      status: persistence.STATUS,
    };
  }
}

export default new AlmoxarifadoMapper();
