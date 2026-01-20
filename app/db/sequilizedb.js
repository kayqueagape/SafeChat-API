import { Sequelize } from 'sequelize';


const sequilize =new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        looging: false,
    }
);



async function connectToDatabase() {
    try {
        await sequilize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectToDatabase();

export default sequilize;