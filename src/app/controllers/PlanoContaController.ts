import { eachMonthOfInterval, parse } from 'date-fns';
import { Request, Response } from 'express';
import PlanoContaRepository from '../repositories/PlanoContaRepository';
import { financialStatus } from '../../types/FinanceiroTypes';

class PlanoContaController {
  async index(request: Request, response: Response) {
    const { type, category } = request.query as {
      type?: 'receita' | 'despesa';
      category?: 'sintetica' | 'analitica';
    };

    const planosContas = await PlanoContaRepository.findAll(
      request.databaseName,
      type,
      category,
    );

    response.json(planosContas);
  }

  async total(request: Request, response: Response) {
    const { codigo } = request.params;
    const { startDate, endDate, idSafra } = request.query as {
      startDate: string;
      endDate: string;
      idSafra?: string;
    };

    if (!codigo) {
      return response.status(400).json({ message: 'Código é obrigatório' });
    }

    const parsedStartDate = startDate
      ? parse(startDate, 'dd-MM-yyyy', new Date())
      : undefined;
    const parsedEndDate = endDate
      ? parse(endDate, 'dd-MM-yyyy', new Date())
      : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response
        .status(400)
        .json({ message: 'Data final precisa ser depois da inicial' });
    }

    const total = await PlanoContaRepository.findTotal(request.databaseName, {
      codigo,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      idSafra,
    });

    response.json(total);
  }

  async financial(request: Request, response: Response) {
    const { options, showZeros, startDate, endDate, status } =
      request.query as {
        options: string;
        showZeros: string;
        startDate: string;
        endDate: string;
        status?: financialStatus;
      };

    if (!startDate || !endDate) {
      return response.status(400).json({
        message: 'Data final e inicial são obrigatórias',
      });
    }

    const parsedOptions = options.split(',');
    const parsedShowZeros = showZeros === 'true';
    const parsedStartDate = parse(startDate, 'dd-MM-yyyy', new Date());
    const parsedEndDate = parse(endDate, 'dd-MM-yyyy', new Date());

    if (parsedStartDate > parsedEndDate) {
      return response.status(400).json({
        message: 'Data final precisa ser depois da inicial',
      });
    }

    const chartAccounts = await PlanoContaRepository.findAll(
      request.databaseName,
    );
    const total = await PlanoContaRepository.findFinancial(
      request.databaseName,
      parsedOptions,
      parsedStartDate,
      parsedEndDate,
      status,
    );

    const months = eachMonthOfInterval({
      start: parsedStartDate,
      end: parsedEndDate,
    });
    const eachMonthTotal = months.map(() => 0);

    const parsedData = chartAccounts.reduce((acc, chartAccount) => {
      const data: any = {
        codigo: chartAccount.codigo,
        descricao: chartAccount.descricao,
      };
      let totalMonths = 0;

      months.forEach((month, index) => {
        data[`month${index}`] = total.reduce((acc, curr) => {
          if (
            curr.codigo.startsWith(chartAccount.codigo) &&
            month.getFullYear() === curr.ano &&
            month.getMonth() + 1 === curr.mes
          ) {
            return acc + curr.total;
          }

          return acc;
        }, 0);

        totalMonths += data[`month${index}`];
        if (data.codigo.split('.').length === 1) {
          eachMonthTotal[index] += data[`month${index}`];
        }
      });
      data.total = totalMonths;

      if (totalMonths !== 0 || parsedShowZeros) {
        return [...acc, data];
      }

      return acc;
    }, [] as any[]);

    const accountsTotal = parsedData.reduce((acc, curr) => {
      if (curr.total === 0) {
        return acc;
      }

      if (curr.codigo.split('.').length === 1) {
        return acc + curr.total;
      }

      return acc;
    }, 0);

    response.json({ total: accountsTotal, data: parsedData, eachMonthTotal });
  }
}

export default new PlanoContaController();
