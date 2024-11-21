import mongoose from "mongoose";

// A URI indica o IP, a porta e BD a ser conectado
const uri = "mongodb://127.0.0.1:27017/despesas_banco";

export default function connect() {
    // Configura manipuladores de eventos para diferentes estados de conexão
    // cada mensagem de log indica um estado específico da conexão.
    mongoose.connection.on("connected", () => console.log("Conectado ao MongoDB"));
    mongoose.connection.on("open", () => console.log("Conexão aberta com o MongoDB"));
    mongoose.connection.on("disconnected", () => console.log("Desconectado do MongoDB"));
    mongoose.connection.on("reconnected", () => console.log("Reconectado ao MongoDB"));
    mongoose.connection.on("disconnecting", () => console.log("Desconectando do MongoDB"));
    mongoose.connection.on("close", () => console.log("Conexão com o MongoDB encerrada"));

    // Estabelece a conexão com o MongoDB
    mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        })
        .then(() => console.log("Conectado ao MongoDB"))
        .catch((e) => {
            console.error("Erro ao conectar ao MongoDB:", e.message);
        });

    // Fechar a conexão quando o processo for encerrado (SIGINT)
    process.on("SIGINT", async () => {
        try {
            console.log("Conexão com o MongoDB fechada");
            await mongoose.connection.close();
            process.exit(0);
        } catch (error) {
            console.error("Erro ao fechar a conexão com o MongoDB:", error);
            process.exit(1);
        }
    });
}
