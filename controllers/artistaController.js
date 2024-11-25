const { Artista, Disco, Genero, ArtistaGenero, sequelize } = require('../models');
const path = require('path');

// Listar todos os artistas
const getAllArtistas = async (req, res) => {
    try {
        const artistas = await Artista.findAll({
            order: [['nome', 'ASC']] // Ordena por nome
        });
        res.render('artistas', { artistas });
    } catch (error) {
        res.status(500).send('Erro ao listar artistas');
    }
};

// Mostrar um artista específico e seus discos e gêneros
const getArtistaById = async (req, res) => {
    try {
        const { id } = req.params;
        const artista = await Artista.findByPk(id, {
            include: [
                {
                    model: Disco,
                    as: 'discos',
                    attributes: ['id', 'titulo']
                },
                {
                    model: Genero,
                    as: 'generos',  // Certifique-se de que o alias aqui é o mesmo definido na associação
                    attributes: ['id', 'nome']
                }
            ]
        });

        if (!artista) {
            return res.status(404).send('Artista não encontrado');
        }

        res.render('artista', { artista });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar artista');
    }
};

// Exibir formulário para adicionar um novo artista
const renderAddArtistaForm = async (req, res) => {
    try {
      const generos = await Genero.findAll(); // Busca todos os gêneros cadastrados
      res.render('artistasAdd', { generos }); // Passa os gêneros para a view
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao carregar o formulário de adição');
    }
  };

// Adicionar um novo artista
const addArtista = async (req, res) => {
    const transaction = await sequelize.transaction(); // Inicia uma transação para garantir consistência
    try {
      const { nome, nacionalidade, generos } = req.body;
  
      // Substitui separadores de caminho do Windows por '/' e remove 'public/' se necessário
      const foto = req.file
        ? req.file.path.replace(/\\/g, '/').replace('public/', '')
        : null;
  
      // Cria o artista
      const novoArtista = await Artista.create(
        { nome, nacionalidade, foto },
        { transaction }
      );
  
      // Verifica se há gêneros e cria os vínculos na tabela ArtistaGenero
      if (generos && generos.length > 0) {
        const generosArray = Array.isArray(generos) ? generos : [generos]; // Garante que generos é um array
        const artistaGeneros = generosArray.map((generoId) => ({
          artistaId: novoArtista.id,
          generoId,
        }));
        await ArtistaGenero.bulkCreate(artistaGeneros, { transaction });
      }
  
      await transaction.commit(); // Confirma a transação
      res.redirect('/artistas'); // Redireciona após adicionar o artista
    } catch (error) {
      await transaction.rollback(); // Reverte a transação em caso de erro
      console.error(error); // Loga o erro no console para depuração
      res.status(500).send('Erro ao adicionar artista');
    }
  };
  

// Exibir formulário para edição de artista
const renderEditArtistaForm = async (req, res) => {
    try {
        const artista = await Artista.findByPk(req.params.id);
        if (artista) {
            res.render('artistasEdit', { artista });
        } else {
            res.status(404).send('Artista não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de edição');
    }
};

// Atualizar dados do artista
const updateDadosArtista = async (req, res) => {
    const method = req.body._method;

    if (method === 'PUT') {
        try {
            const artistaId = req.params.id;

            // Verificar se o artista existe
            const artista = await Artista.findByPk(artistaId);

            if (!artista) {
                return res.status(404).send('Artista não encontrado');
            }

            // Atualizar apenas nome e nacionalidade
            const { nome, nacionalidade } = req.body;

            await artista.update({
                nome: nome || artista.nome,
                nacionalidade: nacionalidade || artista.nacionalidade
            });

            // Redirecionar após a atualização
            return res.redirect(`/artistas/${artistaId}/edit`);
        } catch (error) {
            console.error('Erro ao atualizar artista:', error);
            return res.status(500).send('Erro ao atualizar o artista');
        }
    }

    // Método não permitido
    return res.status(405).send('Método não permitido');
};

// Atualizar foto do artista
const updateFotoArtista = async (req, res) => {
    const method = req.body._method;

    if (method === 'PUT') {
        try {
            const artistaId = req.params.id;

            // Verificar se o artista existe
            const artista = await Artista.findByPk(artistaId);

            if (!artista) {
                return res.status(404).send('Artista não encontrado');
            }

            // Se houver um arquivo de nova foto, substituímos
            if (req.file) {
                // Apagar a foto anterior
                const caminhoAntigo = artista.foto;
                if (caminhoAntigo) {
                    const caminhoArquivoAntigo = path.join(__dirname, '..', 'public', caminhoAntigo);
                    if (fs.existsSync(caminhoArquivoAntigo)) {
                        fs.unlinkSync(caminhoArquivoAntigo); // Apaga a foto antiga
                    }
                }

                // Atualiza a foto com a nova
                const foto = req.file ? req.file.path.replace(/\\/g, '/').replace('public/', '') : null;

                // Atualiza o campo foto no banco
                await artista.update({ foto });
            }

            // Redirecionar após atualização
            return res.redirect(`/artistas/${artistaId}/edit`);

        } catch (error) {
            console.error('Erro ao atualizar a foto do artista:', error);
            return res.status(500).send('Erro ao atualizar a foto');
        }
    }

    // Método não permitido
    return res.status(405).send('Método não permitido');
};

const fs = require('fs'); // Importar o módulo File System

// Rota para deletar um artista
const deleteArtista = async (req, res) => {
    try {
        const artistaId = req.params.id;

        // Verificar se o artista existe
        const artista = await Artista.findByPk(artistaId);

        if (!artista) {
            return res.status(404).send('Artista não encontrado');
        }

        // Excluir a imagem da capa do artista, se existir
        if (artista.capa) {
            fs.unlink(`public/${artista.capa}`, (err) => {
                if (err) {
                    console.error(`Erro ao excluir a capa do artista: ${err}`);
                }
            });
        }

        // Excluir o artista
        await artista.destroy();

        // Redirecionar após exclusão
        return res.redirect('/artistas');
    } catch (error) {
        console.error('Erro ao excluir artista:', error);
        return res.status(500).send('Erro ao excluir o artista');
    }
};

module.exports = {
    getAllArtistas,
    getArtistaById,
    renderAddArtistaForm,
    addArtista,
    renderEditArtistaForm,
    updateDadosArtista,
    updateFotoArtista,
    deleteArtista
};
