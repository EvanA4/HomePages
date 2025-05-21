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


export const DBImageModel = sequelize.define(
    'DBImage',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        class: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        width: {
            type: DataTypes.INTEGER,
        },

        height: {
            type: DataTypes.INTEGER,
        },
    }
)

await DBImageModel.sync();