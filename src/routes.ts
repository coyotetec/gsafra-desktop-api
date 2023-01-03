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

const router = Router();

router.get('/financeiro/pagar/total', ContaPagarController.total);
router.get('/financeiro/receber/total', ContaReceberController.total);

router.get('/financeiro/cheque/pagar/total', ChequePagarController.total);
router.get('/financeiro/cheque/receber/total', ChequeReceberController.total);

router.get('/financeiro/cartao/total', CartaoController.total);

router.get('/financeiro/fluxo-caixa', FinanceiroController.cashFlow);

router.get('/safras', SafraController.index);

router.get('/plano-conta', PlanoContaController.index);
router.get('/plano-conta/total/:codigo', PlanoContaController.total);

router.get('/movimento-conta/:codigo', MovimentoContaController.index);

router.get('/financeiro-views', FinanceiroViewController.index);
router.get('/financeiro-views/:id', FinanceiroViewController.find);
router.get('/financeiro-views/:id/detalhes', FinanceiroViewController.findDetail);

router.get('/usuario/:id/permissoes', UsuarioController.permissions);

export default router;
