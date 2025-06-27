import { ArtCollectionModel } from "./artCollection";
import { ArtPieceModel } from "./artPiece";

ArtCollectionModel.hasMany(ArtPieceModel, {
  sourceKey: 'id',
  foreignKey: 'collId',
  as: 'artPieces'
});
await ArtCollectionModel.sync();

ArtPieceModel.belongsTo(ArtCollectionModel, {
    foreignKey: 'collId'
})
await ArtPieceModel.sync();

export { ArtCollectionModel, ArtPieceModel }