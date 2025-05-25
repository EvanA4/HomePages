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

// {
//   dialect: 'mysql',
//   database: process.env.MYSQL_BASE,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASS,
//   host: process.env.MYSQL_URL,
//   port: 3306,
// }



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

        postdate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }
)

await Blog.sync();