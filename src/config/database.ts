import Firebird from 'node-firebird';
import fs from 'node:fs';
import path from 'node:path';

const dbPaths = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '..', '..', '..', 'dbPaths.json'),
    'utf8',
  ),
);

export function dbOptionsGen(databaseName: string): Firebird.Options {
  if (process.env.ENVIRONMENT === 'cloud') {
    return {
      host: process.env.CLOUD_DATABASE_HOST,
      port: Number(process.env.CLOUD_DATABASE_PORT),
      database: `/opt/firebird/data/${databaseName}/AGRO.FDB`,
      user: process.env.CLOUD_DATABASE_USER,
      password: process.env.CLOUD_DATABASE_PASSWORD,
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
