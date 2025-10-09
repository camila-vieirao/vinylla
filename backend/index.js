const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas v1
const apiV1Routes = require('./routes/api_audiodb_v1/APIConnectionV1');
app.use('/api_audiodb', apiV1Routes); // v1 endpoints (com /v1/ na rota)

// Rota de teste
app.get('/', (req, res) => {    
	res.send('API Vinylla backend rodando!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
