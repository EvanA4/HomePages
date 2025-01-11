import { Sequelize, DataTypes } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();


const sequelize = new Sequelize(
    process.env.MYSQL_BASE as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASS as string, {
    host: process.env.MYSQL_URL,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
});
await sequelize.authenticate();


export const Experience = sequelize.define(
    'Experience',
    {
        title: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        link: {
            type: DataTypes.STRING,
        },

        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        endTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        bullets: {
            type: DataTypes.STRING(511),
            allowNull: false,
        },
    }
)

await Experience.sync();