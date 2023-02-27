import { eachMonthOfInterval, getMonth, getYear, parse } from 'date-fns';
import { Request, Response } from 'express';
import VendaRepository from '../repositories/VendaRepository';

class VendaController {
  async index(request: Request, response: Response) {
    const { idSafra, startDate, endDate, situacao } = request.query as {
      idSafra?: string;
      startDate?: string;
      endDate?: string;
      situacao?: string;
    };

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra é obrigatório' });
    }

    const parsedIdSafra = Number(idSafra);
    const parsedSituacao = situacao ? Number(situacao) : undefined;
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const vendasCliente = await VendaRepository.findAll({
      idSafra: parsedIdSafra,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      situacao: parsedSituacao
    });

    response.json(vendasCliente);
  }

  async romaneio(request: Request, response: Response) {
    const { idSafra, startDate, endDate, situacao } = request.query as {
      idSafra?: string;
      startDate?: string;
      endDate?: string;
      situacao?: string;
    };

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra é obrigatório' });
    }

    const parsedIdSafra = Number(idSafra);
    const parsedSituacao = situacao ? Number(situacao) : undefined;
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const romaneios = await VendaRepository.findRomaneios({
      idSafra: parsedIdSafra,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      situacao: parsedSituacao
    });

    response.json(romaneios);
  }

  async mediaCliente(request: Request, response: Response) {
    const { idSafra, startDate, endDate, situacao } = request.query as {
      idSafra?: string;
      startDate?: string;
      endDate?: string;
      situacao?: string;
    };

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra é obrigatório' });
    }

    const parsedIdSafra = Number(idSafra);
    const parsedSituacao = situacao ? Number(situacao) : undefined;
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const mediaCliente = await VendaRepository.findPrecoMedioCliente({
      idSafra: parsedIdSafra,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      situacao: parsedSituacao
    });

    response.json(mediaCliente);
  }

  async mediaMes(request: Request, response: Response) {
    const { idSafra, startDate, endDate, situacao } = request.query as {
      idSafra?: string;
      startDate?: string;
      endDate?: string;
      situacao?: string;
    };

    if (!idSafra) {
      return response.status(400).json({ message: 'Id safra é obrigatório' });
    }

    const parsedIdSafra = Number(idSafra);
    const parsedSituacao = situacao ? Number(situacao) : undefined;
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const mediaMes = await VendaRepository.findPrecoMedioMes({
      idSafra: parsedIdSafra,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      situacao: parsedSituacao
    });

    if (mediaMes.length === 0 && (!parsedStartDate || !parsedEndDate)) {
      return response.json({ mediaSafraKg: 0, mediaSafraSaca: 0, mediaMes: [] });
    }

    const months = eachMonthOfInterval({
      start: parsedStartDate || new Date(mediaMes[0].ano, mediaMes[0].mes - 1),
      end: parsedEndDate || new Date(mediaMes[mediaMes.length - 1].ano, mediaMes[mediaMes.length - 1].mes - 1),
    });

    const precoMedioMes = months.map((monthDate) => {
      const monthNumber = getMonth(monthDate) + 1;
      const yearNumber = getYear(monthDate);
      const item = mediaMes.find(
        (i) => i.mes === monthNumber && i.ano === yearNumber
      );

      return {
        mes: `${monthNumber < 10 ? `0${monthNumber}` : monthNumber}/${yearNumber}`,
        precoMedioKg: item?.precoMedioKg ? Number(item?.precoMedioKg.toFixed(3)) : 0,
        precoMedioSaca: item?.precoMedioSaca ? Number(item?.precoMedioSaca.toFixed(3)) : 0,
      };
    });

    const mediaSafra = mediaMes.reduce((acc, curr) => ({
      valorTotal: acc.valorTotal + curr.quantidadeTotal,
      quantidadeTotal: acc.quantidadeTotal + curr.quantidadeTotal
    }), { valorTotal: 0, quantidadeTotal: 0 });
    console.log({mediaSafra});
    const mediaSafraKg = mediaSafra.valorTotal / mediaSafra.quantidadeTotal;
    const mediaSafraSaca = (mediaSafra.valorTotal / mediaSafra.quantidadeTotal) * 60;

    response.json({ mediaSafraKg, mediaSafraSaca, mediaMes: precoMedioMes });
  }
}

export default new VendaController();
