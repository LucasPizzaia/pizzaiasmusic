const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');

// Rota para listar todos os generos
router.get('/', generoController.getAllGeneros);

// Rota para exibir o formulário de criação de um novo genero
router.get('/add', generoController.renderAddGeneroForm);

// Rota para criar um novo genero
router.post('/add', generoController.addGenero);

// Rota para exibir um genero específico
router.get('/:id', generoController.getGeneroById);

// Rota para exibir o formulário de edição de um genero específico
router.get('/:id/edit', generoController.renderEditGeneroForm);

// Rota para atualizar um genero
router.post('/:id/edit', generoController.updateGenero);

// Rota para deletar um genero
router.post('/:id', generoController.deleteGenero);

module.exports = router;
