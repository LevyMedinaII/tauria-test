import User from '@daos/User';
import Room from '@daos/Room';

const initializeTables = () => {
    User.sync();
    Room.sync();
};

export {
    initializeTables,
    User,
    Room,
};
