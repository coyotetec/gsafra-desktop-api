import { parse } from 'date-fns';
import { Request, Response } from 'express';
import CustoProducaoRepository from '../repositories/CustoProducaoRepository';
import TalhaoRepository from '../repositories/TalhaoRepository';

class CustoProducaoController {
  async totalCategory(request: Request, response: Response) {
    const { idSafra, idTalhao, startDate, endDate } = request.query as {
      idSafra?: string,
      idTalhao?: string;
      startDate?: string,
      endDate?: string,
    };

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra é obrigatório' });
    }

    const parsedIdTalhao = idTalhao ? Number(idTalhao) : undefined;
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const totalCustoCategoriaData = await CustoProducaoRepository.findCustoCategoria({
      idSafra,
      idTalhao: parsedIdTalhao,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    });
    const totalArea = await TalhaoRepository.findArea(idSafra, parsedIdTalhao);
    const totalCusto = totalCustoCategoriaData.reduce((acc, curr) => acc + curr.total, 0);
    const totalCustoPorHectare = Number((totalCusto / totalArea).toFixed(2));
    const totalCustoCategoria = totalCustoCategoriaData.map((item) => ({
      total: item.total,
      categoria: item.categoria,
      totalPorHectare: Number((item.total / totalArea).toFixed(2)),
      porcentagem: Number(((item.total * 100) / totalCusto).toFixed(2))
    }));

    response.json({ totalCusto, totalCustoPorHectare, totalCustoCategoria, });
  }

  async totalTalhao(request: Request, response: Response) {
    const { idSafra, idTalhao, startDate, endDate } = request.query as {
      idSafra?: string,
      idTalhao?: string;
      startDate?: string,
      endDate?: string,
    };

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra é obrigatório' });
    }

    const parsedIdTalhao = idTalhao ? Number(idTalhao) : undefined;
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const totalCustoTalhaoData = await CustoProducaoRepository.findCustoTalhao({
      idSafra,
      idTalhao: parsedIdTalhao,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    });
    const totalArea = await TalhaoRepository.findArea(idSafra, parsedIdTalhao);
    const totalCusto = totalCustoTalhaoData.reduce((acc, curr) => acc + curr.total, 0);
    const totalCustoPorHectare = Number((totalCusto / totalArea).toFixed(2));
    const totalCustoTalhao = totalCustoTalhaoData.map((item) => ({
      total: item.total,
      talhao: item.talhao,
      variedade: item.variedade,
      talhaoVariedade: item.talhaoVariedade,
      totalPorHectare: item.totalPorHectare,
      area: item.area,
      porcentagem: Number(((item.total * 100) / totalCusto).toFixed(2)),
      safra: item.safra,
    }));

    response.json({ totalCusto, totalCustoPorHectare, totalCustoTalhao });
  }
}

export default new CustoProducaoController();
