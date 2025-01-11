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


export const Blog = sequelize.define(
    'Blog',
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        summary: {
            type: DataTypes.STRING(511),
            allowNull: false,
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        postdate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }
)

await Blog.sync();