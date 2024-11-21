import Despesa from '../models/index';

class DespesasService {
    // Criar nova despesa
    async criarDespesa(descricao: string, valor: number, data: Date) {
        try {
            if (!descricao || !valor || !data) {
                throw new Error("Todos os campos (descricao, valor, data) são obrigatórios");
            }
            const novaDespesa = new Despesa({ descricao, valor, data });
            return await novaDespesa.save();
        } catch (error) {
            console.error("Erro ao criar despesa:", error);
            throw new Error("Erro ao salvar a despesa");
        }
    }

    // Obter todas as despesas
    async obterTodasDespesas() {
        try {
            return await Despesa.find();
        } catch (error) {
            console.error("Erro ao obter despesas:", error);
            throw new Error("Erro ao recuperar as despesas");
        }
    }

    // Calcular o total das despesas
    async calcularTotalDespesas() {
        try {
            const resultado = await Despesa.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$valor" }
                    }
                }
            ]);

            return resultado.length > 0 ? resultado[0].total : 0;
        } catch (error) {
            console.error("Erro ao calcular total das despesas:", error);
            throw new Error("Erro ao calcular o total das despesas");
        }
    }

    // Atualizar despesa
    async atualizarDespesa(id: string, descricao: string, valor: number, data: Date) {
        try {
            if (!descricao || !valor || !data) {
                throw new Error("Todos os campos (descricao, valor, data) são obrigatórios");
            }
            return await Despesa.findByIdAndUpdate(id, { descricao, valor, data }, { new: true });
        } catch (error) {
            console.error("Erro ao atualizar despesa:", error);
            throw new Error("Erro ao atualizar a despesa");
        }
    }

    // Excluir despesa
    async excluirDespesa(id: string) {
        try {
            return await Despesa.findByIdAndDelete(id);
        } catch (error) {
            console.error("Erro ao excluir despesa:", error);
            throw new Error("Erro ao excluir a despesa");
        }
    }
}

export default new DespesasService();
