import { format, parse } from 'date-fns';
import { Request, Response } from 'express';
import { viewDetailQuery, viewTotalQuery } from '../../database/queries/financeiroViewQueries';
import FinanceiroViewRepository from '../repositories/FinanceiroViewRepository';
import { dataHasZero } from '../utils/dataHasZero';
import { executeFomula } from '../utils/executeFormula';

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

      viewData.push({ id: viewColumn.id, nome: viewColumn.nome, total: viewTotal < 0 ? viewTotal * -1 : viewTotal, totalReal: viewTotal });
    }

    const totalizadores = await FinanceiroViewRepository.findTotalizadores(Number(id));

    const totalizadoresData = [];

    for (const totalizador of totalizadores) {
      let formula = totalizador.formula;

      viewData.forEach((view) => {
        const re = new RegExp(`\\[${view.id}\\]`, 'g');

        formula = formula.replace(re, String(view.totalReal));
      });

      if (formula.includes('/') && dataHasZero(viewData)) {
        totalizadoresData.push({
          nome: totalizador.totalizadorNome,
          error: 'Não é possível realizar divisões quando um dos dados é 0'
        });
        continue;
      }

      const result = executeFomula(formula);

      totalizadoresData.push({ nome: totalizador.totalizadorNome, total: result });
    }

    response.json({ data: viewData, totalizadores: totalizadoresData });
  }
}

export default new FinanceiroViewController();
