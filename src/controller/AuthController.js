const User = require('../model/User');

// Middleware para proteger rotas que requerem autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next(); // O usuário é autenticado, prossiga para o próximo middleware/manipulador de rota
    }
    // Se não for autenticado, envie uma resposta JSON ou redirecione (conforme as necessidades do seu frontend)
    return res.status(401).json({ message: 'Não autorizado: Por favor, faça login.' });
    // Ou se você quiser um redirecionamento, seria:
   // return res.redirect('/login');
};

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
    }

    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: 'O nome de usuário já existe. Escolha outro.' });
        }

        await User.create({ username, password });
        return res.status(201).json({ message: 'Cadastro realizado com sucesso! Agora você pode fazer login.' });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return res.status(500).json({ message: 'Ocorreu um erro durante o registro.', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
    }

    try {
        const user = await User.findOne({ where: { username } });

        if (!user || !(await user.isValidPassword(password))) {
            return res.status(401).json({ message: 'Nome de usuário ou senha inválidos.' });
        }

        req.session.userId = user.id; // Armazena o ID do usuário na sessão
        return res.status(200).json({ message: 'Login bem-sucedido!', userId: user.id });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: 'Ocorreu um erro durante o login.', error: error.message });
    }
};

const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Erro ao destruir sessão:", err);
            return res.status(500).json({ message: 'Falha ao sair.' });
        }
        res.clearCookie('connect.sid'); // Limpar o cookie da sessão
        return res.status(200).json({ message: 'Logged out successfully.' });
    });
};

module.exports = {
    isAuthenticated,
    registerUser,
    loginUser,
    logoutUser,
};