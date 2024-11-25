const multer = require('multer');
const path = require('path');

// Configuração do armazenamento
const storage = multer.diskStorage({
  // Define a pasta onde os arquivos serão armazenados
  destination: (req, file, cb) => {
    cb(null, 'public/images/artistasEDiscos/');  // Diretório onde as fotos serão salvas
  },
  
  // Define o nome do arquivo armazenado
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Extrai a extensão do arquivo (ex: .png, .jpg)
    const filename = Date.now() + ext;  // Cria um nome único com base na data e hora atual
    cb(null, filename);  // Salva o arquivo com o novo nome
  }
});

// Configuração do middleware de upload
const upload = multer({
  storage: storage,  // Usa o armazenamento definido acima

  // Define limites e filtros para os arquivos
  limits: {
    fileSize: 5 * 1024 * 1024  // Limita o tamanho do arquivo para 5MB
  },

  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;  // Define os formatos de imagem permitidos
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Verifica a extensão do arquivo
    const mimetype = fileTypes.test(file.mimetype);  // Verifica o tipo MIME do arquivo

    if (extname && mimetype) {
      return cb(null, true);  // Permite o upload se as condições forem atendidas
    } else {
      // Rejeita o arquivo e retorna um erro personalizado
      cb(new Error('Formato de arquivo inválido. Apenas imagens JPEG, PNG ou GIF são permitidas.'));
    }
  }
});

module.exports = upload;  // Exporta o middleware para ser usado em outras partes do projeto
