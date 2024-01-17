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
      host: 'node165871-dbgsafra.nordeste-idc.saveincloud.net',
      port: 12081,
      database: `/opt/firebird/data/${databaseName}/AGRO.FDB`,
      user: 'SYSDBA',
      password: 'ak0TJPGR68xcIdEbZ9l1',
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
