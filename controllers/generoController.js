const { Genero } = require('../models');

// Listar todos os generos
const getAllGeneros = async (req, res) => {
    try {
        const generos = await Genero.findAll({
            order: [['nome', 'ASC']] // Ordena em ordem alfabetica
        });
        res.render('generos', { generos });
    } catch (error) {
        res.status(500).send('Erro ao listar generos');
    }
};

// Exibir um genero específico
const getGeneroById = async (req, res) => {
    try {
        const genero = await Genero.findByPk(req.params.id);
        if (genero) {
            res.render('generos/show', { genero });
        } else {
            res.status(404).send('Genero não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao exibir genero');
    }
};

// Exibir formulário para adicionar novo genero
const renderAddGeneroForm = (req, res) => {
    res.render('generosAdd');
};

// Adicionar um novo genero
const addGenero = async (req, res) => {
    try {
        const { nome } = req.body;
        await Genero.create({ nome });
        res.redirect('/generos');
    } catch (error) {
        res.status(500).send('Erro ao adicionar genero');
    }
};

// Exibir formulário para edição de genero
const renderEditGeneroForm = async (req, res) => {
    try {
        const genero = await Genero.findByPk(req.params.id);
        if (genero) {
            res.render('generosEdit', { genero });
        } else {
            res.status(404).send('Genero não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de edição');
    }
};

// Rota para atualizar um gênero
const updateGenero = async (req, res) => {
    const method = req.body._method;

    if (method === 'PUT') {
        try {
            const generoId = req.params.id;
            const novoNome = req.body.nome;

            // Verificar se o gênero existe
            const genero = await Genero.findByPk(generoId);

            if (!genero) {
                return res.status(404).send('Gênero não encontrado');
            }

            // Atualizar o nome do gênero
            genero.nome = novoNome;
            await genero.save();

            // Redirecionar após atualização
            return res.redirect('/generos');
        } catch (error) {
            console.error('Erro ao atualizar gênero:', error);
            return res.status(500).send('Erro ao atualizar o gênero');
        }
    }

    // Método não permitido
    return res.status(405).send('Método não permitido');
};

// Rota para deletar um gênero
const deleteGenero = async (req, res) => {
    const method = req.body._method;

    if (method === 'DELETE') {
        try {
            const generoId = req.params.id;

            // Verificar se o gênero existe
            const genero = await Genero.findByPk(generoId);

            if (!genero) {
                return res.status(404).send('Gênero não encontrado');
            }

            // Excluir o gênero
            await genero.destroy();

            // Redirecionar após exclusão
            return res.redirect('/generos');
        } catch (error) {
            console.error('Erro ao excluir gênero:', error);
            return res.status(500).send('Erro ao excluir o gênero');
        }
    }

    // Método não permitido
    return res.status(405).send('Método não permitido');
};


module.exports = {
    getAllGeneros,
    getGeneroById,
    renderAddGeneroForm,
    addGenero,
    renderEditGeneroForm,
    updateGenero,
    deleteGenero
};
