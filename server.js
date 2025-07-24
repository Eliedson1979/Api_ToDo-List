const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { connectToDb, sequelize } = require('./src/database/db'); // Importar sequelize
const User = require('./src/model/User'); // Importe o modelo do usuário para garantir que ele seja carregado para sequelize.sync()
const Task = require('./src/model/Task'); // Importe o modelo de tarefa para garantir que ele seja carregado para sequelize.sync()
const routes = require('./src/routes/routes');

const app = express();
const port = process.env.PORT || 3001;

// Middleware para analisar corpos JSON (para solicitações de API)
app.use(express.json());
app.use(cors());
// Middleware para analisar corpos codificados em URL (para dados de formulário, se usados)
app.use(express.urlencoded({ extended: true }));

// Configuração do middleware de sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'uma_chave_muito_secreta_que_deveria_ser_aleatória', // IMPORTANTE: Use uma chave forte e aleatória na produção por meio de variáveis de ambiente
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // A sessão dura 24 horas
        httpOnly: true, // Impede que o JS do lado do cliente acesse o cookie
        secure: process.env.NODE_ENV === 'production' // Definido como verdadeiro na produção para HTTPS
    }
}));

// Configurar associações entre modelos
// Um usuário tem muitas tarefas
User.hasMany(Task, { foreignKey: 'userId' });
// Uma tarefa pertence a um usuário
Task.belongsTo(User, { foreignKey: 'userId' });

// Use suas rotas definidas
app.use('/', routes);

// Inicialize o aplicativo: conecte ao banco de dados e sincronize os modelos
const initializeApp = async () => {
    await connectToDb(); // Conectar ao Neon DB

    // Sincronize modelos com o banco de dados.
    // Em produção, considere usar migrações de banco de dados (por exemplo, com `sequelize-cli` ou `umzug`)
    // em vez de `sequelize.sync({ force: true })` ou `sequelize.sync()`.
   // `force: true` removerá tabelas e as recriará (perda de dados!).
   // Para a configuração inicial, `force: true` pode ser conveniente, mas remova-o para execuções subsequentes.
    await sequelize.sync({ force: false }); // Defina como `true` inicialmente para criar tabelas, depois como `false`
    console.log('Banco de dados sincronizado (tabelas criadas/atualizadas).');

    app.listen(port, () => {
        console.log(`Servidor em execução na porta ${port}`);
    });
};

initializeApp();