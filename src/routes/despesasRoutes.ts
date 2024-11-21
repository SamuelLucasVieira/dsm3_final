import express from "express";
import DespesaController from "../controllers/despesasControllers";

const router = express.Router();

router.post("/despesas", DespesaController.criarDespesa); // Criar nova despesa
router.get("/despesas", DespesaController.obterDespesas); // Obter todas as despesas
router.get("/despesas/total", DespesaController.obterTotalDespesas); // Obter o total das despesas
router.put("/despesas/:id", DespesaController.atualizarDespesa); // Atualizar despesa pelo ID
router.delete("/despesas/:id", DespesaController.excluirDespesa); // Excluir despesa pelo ID

export default router;
