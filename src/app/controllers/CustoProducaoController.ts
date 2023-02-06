import { parse } from 'date-fns';
import { Request, Response } from 'express';
import CustoProducaoRepository from '../repositories/CustoProducaoRepository';

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

    const parsedIdSafra = Number(idSafra);
    const parsedIdTalhao = idTalhao ? Number(idTalhao) : undefined;                                                                             
    const parsedStartDate = startDate ? parse(startDate, 'dd-MM-yyyy', new Date()) : undefined;
    const parsedEndDate = endDate ? parse(endDate, 'dd-MM-yyyy', new Date()) : undefined;

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return response.status(400).json({ message: 'Data final precisa ser depois da inicial' });
    }

    const totalCustoCategoria = await CustoProducaoRepository.findCustoCategoria({
      idSafra: parsedIdSafra,
      idTalhao: parsedIdTalhao,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    });
    const totalCusto = totalCustoCategoria.reduce((acc, curr) => acc + curr.total, 0);

    response.json({ totalCusto, totalCustoCategoria });                                                    
  }
}                                   

export default new CustoProducaoController();