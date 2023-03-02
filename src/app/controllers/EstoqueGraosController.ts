import { parse } from 'date-fns';
import { Request, Response } from 'express';
import { SaldoProdutorDomain } from '../../types/EstoqueGraos';
import EstoqueGraosRepository from '../repositories/EstoqueGraosRepository';

class EstoqueGraosController {
  async total(request: Request, response: Response) {
    const { idCultura, startDate, endDate, idProdutor, idArmazenamento, idSafra } = request.query as {
      idCultura?: string;
      startDate?: string;
      endDate?: string;
      idProdutor?: string;
      idArmazenamento?: string;
      idSafra?: string;
    };

    if (!idCultura) {
      return response.status(400).json({ message: 'Id cultura é obrigatório' });
    }

    const parsedIdCultura = Number(idCultura);
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedIdProdutor = idProdutor ? Number(idProdutor) : undefined;
    const parsedIdArmazenamento = idArmazenamento ? Number(idArmazenamento) : undefined;
    const parsedIdSafra = idSafra ? Number(idSafra) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    let saldoAnterior = 0;

    if (parsedStartDate) {
      saldoAnterior = await EstoqueGraosRepository.findSaldoAnterior({
        idCultura: parsedIdCultura,
        startDate: parsedStartDate,
        idProdutor: parsedIdProdutor,
        idArmazenamento: parsedIdArmazenamento,
        idSafra: parsedIdSafra
      });
    }

    const entradas = await EstoqueGraosRepository.findEntradas({
      idCultura: parsedIdCultura,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      idProdutor: parsedIdProdutor,
      idArmazenamento: parsedIdArmazenamento,
      idSafra: parsedIdSafra
    });
    const saidas = await EstoqueGraosRepository.findSaidas({
      idCultura: parsedIdCultura,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      idProdutor: parsedIdProdutor,
      idArmazenamento: parsedIdArmazenamento,
      idSafra: parsedIdSafra
    });

    const saldoFinal = saldoAnterior + entradas.pesoLiquido - saidas.pesoLiquido;

    response.json({ saldoAnterior, entradas, saidas, saldoFinal });
  }

  async totalProdutor(request: Request, response: Response) {
    const { idCultura, startDate, endDate, idProdutor, idArmazenamento, idSafra } = request.query as {
      idCultura?: string;
      startDate?: string;
      endDate?: string;
      idProdutor?: string;
      idArmazenamento?: string;
      idSafra?: string;
    };

    if (!idCultura) {
      return response.status(400).json({ message: 'Id cultura é obrigatório' });
    }

    const parsedIdCultura = Number(idCultura);
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedIdProdutor = idProdutor ? Number(idProdutor) : undefined;
    const parsedIdArmazenamento = idArmazenamento ? Number(idArmazenamento) : undefined;
    const parsedIdSafra = idSafra ? Number(idSafra) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const entradas = await EstoqueGraosRepository.findEntradasProdutor({
      idCultura: parsedIdCultura,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      idProdutor: parsedIdProdutor,
      idArmazenamento: parsedIdArmazenamento,
      idSafra: parsedIdSafra
    });
    const saidas = await EstoqueGraosRepository.findSaidasProdutor({
      idCultura: parsedIdCultura,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      idProdutor: parsedIdProdutor,
      idArmazenamento: parsedIdArmazenamento,
      idSafra: parsedIdSafra
    });

    let saldoAnterior: SaldoProdutorDomain[] = entradas.map(item => ({
      idProdutor: item.idProdutor,
      produtor: item.produtor,
      saldo: 0
    }));

    if (parsedStartDate) {
      saldoAnterior = await EstoqueGraosRepository.findSaldoAnteriorProdutor({
        idCultura: parsedIdCultura,
        startDate: parsedStartDate,
        idProdutor: parsedIdProdutor,
        idArmazenamento: parsedIdArmazenamento,
        idSafra: parsedIdSafra
      });
    }

    let saldoFinal = saldoAnterior.map((item, index) => ({
      idProdutor: item.idProdutor,
      produtor: item.produtor,
      saldo: item.saldo + (entradas[index]?.pesoLiquido || 0) - (saidas[index]?.pesoLiquido || 0),
      saldoSacas: (item.saldo + (entradas[index]?.pesoLiquido || 0) - (saidas[index]?.pesoLiquido || 0)) / 60
    }));

    const estoqueGraosProdutor = saldoAnterior.map((item, index) => ({
      idProdutor: item.idProdutor,
      produtor: item.produtor,
      saldoAnterior: item.saldo,
      entradas: entradas[index],
      saidas: saidas[index],
      saldoFinal: saldoFinal[index].saldo
    }));

    saldoFinal = saldoFinal.sort((a, b) => b.saldo - a.saldo);

    response.json({ estoqueGraosProdutor, saldoFinal });
  }
}

export default new EstoqueGraosController();
