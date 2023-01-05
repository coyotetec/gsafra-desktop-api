import Firebird from 'node-firebird';
import path from 'node:path';

export const dbOptions: Firebird.Options = {
  host: '127.0.0.1',
  port: 3050,
  database: path.resolve(__dirname, '..', '..', '..', '..', 'Dados', 'AGRO.FDB'),
  user: 'SYSDBA',
  password: 'masterkey',
  lowercase_keys: false,
  pageSize: 4096,
};
