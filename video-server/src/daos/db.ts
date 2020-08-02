import { Sequelize } from 'sequelize';

let db = 'tauria-db';

if (process.env.NODE_ENV === 'production') {
    db = 'tauria-prod-db';
}

const sequelize = new Sequelize(`postgresql://user:password@db:5432/${db}`);

const authenticate = async () => {
    await sequelize.authenticate();
}

authenticate();

export default sequelize;
