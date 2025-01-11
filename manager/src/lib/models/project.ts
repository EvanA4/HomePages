import { Sequelize, DataTypes } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';
import dotenv from "dotenv";
dotenv.config();


const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: process.env.MYSQL_BASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  host: process.env.MYSQL_URL,
  port: 3306,
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