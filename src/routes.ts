import { Router } from 'express';

import ContaPagarController from './app/controllers/ContaPagarController';
import ContaReceberController from './app/controllers/ContaReceberController';
import ChequePagarController from './app/controllers/ChequePagarController';
import ChequeReceberController from './app/controllers/ChequeReceberController';
import SafraController from './app/controllers/SafraController';
import CartaoController from './app/controllers/CartaoController';
import FinanceiroController from './app/controllers/FinanceiroController';
import PlanoContaController from './app/controllers/PlanoContaController';
import MovimentoContaController from './app/controllers/MovimentoContaController';
import FinanceiroViewController from './app/controllers/FinanceiroViewController';
import UsuarioController from './app/controllers/UsuarioController';
import PatrimonioController from './app/controllers/PatrimonioController';
import CombustivelController from './app/controllers/CombustivelController';
import AlmoxarifadoController from './app/controllers/AlmoxarifadoController';
import TipoPatrimonioController from './app/controllers/TipoPatrimonioController';
import AbastecimentoController from './app/controllers/AbastecimentoController';

import updateDatabaseName from './app/middlewares/updateDatabaseName';
import ColheitaController from './app/controllers/ColheitaController';
import TalhaoController from './app/controllers/TalhaoController';
import CustoProducaoController from './app/controllers/CustoProducaoController';
import AtividadeAgricolaController from './app/controllers/AtividadeAgricolaController';
import ManutencaoController from './app/controllers/ManutencaoController';

const router = Router();

router.get('/financeiro/pagar/total', ContaPagarController.total);
router.get('/financeiro/receber/total', ContaReceberController.total);
router.get('/financeiro/cheque/pagar/total', ChequePagarController.total);
router.get('/financeiro/cheque/receber/total', ChequeReceberController.total);
router.get('/financeiro/cartao/total', CartaoController.total);
router.get('/financeiro/fluxo-caixa', FinanceiroController.cashFlow);

router.get('/safras', SafraController.index);
router.get('/talhoes/:idSafra', TalhaoController.index);
router.get('/patrimonios', PatrimonioController.index);
router.get('/combustiveis', CombustivelController.index);
router.get('/almoxarifados', AlmoxarifadoController.index);
router.get('/tipos-patrimonio', TipoPatrimonioController.index);

router.get('/plano-conta', PlanoContaController.index);
router.get('/plano-conta/total/:codigo', PlanoContaController.total);

router.get('/movimento-conta/:codigo', MovimentoContaController.index);

router.get('/financeiro-views', FinanceiroViewController.index);
router.get('/financeiro-views/:id', FinanceiroViewController.find);
router.get('/financeiro-views/:id/detalhes', FinanceiroViewController.findDetail);

router.get('/abastecimento/resumo-mensal', AbastecimentoController.totalMonthly);
router.get('/abastecimento/resumo-combustivel', AbastecimentoController.totalFuel);
router.get('/abastecimento/resumo-patrimonio', AbastecimentoController.totalPatrimony);
router.get('/abastecimento/detalhes', AbastecimentoController.description);
router.get('/abastecimento/custo-producao', AbastecimentoController.totalFuelBySafra);

router.get('/atividade-agricola/custo-producao', AtividadeAgricolaController.totalInputsBySafra);

router.get('/manutencao/custo-producao', ManutencaoController.totalInputsBySafra);

router.get('/colheita/total', ColheitaController.total);
router.get('/colheita/desconto', ColheitaController.descontoTotal);

router.get('/custo-producao/categoria', CustoProducaoController.totalCategory);

router.get('/usuario/:id/permissoes', updateDatabaseName, UsuarioController.permissions);

export default router;
