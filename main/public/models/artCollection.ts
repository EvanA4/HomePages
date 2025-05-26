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


export const ArtCollectionModel = sequelize.define(
    'ArtCollection',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        displayImgPath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
)

await ArtCollectionModel.sync();