const Task = require('../model/Task'); // Usando o modelo de tarefa Sequelize

const getAllTasks = async (req, res) => {
    try {
        // Buscar tarefas apenas para o usuário logado
        const tasksList = await Task.findAll({ where: { userId: req.session.userId } });
        return res.status(200).json({ tasks: tasksList });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: 'Erro ao buscar tarefas', error: error.message });
    }
};

const createTask = async (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({ message: 'O conteúdo da tarefa é obrigatório.' });
    }

    try {
        // Crie uma tarefa e associe-a ao usuário logado
        const newTask = await Task.create({ task, userId: req.session.userId });
        return res.status(201).json({ message: 'Tarefa criada com sucesso.', task: newTask });
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        return res.status(500).json({ message: 'Erro ao criar tarefa', error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params; // Precisamos apenas do ID para recuperar
        const task = await Task.findOne({ where: { id, userId: req.session.userId } });

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou você não tem permissão para acessá-la.' });
        }
        return res.status(200).json({ task });
    } catch (error) {
        console.error("Erro ao obter tarefa por ID:", error);
        return res.status(500).json({ message: 'Erro ao recuperar tarefa', error: error.message });
    }
};

const updateOneTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { task, check } = req.body; // Permitir atualização do conteúdo da tarefa e verificação do status

        // Garanta que pelo menos um campo seja fornecido para atualização
        if (!task && check === undefined) {
            return res.status(400).json({ message: 'Nenhum campo fornecido para atualização.' });
        }

        const updateData = {};
        if (task !== undefined) updateData.task = task;
        if (check !== undefined) updateData.check = check;

        // Certifique-se de que a tarefa pertence ao usuário conectado antes de atualizar
        const [updatedRows] = await Task.update(updateData, {
            where: { id, userId: req.session.userId }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou você não tem permissão para atualizá-la.' });
        }
        return res.status(200).json({ message: 'Tarefa atualizada com sucesso.' });
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: 'Erro ao atualizar tarefa', error: error.message });
    }
};

const deleteOneTask = async (req, res) => {
    try {
        const { id } = req.params;
        // Certifique-se de que a tarefa pertence ao usuário conectado antes de excluí-la
        const deletedRows = await Task.destroy({ where: { id, userId: req.session.userId } });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou você não tem permissão para excluí-la.' });
        }
        return res.status(200).json({ message: 'Tarefa excluída com sucesso.' });
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
        return res.status(500).json({ message: 'Erro ao excluir tarefa', error: error.message });
    }
};

const taskCheck = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ where: { id, userId: req.session.userId } });

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou você não tem permissão para atualizá-la.' });
        }

        task.check = !task.check; // Alternar o status do cheque
        await task.save(); // Salvar a tarefa atualizada

        return res.status(200).json({ message: 'Status da tarefa atualizado.', task });
    } catch (error) {
        console.error("Tarefa de verificação de erros:", error);
        return res.status(500).json({ message: 'Erro ao atualizar o status da tarefa', error: error.message });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    getById,
    updateOneTask,
    deleteOneTask,
    taskCheck
};