const { Disco, Faixa, Artista, Genero, FaixaGenero, sequelize } = require('../models');
const path = require('path');

// Listar todos os discos
const getAllDiscos = async (req, res) => {
  try {
      const discos = await Disco.findAll({
          include: [
              {
                  model: Artista,
                  as: 'artista', // Use o alias correto definido na associação
                  attributes: ['id', 'nome'] // Apenas os campos necessários
              }
          ],

          order: [['titulo', 'ASC']] // Ordena por titulo
      });

      res.render('discos', { discos });
  } catch (error) {
      console.error(error);  // Adiciona o log para depuração
      res.status(500).send('Erro ao listar discos');
  }
};

// Disco específico
const getDiscoById = async (req, res) => {
    const { id } = req.params; // Obtém o ID do disco da rota
    try {
      // Busca o disco pelo ID e inclui as faixas associadas, utilizando o alias 'faixas'
      const disco = await Disco.findByPk(id, {
        include: [
          {
            model: Faixa, // Inclui o modelo Faixa
            as: 'faixas',  // Alias para incluir as faixas
            attributes: ['titulo'], // Busca apenas o campo 'titulo' de cada faixa
          },
        ],
      });
  
      if (!disco) {
        return res.status(404).send('Disco não encontrado');
      }
  
      // Renderiza a view passando o disco e suas faixas
      res.render('disco', { disco });
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar o disco');
    }
  };

// Exibir formulário para adicionar novo disco
const renderAddDiscoForm = async (req, res) => {
  try {
      const generos = await Genero.findAll({
        order: [['nome', 'ASC']] // Ordena em ordem alfabetica
      }); // Busca todos os gêneros cadastrados
      res.render('discosAdd', { generos }); // Passa os gêneros para a view
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao carregar o formulário de adição');
    }
};

// Adicionar um novo disco
const addDisco = async (req, res) => {
  const { titulo, ano_lancamento } = req.body;
  const faixas = req.body.faixas || [];
  const faixaGeneros = req.body.faixaGeneros || []; // Aqui, temos um array com os gêneros de cada faixa

  // Substitui separadores de caminho do Windows por '/' e remove 'public/' se necessário
  const capa = req.file ? req.file.path.replace(/\\/g, '/').replace('public/', '') : null;

  try {
    // Criar o disco primeiro, incluindo o ano de lançamento
    const disco = await Disco.create({ 
      titulo, 
      ano_lancamento,
      capa 
    });

    // Criar as faixas associadas ao disco
    const faixasToCreate = faixas.map(faixaTitulo => ({
      titulo: faixaTitulo,
      discoId: disco.id,
    }));

    // Adicionar as faixas
    const faixasCriadas = await Faixa.bulkCreate(faixasToCreate);

    // Associar os gêneros para cada faixa individualmente
    for (let i = 0; i < faixasCriadas.length; i++) {
      const faixa = faixasCriadas[i];
      const generoId = faixaGeneros[i]; // Pega o gênero selecionado para cada faixa

      if (generoId) {
        // Criar a associação na tabela FaixaGenero
        await FaixaGenero.create({
          faixaId: faixa.id,
          generoId: generoId,
        });
      }
    }

    // Redirecionar para a página de discos
    res.redirect('/discos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao adicionar disco e faixas');
  }
};

// Exibir formulário para edição de disco
const renderEditDiscoForm = async (req, res) => {
    try {
        const disco = await Disco.findByPk(req.params.id);
        const faixas = await Faixa.findAll();
        if (disco) {
            res.render('discosEdit', { disco, faixas });
        } else {
            res.status(404).send('Disco não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de edição');
    }
};

// Atualizar dados do disco
const updateNomeAnoDisco = async (req, res) => {
  const method = req.body._method;

  if (method === 'PUT') {
      try {
          const discoId = req.params.id;

          // Verificar se o disco existe
          const disco = await Disco.findByPk(discoId);

          if (!disco) {
              return res.status(404).send('Disco não encontrado');
          }

          // Atualizar apenas título e ano de lançamento
          const { titulo, ano_lancamento } = req.body;

          await disco.update({
              titulo: titulo || disco.titulo,
              ano_lancamento: ano_lancamento || disco.ano_lancamento
          });

          // Redirecionar após a atualização
          return res.redirect(`/discos/${discoId}/edit`);
      } catch (error) {
          console.error('Erro ao atualizar disco:', error);
          return res.status(500).send('Erro ao atualizar o disco');
      }
  }

  // Método não permitido
  return res.status(405).send('Método não permitido');
};

// Atualizar capa do disco
const updateCapa = async (req, res) => {
  const method = req.body._method;

  if (method === 'PUT') {
      try {
          const discoId = req.params.id;

          // Verificar se o disco existe
          const disco = await Disco.findByPk(discoId);

          if (!disco) {
              return res.status(404).send('Disco não encontrado');
          }

          // Se houver um arquivo de nova capa, substituímos
          if (req.file) {
              // Apagar a capa anterior
              const caminhoAntigo = disco.capa;
              if (caminhoAntigo) {
                  const caminhoArquivoAntigo = path.join(__dirname, '..', 'public', caminhoAntigo);
                  if (fs.existsSync(caminhoArquivoAntigo)) {
                      fs.unlinkSync(caminhoArquivoAntigo); // Apaga a capa antiga
                  }
              }

              // Atualiza a capa com a nova
              const capa = req.file ? req.file.path.replace(/\\/g, '/').replace('public/', '') : null;

              // Atualiza o campo capa no banco
              await disco.update({ capa });
          }

          // Redirecionar após atualização
          return res.redirect(`/discos/${discoId}/edit`);

      } catch (error) {
          console.error('Erro ao atualizar a capa do disco:', error);
          return res.status(500).send('Erro ao atualizar a capa');
      }
  }

  // Método não permitido
  return res.status(405).send('Método não permitido');
};

const fs = require('fs'); // Importar o módulo File System

// Rota para deletar um disco
const deleteDisco = async (req, res) => {
    const method = req.body._method;

    if (method === 'DELETE') {
        try {
            const discoId = req.params.id;

            // Verificar se o disco existe
            const disco = await Disco.findByPk(discoId);

            if (!disco) {
                return res.status(404).send('Disco não encontrado');
            }

            // Excluir as faixas associadas ao disco
            await Faixa.destroy({
                where: { discoId }
            });

            // Excluir a imagem da capa, se existir
            if (disco.capa) {
                fs.unlink(`public/${disco.capa}`, (err) => {
                    if (err) {
                        console.error(`Erro ao excluir a capa do disco: ${err}`);
                    }
                });
            }

            // Excluir o disco
            await disco.destroy();

            // Redirecionar após exclusão
            return res.redirect('/discos');
        } catch (error) {
            console.error('Erro ao excluir disco:', error);
            return res.status(500).send('Erro ao excluir o disco');
        }
    }

    // Método não permitido
    return res.status(405).send('Método não permitido');
};

module.exports = {
    getAllDiscos,
    getDiscoById,
    renderAddDiscoForm,
    addDisco,
    renderEditDiscoForm,
    updateNomeAnoDisco,
    updateCapa,
    deleteDisco
};
