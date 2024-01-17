import {
  TipoPatrimonioDomain,
  TipoPatrimonioPersistence,
} from '../../../types/TipoPatrimonioTypes';

class TipoPatrimonioMapper {
  toDomain(persistence: TipoPatrimonioPersistence): TipoPatrimonioDomain {
    return {
      id: persistence.ID,
      nome: persistence.NOME,
    };
  }
}

export default new TipoPatrimonioMapper();
