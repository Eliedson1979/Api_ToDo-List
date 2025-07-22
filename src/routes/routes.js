const routes = require('express').Router();
const TaskController = require('../controller/TaskController');
const AuthController = require('../controller/AuthController');

// --- Rotas de Autenticação Pública ---
// POST /register - Registrar um novo usuário
routes.post('/register', AuthController.registerUser);
// POST /login - Efetue login de um usuário
routes.post('/login', AuthController.loginUser);
// GET /logout - Sair de um usuário
routes.get('/logout', AuthController.logoutUser);

// --- Rotas de Gerenciamento de Tarefas Protegidas ---
// Todas as rotas abaixo desta linha usarão o middleware isAuthenticated
routes.use(AuthController.isAuthenticated);

// GET /tasks - Obter todas as tarefas para o usuário logado
routes.get('/tasks', TaskController.getAllTasks);
// POST /tasks - Cria uma nova tarefa para o usuário logado
routes.post('/tasks', TaskController.createTask);
// GET /tasks/:id - Obtém uma tarefa específica pelo ID do usuário logado
routes.get('/tasks/:id', TaskController.getById); // Removed :method as it's not needed for RESTful single GET
// PUT /tasks/:id - Atualiza uma tarefa específica para o usuário logado
routes.put('/tasks/:id', TaskController.updateOneTask); // Changed to PUT for updating entire resource
// PATCH /tasks/:id/check - Alternar status de conclusão da tarefa
routes.patch('/tasks/:id/check', TaskController.taskCheck); // Dedicated endpoint for status toggle
// DELETE /tasks/:id - Exclui uma tarefa específica para o usuário logado
routes.delete('/tasks/:id', TaskController.deleteOneTask); // Changed to DELETE

module.exports = routes;