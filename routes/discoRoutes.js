const express = require('express');
const router = express.Router();
const discoController = require('../controllers/discoController');
const upload = require('../middlewares/upload');

// Rota para listar todos os discos
router.get('/', discoController.getAllDiscos);

// Rota para exibir o formulário de criação de um novo disco
router.get('/add', discoController.renderAddDiscoForm);

// Rota para criar um novo disco
router.post('/add', upload.single('capa'), discoController.addDisco);

// Rota para exibir um disco específico
router.get('/:id', discoController.getDiscoById);

// Rota para exibir o formulário de edição de um disco específico
router.get('/:id/edit', discoController.renderEditDiscoForm);

// Rota pra atualizar nome e ano do disco
router.post('/:id/edit/dados', discoController.updateNomeAnoDisco)

// Rota para atualizar a capa do disco
router.post('/:id/edit/capa', upload.single('capa'), discoController.updateCapa);

// Rota para deletar um disco
router.post('/:id', discoController.deleteDisco);

module.exports = router;
