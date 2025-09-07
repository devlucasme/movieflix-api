import express from 'express';
import dotenv from 'dotenv';
import MoviesRoutes from '../routes/movies.routes';
import SwaggerUiOptions from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors())
app.use(express.json());
app.use('/docs', SwaggerUiOptions.serve, SwaggerUiOptions.setup(swaggerDocument));

app.use('/movies', MoviesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT} 🚀`);
})