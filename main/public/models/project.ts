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


export const Project = sequelize.define(
    'Project',
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        completed: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        summary: {
            type: DataTypes.STRING(511),
            allowNull: false,
        },

        flags: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
)

await Project.sync();