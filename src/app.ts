import express, { Request, Response } from 'express';
import despesasRoutes from './routes/despesasRoutes'; // Certifique-se de que suas rotas estão corretas
import conectarAoBancoDeDados from './models/connection'; // Função para conectar ao banco de dados
import Despesa from './models/index'; // Modelo Despesa
import path from 'path';

const app = express();

// Middleware para tratar requisições com corpo JSON
app.use(express.json());

// Configuração para servir arquivos estáticos, se necessário (como index.html)
app.use(express.static(path.join(__dirname, 'views'))); // Serve arquivos da pasta 'views'

// Rota para servir o arquivo index.html quando a URL raiz for acessada
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rotas da API para despesas
app.use('/api', despesasRoutes); // As rotas para '/api/despesas' serão tratadas aqui

// Função para iniciar o servidor e conectar ao banco de dados
const iniciarServidor = async () => {
  try {
    // Aguarde a conexão com o banco de dados
    await conectarAoBancoDeDados();
    // Inicia o servidor após a conexão com o banco de dados
    app.listen(3000, () => {
      console.log('Servidor rodando em http://localhost:3000');
    });
  } catch (erro) {
    console.error('Erro ao iniciar o servidor:', erro);
  }
};

// Chama a função para iniciar o servidor
iniciarServidor();
