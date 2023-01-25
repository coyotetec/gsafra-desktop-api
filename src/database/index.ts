import Firebird from 'node-firebird';
import { dbOptionsGen } from '../config/database';

export default {
  query(
    query: string,
    params: any[],
    callback: (err: any, result: any[]) => void,
  ) {
    Firebird.attach(dbOptionsGen(), (err, db) => {
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
