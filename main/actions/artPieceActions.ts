'use server';

import type { ArtCollection, ArtPiece, BlogType } from "@/types/types"
import { Blog } from "@/public/models/blog";
import { ActionResult } from "@/types/actionResult";
import { ArtCollectionModel } from "@/public/models/artRelation";


export async function actionGetPieces(collection: string): Promise<ActionResult<ArtPiece[]>> {
    const coll: ArtCollectionModel = (await ArtCollectionModel.findOne({
        where: {
            name: collection
        },
        // include: [
        //     ArtCollectionModel.associations.artPieces
        // ]
    }))!;

    console.log(coll);
    console.log(await coll.getArtPieces());
    
    return {
        error: false,
        message: "successfully retrieved art pieces",
        data: undefined
    };
}


// export async function actionGetPieceByName(name: string): Promise<ActionResult<ArtPiece>> {
//     let pieces: ArtPiece = (await ArtPieceModel.findOne({ where: { name: name } }))?.dataValues;
//     return {
//         error: false,
//         message: "successfully retrieved art pieces",
//         data: pieces
//     };
// }


export async function actionUpdateBlog(searchTitle: string, newBlog: BlogType): Promise<ActionResult<boolean>> {
    await Blog.update(newBlog, { where: { title: searchTitle } });
    return {
        error: false,
        message: "successfully retrieved blogs",
        data: true
    };
}


export async function actionCreateArtPiece(artPiece: ArtPiece, collection: string): Promise<ActionResult<BlogType>> {
    const coll = (await ArtCollectionModel.findOne({ where: { name: collection } }));
    coll?.createArtPiece(artPiece);
    // coll!.getArtPieces();
    // coll.add
    // const res: BlogType = (await ArtPieceModel.create(piece)).dataValues;
    return {
        error: false,
        message: "successfully retrieved blogs",
        data: undefined
    };
}

export async function actionDeleteBlog(blog: BlogType): Promise<ActionResult<boolean>> {
    await Blog.destroy({ where: { title: blog.title } });
    return {
        error: false,
        message: "successfully retrieved blogs",
        data: true
    };
}