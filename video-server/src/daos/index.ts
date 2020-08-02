import User from '@daos/User';
import Room from '@daos/Room';
import RoomParticipants from '@daos/RoomParticipants';


const initializeTables = () => {
    User.sync();
    Room.sync();
    RoomParticipants.sync();

    RoomParticipants.belongsTo(Room, { foreignKey: 'roomId', targetKey: 'id', as: 'rooms' });
    RoomParticipants.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'users' });
    Room.belongsToMany(User, { through: 'RoomParticipants', as: 'participants', foreignKey: 'roomId' });
    User.belongsToMany(Room, { through: 'RoomParticipants', as: 'rooms', foreignKey: 'userId' });
};

export {
    initializeTables,
    User,
    Room,
    RoomParticipants,
};
