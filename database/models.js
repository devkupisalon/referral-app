import { Sequelize, DataTypes, Model } from 'sequelize';
import logger from '../logs/logger.js';
import { constants } from '../config/constants.js';

const {
    POSTGRES_DATABASE,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    DATABASE_DIALECT
} = constants;
const module = import.meta.filename;
const sequelize = new Sequelize(POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, {
    host: POSTGRES_HOST,
    dialect: DATABASE_DIALECT
});

class IP_INFO extends Model { }
IP_INFO.init({
    ip: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    requests_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_blocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    requests: {
        type: DataTypes.JSON
    }
}, { sequelize, modelName: 'ip_info' });

sequelize.sync()
    .then(() => logger.info('Models synced successfully', { module }))
    .catch(err => logger.error(`Error syncing models: ${err}`, { module }));

export { IP_INFO };