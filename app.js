const express = require('express');
const path = require('path');
const app = express();
const { sequelize } = require('./models');
const methodOverride = require('method-override');

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear dados do corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para sobrescrever métodos HTTP
app.use(methodOverride('_method'));

// Configuração das rotas
const homeRoutes = require('./routes/homeRoutes');
const artistaRoutes = require('./routes/artistaRoutes');
const discoRoutes = require('./routes/discoRoutes');
const faixaRoutes = require('./routes/faixaRoutes');
const generoRoutes = require('./routes/generoRoutes');
const vincularArtistaRoutes = require('./routes/vincularArtistaRoutes')

// Definindo as rotas principais
app.use('/', homeRoutes);
app.use('/artistas', artistaRoutes);
app.use('/discos', discoRoutes);
app.use('/faixas', faixaRoutes);
app.use('/generos', generoRoutes);
app.use('/vincular-artista', vincularArtistaRoutes)

// Serve os arquivos estáticos do frontend (caso haja)
app.use(express.static(path.join(__dirname, 'public')));
// Servindo imagens como arquivos estáticos
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configuração de erros 404
app.use((req, res, next) => {
  res.status(404).send('Página não encontrada!');
});

// Inicialização do banco de dados e o servidor
sequelize.sync({ force: false }).then(() => {
  console.log('Banco de dados conectado!');
  app.listen(PORT = 3000, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
  });
});
