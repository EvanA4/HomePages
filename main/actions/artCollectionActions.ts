'use server';

import { ArtCollectionModel } from "@/public/models/artCollection";
import { ActionResult } from "@/types/actionResult";
import { ArtCollection } from "@/types/types";

export async function actionGetArtCollections(): Promise<ActionResult<ArtCollection[]>> {
    const res = (await ArtCollectionModel.findAll()).map(x => x.dataValues);
    return {
        error: false,
        message: "successfully retrieved art collections",
        data: res
    }
}

export async function actionCreateCollection(collection: ArtCollection): Promise<ActionResult<ArtCollection>> {
    const res = (await ArtCollectionModel.create(collection)).dataValues;
    return {
        error: false,
        message: "successfully retrieved art collections",
        data: res
    }
}

export async function actionUpdateCollection(searchName: string, collection: ArtCollection): Promise<ActionResult<boolean>> {
    await ArtCollectionModel.update(collection, { where: { name: searchName } });
    return {
        error: false,
        message: "successfully retrieved art collections",
        data: true
    }
}

export async function actionDeleteCollection(collection: ArtCollection): Promise<ActionResult<boolean>> {
    await ArtCollectionModel.destroy({ where: { name: collection.name } });
    return {
        error: false,
        message: "successfully retrieved art collections",
        data: true
    }
}