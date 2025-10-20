import express from 'express';
import cors from 'cors';
import apiV1Routes from './routes/api_audiodb_v1/APIConnectionV1';
import UserRoutes from './routes/UserRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api_audiodb', apiV1Routes);
app.use('/api', UserRoutes);

app.get('/', (req, res) => {
  res.send('API Vinylla backend rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
