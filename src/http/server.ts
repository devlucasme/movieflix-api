import express from 'express';
import dotenv from 'dotenv';
import MoviesRoutes from '../routes/movies.routes';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use('/movies', MoviesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT} 🚀`);
})