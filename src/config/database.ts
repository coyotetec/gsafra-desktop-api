import Firebird from 'node-firebird';
import fs from 'node:fs';
import path from 'node:path';

let databaseName = 'default';
const dbPaths = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'dbPaths.json'), 'utf8')
);

export function updateDatabaseName(newName: string) {
  databaseName = newName;
}

export function dbOptionsGen(): Firebird.Options {
  return {
    host: '127.0.0.1',
    port: 3050,
    database: !dbPaths[databaseName] ? dbPaths.default : dbPaths[databaseName],
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false,
    pageSize: 4096,
  };
}
