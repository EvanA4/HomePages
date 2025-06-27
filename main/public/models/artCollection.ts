import {
    Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional,
    HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin,
    HasManySetAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin,
    HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, NonAttribute,
    Association
} from 'sequelize';
import { ArtPieceModel } from './artPiece';

const sequelize = new Sequelize(
    process.env.MYSQL_BASE as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASS as string, {
    host: process.env.MYSQL_URL,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
});
await sequelize.authenticate();

// https://sequelize.org/docs/v6/other-topics/typescript/
export class ArtCollectionModel extends Model<InferAttributes<ArtCollectionModel, { omit: 'artPieces' }>, InferCreationAttributes<ArtCollectionModel, { omit: 'artPieces' }>> {
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare name: string;
    declare count: number;
    declare displayImgPath: string;

    declare getArtPieces: HasManyGetAssociationsMixin<ArtPieceModel>;
    declare addArtPiece: HasManyAddAssociationMixin<ArtPieceModel, number>;
    declare addArtPieces: HasManyAddAssociationsMixin<ArtPieceModel, number>;
    declare setArtPieces: HasManySetAssociationsMixin<ArtPieceModel, number>;
    declare removeArtPiece: HasManyRemoveAssociationMixin<ArtPieceModel, number>;
    declare removeArtPieces: HasManyRemoveAssociationsMixin<ArtPieceModel, number>;
    declare hasArtPiece: HasManyHasAssociationMixin<ArtPieceModel, number>;
    declare hasArtPieces: HasManyHasAssociationsMixin<ArtPieceModel, number>;
    declare countArtPieces: HasManyCountAssociationsMixin;
    declare createArtPiece: HasManyCreateAssociationMixin<ArtPieceModel, 'collId'>;

    declare artPieces?: NonAttribute<ArtPieceModel[]>;

    declare static associations: {
        artPieces: Association<ArtCollectionModel, ArtPieceModel>;
    };
}

ArtCollectionModel.init(
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
    count: {
        type: new DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    displayImgPath: {
        type: new DataTypes.STRING,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'artCollections'
  }
);

// ArtCollectionModel.hasMany(ArtPieceModel, {
//   sourceKey: 'id',
//   foreignKey: 'collId',
//   as: 'artPieces'
// });

// await ArtCollectionModel.sync({ force: true });