import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgresql://user:password@db:5432/tauria-db');

const authenticate = async () => {
    await sequelize.authenticate();
}

authenticate();

export default sequelize;
