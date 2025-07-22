const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    task: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    check: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Define o padrão para o registro de data e hora atual
    },
    // Chave estrangeira para vincular tarefas a usuários
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users', // Isso se refere ao nome da tabela (pluralizado por Sequelize por padrão)
            key: 'id',
        }
    }
}, {
    timestamps: true,
});

module.exports = Task;