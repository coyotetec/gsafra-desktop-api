import Firebird from 'node-firebird';
import fs from 'node:fs';
import path from 'node:path';

const dbPaths =
  process.env.ENVIRONMENT !== 'cloud'
    ? JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '..', '..', '..', 'dbPaths.json'),
          'utf8',
        ),
      )
    : null;

export function dbOptionsGen(databaseName: string): Firebird.Options {
  if (process.env.ENVIRONMENT === 'cloud') {
    return {
      host: '10.101.21.54',
      port: 3050,
      database: 'C:\\Cyot\\AppCyot\\000124_AGRO\\Dados\\AGRO.FDB',
      user: 'SYSDBA',
      password: 'MDzp5OsbJkm3sUK1VSL0',
      lowercase_keys: false,
      pageSize: 4096,
    };
  } else {
    return {
      host: '127.0.0.1',
      port: 3050,
      database: !dbPaths[databaseName]
        ? dbPaths.default
        : dbPaths[databaseName],
      user: 'SYSDBA',
      password: 'masterkey',
      lowercase_keys: false,
      pageSize: 4096,
    };
  }
}
