const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garante que os nomes de usuários sejam únicos
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Adiciona os campos `createdAt` e `updatedAt` automaticamente
    hooks: {
        // Hash de senha antes de criar um novo usuário
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
        // Re-hash da senha se ela for atualizada
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});

// Método de instância para validar senha
User.prototype.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;