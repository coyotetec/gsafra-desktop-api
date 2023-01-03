import { format, parse } from 'date-fns';
import { Request, Response } from 'express';
import { viewDetailQuery, viewTotalQuery } from '../../database/queries/financeiroViewQueries';
import FinanceiroViewRepository from '../repositories/FinanceiroViewRepository';

class FinanceiroViewController {
  async index(request: Request, response: Response) {
    const views = await FinanceiroViewRepository.findAll();

    response.json(views);
  }

  async findDetail(request: Request, response: Response) {
    const { id } = request.params;
    const { startDate, endDate } = request.query as {
      startDate: string,
      endDate: string,
    };

    if (!id) {
      return response.status(400).json({ message: 'Id da view é obrigatório' });
    }

    if (!startDate || !endDate) {
      return response.status(400).json({ message: 'Datas inicial e final são obrigatórias' });
    }

    const parsedStartDate = parse(startDate, 'dd-MM-yyyy', new Date());
    const parsedEndDate = parse(endDate, 'dd-MM-yyyy', new Date());

    if (parsedStartDate >= parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const viewColumns = await FinanceiroViewRepository.findViewColumns(Number(id));

    const data = [];

    for (const viewColumn of viewColumns) {
      const query = viewDetailQuery(
        viewColumn,
        format(parsedStartDate, 'yyyy-MM-dd'),
        format(parsedEndDate, 'yyyy-MM-dd')
      );

      const viewDetails = await FinanceiroViewRepository.findViewDetails(viewColumn.nome, query);

      data.push(...viewDetails);
    }

    response.json(data);
  }

  async find(request: Request, response: Response) {
    const { id } = request.params;
    const { startDate, endDate } = request.query as {
      startDate: string,
      endDate: string,
    };

    if (!id) {
      return response.status(400).json({ message: 'Id da view é obrigatório' });
    }

    if (!startDate || !endDate) {
      return response.status(400).json({ message: 'Datas inicial e final são obrigatórias' });
    }

    const parsedStartDate = parse(startDate, 'dd-MM-yyyy', new Date());
    const parsedEndDate = parse(endDate, 'dd-MM-yyyy', new Date());

    if (parsedStartDate >= parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const viewColumns = await FinanceiroViewRepository.findViewColumns(Number(id));
    const viewData = [];

    for (const viewColumn of viewColumns) {
      const query = viewTotalQuery(
        viewColumn,
        format(parsedStartDate, 'yyyy-MM-dd'),
        format(parsedEndDate, 'yyyy-MM-dd')
      );

      const viewTotal = await FinanceiroViewRepository.findViewTotal(query);

      viewData.push({ nome: viewColumn.nome, total: viewTotal < 0 ? viewTotal * -1 : viewTotal });
    }

    response.json(viewData);
  }
}

export default new FinanceiroViewController();
