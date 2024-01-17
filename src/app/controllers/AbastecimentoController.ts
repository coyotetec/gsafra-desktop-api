import { eachMonthOfInterval, parse } from 'date-fns';
import { Request, Response } from 'express';
import AbastecimentoRepository from '../repositories/AbastecimentoRepository';
import TalhaoRepository from '../repositories/TalhaoRepository';
import parseAbastecimentoTotal from '../utils/parseAbastecimentoTotal';

interface TotalMonthlyQuery {
  startDate?: string;
  endDate?: string;
  idPatrimonio?: string;
  idProdutoAlmoxarifado?: string;
  idAlmoxarifado?: string;
  idTipoPatrimonio?: string;
  custo?: 'atual' | 'medio';
}

class AbastecimentoController {
  async totalMonthly(request: Request, response: Response) {
    const {
      startDate,
      endDate,
      custo,
      idPatrimonio,
      idProdutoAlmoxarifado,
      idAlmoxarifado,
      idTipoPatrimonio,
    } = request.query as TotalMonthlyQuery;

    if (!custo) {
      return response.status(400).json({ message: 'Custo é obrigatório' });
    }

    const parsedIdPatrimonio = idPatrimonio ? Number(idPatrimonio) : undefined;
    const parsedIdProdutoAlmoxarifado = idProdutoAlmoxarifado
      ? Number(idProdutoAlmoxarifado)
      : undefined;
    const parsedIdAlmoxarifado = idAlmoxarifado
      ? Number(idAlmoxarifado)
      : undefined;
    const parsedIdTipoPatrimonio = idTipoPatrimonio
      ? Number(idTipoPatrimonio)
      : undefined;
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

    const [totalValues, totalQty] = await Promise.all([
      AbastecimentoRepository.findTotalMonthlyValue(request.databaseName, {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        idPatrimonio: parsedIdPatrimonio,
        idProdutoAlmoxarifado: parsedIdProdutoAlmoxarifado,
        idAlmoxarifado: parsedIdAlmoxarifado,
        idTipoPatrimonio: parsedIdTipoPatrimonio,
        custo,
      }),
      AbastecimentoRepository.findTotalMonthlyQty(request.databaseName, {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        idPatrimonio: parsedIdPatrimonio,
        idProdutoAlmoxarifado: parsedIdProdutoAlmoxarifado,
        idAlmoxarifado: parsedIdAlmoxarifado,
        idTipoPatrimonio: parsedIdTipoPatrimonio,
      }),
    ]);

    const monthsValue = eachMonthOfInterval({
      start:
        parsedStartDate || new Date(totalValues[0].ano, totalValues[0].mes - 1),
      end:
        parsedEndDate ||
        new Date(
          totalValues[totalValues.length - 1].ano,
          totalValues[totalValues.length - 1].mes - 1,
        ),
    });

    const monthsQty = eachMonthOfInterval({
      start: parsedStartDate || new Date(totalQty[0].ano, totalQty[0].mes - 1),
      end:
        parsedEndDate ||
        new Date(
          totalQty[totalQty.length - 1].ano,
          totalQty[totalQty.length - 1].mes - 1,
        ),
    });

    const monthlyValue = parseAbastecimentoTotal(monthsValue, totalValues);
    const monthlyValueTotal = Number(
      totalValues.reduce((acc, curr) => acc + curr.total, 0).toFixed(3),
    );

    const monthlyQty = parseAbastecimentoTotal(monthsQty, totalQty);
    const monthlyQtyTotal = Number(
      totalQty.reduce((acc, curr) => acc + curr.total, 0).toFixed(3),
    );

    return response.json({
      monthlyValue,
      monthlyValueTotal,
      monthlyQty,
      monthlyQtyTotal,
    });
  }

  async totalFuel(request: Request, response: Response) {
    const {
      startDate,
      endDate,
      custo,
      idPatrimonio,
      idProdutoAlmoxarifado,
      idAlmoxarifado,
      idTipoPatrimonio,
    } = request.query as TotalMonthlyQuery;

    if (!custo) {
      return response.status(400).json({ message: 'Custo é obrigatório' });
    }

    const parsedIdPatrimonio = idPatrimonio ? Number(idPatrimonio) : undefined;
    const parsedIdProdutoAlmoxarifado = idProdutoAlmoxarifado
      ? Number(idProdutoAlmoxarifado)
      : undefined;
    const parsedIdAlmoxarifado = idAlmoxarifado
      ? Number(idAlmoxarifado)
      : undefined;
    const parsedIdTipoPatrimonio = idTipoPatrimonio
      ? Number(idTipoPatrimonio)
      : undefined;
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

    const [fuelValue, fuelQty] = await Promise.all([
      AbastecimentoRepository.findTotalFuelValue(request.databaseName, {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        idPatrimonio: parsedIdPatrimonio,
        idProdutoAlmoxarifado: parsedIdProdutoAlmoxarifado,
        idAlmoxarifado: parsedIdAlmoxarifado,
        idTipoPatrimonio: parsedIdTipoPatrimonio,
        custo,
      }),
      AbastecimentoRepository.findTotalFuelQty(request.databaseName, {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        idPatrimonio: parsedIdPatrimonio,
        idProdutoAlmoxarifado: parsedIdProdutoAlmoxarifado,
        idAlmoxarifado: parsedIdAlmoxarifado,
        idTipoPatrimonio: parsedIdTipoPatrimonio,
      }),
    ]);

    const fuelValueTotal = Number(
      fuelValue.reduce((acc, curr) => acc + curr.total, 0).toFixed(3),
    );
    const fuelQtyTotal = Number(
      fuelQty.reduce((acc, curr) => acc + curr.total, 0).toFixed(3),
    );

    return response.json({ fuelValue, fuelValueTotal, fuelQty, fuelQtyTotal });
  }

  async totalPatrimony(request: Request, response: Response) {
    const {
      startDate,
      endDate,
      custo,
      idPatrimonio,
      idProdutoAlmoxarifado,
      idAlmoxarifado,
    } = request.query as TotalMonthlyQuery;

    if (!custo) {
      return response.status(400).json({ message: 'Custo é obrigatório' });
    }

    const parsedIdPatrimonio = idPatrimonio ? Number(idPatrimonio) : undefined;
    const parsedIdProdutoAlmoxarifado = idProdutoAlmoxarifado
      ? Number(idProdutoAlmoxarifado)
      : undefined;
    const parsedIdAlmoxarifado = idAlmoxarifado
      ? Number(idAlmoxarifado)
      : undefined;
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

    const [patrimonyValue, patrimonyQty] = await Promise.all([
      AbastecimentoRepository.findTotalPatrimonyValue(request.databaseName, {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        idPatrimonio: parsedIdPatrimonio,
        idProdutoAlmoxarifado: parsedIdProdutoAlmoxarifado,
        idAlmoxarifado: parsedIdAlmoxarifado,
        custo,
      }),
      AbastecimentoRepository.findTotalPatrimonyQty(request.databaseName, {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        idPatrimonio: parsedIdPatrimonio,
        idProdutoAlmoxarifado: parsedIdProdutoAlmoxarifado,
        idAlmoxarifado: parsedIdAlmoxarifado,
      }),
    ]);

    const patrimonyValueTotal = Number(
      patrimonyValue.reduce((acc, curr) => acc + curr.total, 0).toFixed(3),
    );
    const patrimonyQtyTotal = Number(
      patrimonyQty.reduce((acc, curr) => acc + curr.total, 0).toFixed(3),
    );

    return response.json({
      patrimonyValue,
      patrimonyValueTotal,
      patrimonyQty,
      patrimonyQtyTotal,
    });
  }

  async description(request: Request, response: Response) {
    const {
      startDate,
      endDate,
      custo,
      idPatrimonio,
      idProdutoAlmoxarifado,
      idAlmoxarifado,
      idTipoPatrimonio,
    } = request.query as TotalMonthlyQuery;

    if (!custo) {
      return response.status(400).json({ message: 'Custo é obrigatório' });
    }

    const parsedIdPatrimonio = idPatrimonio ? Number(idPatrimonio) : undefined;
    const parsedIdProdutoAlmoxarifado = idProdutoAlmoxarifado
      ? Number(idProdutoAlmoxarifado)
      : undefined;
    const parsedIdAlmoxarifado = idAlmoxarifado
      ? Number(idAlmoxarifado)
      : undefined;
    const parsedIdTipoPatrimonio = idTipoPatrimonio
      ? Number(idTipoPatrimonio)
      : undefined;
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

    const details = await AbastecimentoRepository.findDetails(
      request.databaseName,
      {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        idPatrimonio: parsedIdPatrimonio,
        idProdutoAlmoxarifado: parsedIdProdutoAlmoxarifado,
        idAlmoxarifado: parsedIdAlmoxarifado,
        idTipoPatrimonio: parsedIdTipoPatrimonio,
        custo,
      },
    );

    return response.json(details);
  }

  async totalFuelBySafra(request: Request, response: Response) {
    const { idSafra, idTalhao, startDate, endDate } = request.query as {
      idSafra?: string;
      idTalhao?: string;
      startDate?: string;
      endDate?: string;
    };

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra é obrigatório' });
    }

    const parsedIdTalhao = idTalhao ? Number(idTalhao) : undefined;
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

    const [inputsTotalData, totalArea] = await Promise.all([
      AbastecimentoRepository.findTotalFuelBySafra(request.databaseName, {
        idSafra,
        idTalhao: parsedIdTalhao,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      }),
      TalhaoRepository.findArea(request.databaseName, idSafra, parsedIdTalhao),
    ]);

    const inputsTotalSafra = inputsTotalData.reduce(
      (acc, curr) => acc + curr.total,
      0,
    );
    const inputsTotalPorHectareSafra = Number(
      (inputsTotalSafra / totalArea).toFixed(2),
    );
    const inputsTotal = inputsTotalData.map((item) => ({
      insumo: item.insumo,
      total: item.total,
      quantidade: item.quantidade,
      porcentagem: Number(((item.total * 100) / inputsTotalSafra).toFixed(2)),
      totalPorHectare: Number((item.total / totalArea).toFixed(2)),
      quantidadePorHectare: Number((item.quantidade / totalArea).toFixed(2)),
      unidade: item.unidade,
    }));

    response.json({
      inputsTotalSafra,
      inputsTotalPorHectareSafra,
      inputsTotal,
    });
  }
}

export default new AbastecimentoController();
