import Firebird from 'node-firebird';
import { dbOptions } from '../config/database';

export default {
  query(
    query: string,
    params: any[],
    callback: (err: any, result: any[]) => void
  ) {
    Firebird.attach(dbOptions, (err, db) => {
      if (err) {
        return callback(err, []);
      }

      db.query(query, params, (err, result) => {
        db.detach();

        if (err) {
          return callback(err, []);
        }

        callback(null, result);
      });
    });
  }
};
