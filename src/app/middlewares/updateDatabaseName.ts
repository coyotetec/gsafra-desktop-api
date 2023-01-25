import { NextFunction, Request, Response } from 'express';
import { updateDatabaseName } from '../../config/database';

export default (request: Request, response: Response, next: NextFunction) => {
  const databaseName = request.headers['x-database-name'] as string | undefined;

  if (databaseName) {
    updateDatabaseName(databaseName);
  } else {
    updateDatabaseName('default');
  }

  next();
};
