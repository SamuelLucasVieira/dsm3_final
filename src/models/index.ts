import mongoose, { Schema, Document } from 'mongoose';

// Interface para garantir que o TypeScript conheça a estrutura dos dados
export interface IDespesa extends Document {
    descricao: string;
    valor: number;
    data: Date;
}

// Definindo o schema com as validações
const DespesaSchema = new Schema<IDespesa>({
    descricao: {
        type: String,
        required: [true, "A descrição é obrigatória"],
        maxlength: [100, "A descrição pode ter no máximo 100 caracteres"],
    },
    valor: {
        type: Number,
        required: [true, "O valor é obrigatório"],
        min: [0, "O valor não pode ser negativo"],
    },
    data: {
        type: Date,
        required: [true, "A data é obrigatória"],
        validate: {
            validator: function (value: Date) {
                // Validar se a data não é no futuro
                return value <= new Date();
            },
            message: "A data não pode ser no futuro",
        },
    },
}, { timestamps: true });

// Criar o modelo Despesa com o esquema e exportá-lo
const Despesa = mongoose.model<IDespesa>("Despesa", DespesaSchema);

export default Despesa;
