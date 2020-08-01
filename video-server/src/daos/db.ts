import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgresql://user:password@db:5432/tauria-db');

const authenticate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

authenticate();
  
export default sequelize;
