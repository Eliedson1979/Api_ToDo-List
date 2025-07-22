const { Sequelize } = require('sequelize');

// IMPORTANTE: Substitua pela sua string de conexão do Neon.
// É altamente recomendável usar uma variável de ambiente (por exemplo, process.env.NEON_DB_URL).
const neonConnectionString = process.env.NEON_DB_URL || "postgresql://neondb_owner:npg_gW6x3dabMFrw@ep-dry-band-ackstshb-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sequelize = new Sequelize(neonConnectionString, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Use isto com cuidado se encontrar problemas com SSL. Em produção, garanta a validação adequada do certificado.
        }
    },
    logging: false // Defina como verdadeiro para ver as consultas SQL no console para depuração
});

const connectToDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco de dados Neon PostgreSQL com sucesso.');
    } catch (error) {
        console.error('Não é possível conectar ao banco de dados Neon PostgreSQL:', error);
        process.exit(1); // Sair se a conexão com o banco de dados falhar
    }
};

module.exports = { sequelize, connectToDb };