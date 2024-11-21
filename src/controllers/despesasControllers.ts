import { Request, Response } from 'express';
import Despesa from '../models/index';  // Supondo que você tenha um modelo 'Despesa' para interagir com o banco

class DespesaController {
    // Criar uma nova despesa
    static async criarDespesa(req: Request, res: Response) {
        try {
            const { descricao, valor, data } = req.body;

            // Verifica se todos os campos obrigatórios estão presentes
            if (!descricao || !valor || !data) {
                return res.status(400).json({ message: 'Descrição, valor e data são obrigatórios' });
            }

            // Validação simples para o formato da data (ex: YYYY-MM-DD)
            const dataValida = Date.parse(data);
            if (isNaN(dataValida)) {
                return res.status(400).json({ message: 'Data inválida. O formato correto é YYYY-MM-DD' });
            }

            // Cria a nova despesa
            const novaDespesa = new Despesa({ descricao, valor, data });
            await novaDespesa.save();

            return res.status(201).json(novaDespesa);
        } catch (error: any) {
            console.error('Erro ao criar despesa:', error.message);
            return res.status(500).json({
                message: 'Erro ao criar despesa',
                error: error.message || 'Erro desconhecido',
            });
        }
    }

    // Obter todas as despesas
    static async obterDespesas(req: Request, res: Response) {
        try {
            const despesas = await Despesa.find(); // Busca todas as despesas no banco
            return res.status(200).json(despesas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao obter despesas' });
        }
    }

    // Obter o total das despesas
    static async obterTotalDespesas(req: Request, res: Response) {
        try {
            const total = await Despesa.aggregate([
                { $group: { _id: null, total: { $sum: "$valor" } } },
            ]);
            return res.status(200).json({ total: total[0]?.total || 0 });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao obter total das despesas' });
        }
    }

    // Atualizar uma despesa
    static async atualizarDespesa(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { descricao, valor, data } = req.body;

            const despesaAtualizada = await Despesa.findByIdAndUpdate(
                id,
                { descricao, valor, data },
                { new: true } // Retorna o documento atualizado
            );

            if (!despesaAtualizada) {
                return res.status(404).json({ message: 'Despesa não encontrada' });
            }

            return res.status(200).json(despesaAtualizada);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar despesa' });
        }
    }

    // Excluir uma despesa
    static async excluirDespesa(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const despesaExcluida = await Despesa.findByIdAndDelete(id);

            if (!despesaExcluida) {
                return res.status(404).json({ message: 'Despesa não encontrada' });
            }

            return res.status(200).json({ message: 'Despesa excluída com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao excluir despesa' });
        }
    }
}

export default DespesaController;
