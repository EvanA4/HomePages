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