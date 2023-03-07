import {
  EntradasGraosProdutorDomain,
  SaidasGraosProdutorDomain,
  SaldoProdutorDomain
} from '../../types/EstoqueGraos';

interface EstoqueGraosProdutor {
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
}

export function parseEstoqueGraosProdutor(
  entradas: EntradasGraosProdutorDomain[],
  saidas: SaidasGraosProdutorDomain[],
  saldoAnterior: SaldoProdutorDomain[]
) {
  return [...entradas, ...saidas, ...saldoAnterior].reduce((acc, curr) => {
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
  }, [] as EstoqueGraosProdutor[]);
}
