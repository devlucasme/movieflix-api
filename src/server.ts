import express from 'express';

const port = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send('Página Home');
})

app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
})