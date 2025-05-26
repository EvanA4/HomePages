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


export const ArtPieceModel = sequelize.define(
    'ArtPiece',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        imgPath: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        postdate: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }
)

await ArtPieceModel.sync({ force: true });