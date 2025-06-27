import {
    Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes,
    CreationOptional, ForeignKey
} from 'sequelize';
import { ArtCollectionModel } from './artCollection';

const sequelize = new Sequelize(
    process.env.MYSQL_BASE as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASS as string, {
    host: process.env.MYSQL_URL,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
});
await sequelize.authenticate();

export class ArtPieceModel extends Model<InferAttributes<ArtPieceModel>, InferCreationAttributes<ArtPieceModel>> {
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare name: string;
    declare imgPath: string;
    declare postdate: Date;
    declare content: string;

    declare collId: ForeignKey<ArtCollectionModel['id']>;
}

ArtPieceModel.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        imgPath: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        postdate: {
            type: new DataTypes.DATE,
            allowNull: false
        },
        content: {
            type: new DataTypes.TEXT,
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: 'artPiece'
    }
);

ArtPieceModel.belongsTo(ArtCollectionModel, {
    foreignKey: 'collId'
})

await ArtPieceModel.sync({ force: true });