import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import relatoriosRoutes from './routes/relatorio';
import imageRoutes from './routes/image';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/images', imageRoutes);

// Sincronizar com o banco de dados e iniciar o servidor
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
});
