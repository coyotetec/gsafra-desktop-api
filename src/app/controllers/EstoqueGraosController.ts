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

    let saldoAnterior: SaldoProdutorDomain[] = [];

    if (parsedStartDate) {
      saldoAnterior = await EstoqueGraosRepository.findSaldoAnteriorProdutor({
        idCultura: parsedIdCultura,
        startDate: parsedStartDate,
        idProdutor: parsedIdProdutor,
        idArmazenamento: parsedIdArmazenamento,
        idSafra: parsedIdSafra
      });
    }

    const estoqueGraosProdutor = [...entradas, ...saidas, ...saldoAnterior].reduce((acc, curr) => {
      const index = acc.findIndex((t) => (
        t.idProdutor === curr.idProdutor && t.produtor === curr.produtor
      ));

      if (index === -1) {
        const saldoAnteriorProdutor = saldoAnterior.find((t) => (
          t.idProdutor === curr.idProdutor && t.produtor === curr.produtor
        ))?.saldo || 0;
        const entradasProdutor = entradas.find((t) => (
          t.idProdutor === curr.idProdutor && t.produtor === curr.produtor
        )) || {
          idProdutor: curr.idProdutor,
          produtor: curr.produtor,
          peso: 0,
          descontoClassificacao: 0,
          taxaRecepcao: 0,
          cotaCapital: 0,
          taxaArmazenamento: 0,
          quebraTecnica: 0,
          pesoLiquido: 0
        };
        const saidasProdutor = saidas.find((t) => (
          t.idProdutor === curr.idProdutor && t.produtor === curr.produtor
        ))  || {
          idProdutor: curr.idProdutor,
          produtor: curr.produtor,
          peso: 0,
          descontoClassificacao: 0,
          pesoLiquido: 0,
        };
        const saldoFinal = saldoAnteriorProdutor + entradasProdutor.pesoLiquido - saidasProdutor.pesoLiquido;

        acc.push({
          idProdutor: curr.idProdutor,
          produtor: curr.produtor,
          saldoAnterior: saldoAnteriorProdutor,
          entradas: entradasProdutor,
          saidas: saidasProdutor,
          saldoFinal
        });
      }

      return acc;
    }, [] as {
      idProdutor: number;
      produtor: string;
      saldoAnterior: number;
      entradas: {
        peso: number;
        descontoClassificacao: number;
        taxaRecepcao: number;
        cotaCapital: number;
        taxaArmazenamento: number;
        quebraTecnica: number;
        pesoLiquido: number;
      };
      saidas: {
        peso: number;
        descontoClassificacao: number;
        pesoLiquido: number;
      };
      saldoFinal: number;
    }[]);

    const saldoFinal = estoqueGraosProdutor.map((item) => ({
      idProdutor: item.idProdutor,
      produtor: item.produtor,
      saldo: item.saldoFinal,
      saldoSacas: item.saldoFinal / 60
    })).sort((a, b) => b.saldo - a.saldo);

    response.json({ estoqueGraosProdutor, saldoFinal });
  }
}

export default new EstoqueGraosController();
