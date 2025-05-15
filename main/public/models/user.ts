import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
    process.env.MYSQL_BASE as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASS as string, {
    host: process.env.MYSQL_URL,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
});
await sequelize.authenticate();


export const UserModel = sequelize.define(
    'User',
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        hint: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }
)

await UserModel.sync();