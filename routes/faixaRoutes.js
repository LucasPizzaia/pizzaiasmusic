const express = require('express');
const router = express.Router();
const faixaController = require('../controllers/faixaController');

// Rota para listar todos os faixas
router.get('/', faixaController.getAllFaixas);

// Rota para criar um novo faixa
router.post('/', faixaController.addFaixa);

// Rota pra mostrar uma faixa especifica
router.get('/:id', faixaController.getFaixaById);

// Rota para exibir o formulário de edição de uma faixa específica
router.get('/:id/edit', faixaController.renderEditFaixaForm);

// Rota para atualizar um faixa
router.post('/:id/edit', faixaController.updateFaixa);

// Rota para deletar um faixa
router.post('/:id', faixaController.deleteFaixa);

module.exports = router;
