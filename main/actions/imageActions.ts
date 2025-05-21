'use server';
import { DBImageModel } from "@/public/models/image";
import { ActionResult } from "@/types/actionResult";
import { DBImage } from "@/types/types";


export async function actionGetDBImages(imageClass: string): Promise<ActionResult<DBImage[]>> {
    const images = (await DBImageModel.findAll({ where: { class: imageClass } })).map(x => x.dataValues);
    return {
        error: false,
        message: "successfully retrieved images",
        data: images,
    }
}