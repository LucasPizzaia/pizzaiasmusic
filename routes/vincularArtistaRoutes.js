const express = require('express');
const router = express.Router();
const { Disco, Artista } = require('../models');

// Exibir o formulário de vinculação de artista
router.get('/:discoId', async (req, res) => {
  try {
    const disco = await Disco.findByPk(req.params.discoId);
    if (!disco) {
      return res.status(404).send('Disco não encontrado');
    }

    const artistas = await Artista.findAll();  // Buscando todos os artistas
    res.render('vincularArtista', { disco, artistas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar o formulário');
  }
});

// Rota para salvar a vinculação do artista com o disco (POST)
router.post('/:discoId', async (req, res) => {
  try {
    const { artistaId } = req.body; // Recebendo o ID do artista

    if (!artistaId) {
      return res.status(400).send('Artista não selecionado');
    }

    // Verifique se o artista existe na tabela correta
    const artista = await Artista.findByPk(artistaId); // Use Artista (singular) aqui
    if (!artista) {
      return res.status(404).send('Artista não encontrado');
    }

    const disco = await Disco.findByPk(req.params.discoId);
    if (!disco) {
      return res.status(404).send('Disco não encontrado');
    }

    // Atualizando o disco com o artista
    const updatedDisco = await Disco.update({ artistaId }, { where: { id: req.params.discoId } });

    if (updatedDisco[0] === 0) {
      return res.status(500).send('Falha ao atualizar disco');
    }

    // Redirecionando para a lista de discos após o sucesso
    res.redirect('/discos');
  } catch (error) {
    console.error('Erro ao vincular artista:', error);
    res.status(500).send('Erro ao vincular artista');
  }
});


module.exports = router;
