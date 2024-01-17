import { NextFunction, Request, Response } from 'express';

export default (request: Request, response: Response, next: NextFunction) => {
  const databaseName = request.headers['x-database-name'] as string | undefined;
  const idEmpresa = request.headers['x-id-empresa'] as string | undefined;

  if (process.env.ENVIRONMENT === 'cloud') {
    if (idEmpresa) {
      request.databaseName = idEmpresa.padStart(6, '0');
    } else {
      console.log('Id Empresa Não Informado');
      return response.status(400).json({ message: 'Id empresa não informado' });
    }
  } else {
    if (databaseName) {
      request.databaseName = databaseName;
    } else {
      request.databaseName = 'default';
    }
  }

  next();
};
