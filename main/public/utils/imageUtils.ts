import { actionGetDBImages } from "@/actions/imageActions";
import { Result } from "@/types/result";
import { DBImage, FileAPIResult } from "@/types/types";


export async function getImages(imageClass: string): Promise<Result<DBImage[]>> {
    const res = await actionGetDBImages(imageClass);

    if (!res.error) {
        return new Result<DBImage[]>(res.data, res.message);
    } else {
        return new Result<DBImage[]>(undefined, res.message);
    }
}


export function prettySize(size: number): string {
    if (size < 1000) {
        return `${size.toString()} B`;

    } else if (size < 1_000_000) {
        return `${(size / 1000).toFixed(2)} KB`;

    } else if (size < 1_000_000_000) {
        return `${(size / 1_000_000).toFixed(2)} MB`;

    } else {
        return `${(size / 1_000_000_000).toFixed(2)} GB`;
    }
}


export async function writeImage(file: File, imageClass: string): Promise<DBImage | undefined> {
    if (!file.name.includes(".")) {
        return undefined;
    }
    const imageType = file.name.split(".")[1].toLowerCase();
    let contentType = undefined;
    if (imageType == "jpg" || imageType == "jpeg") {
        contentType = "image/jpeg";
    } else if (imageType == "png") {
        contentType = "image/png";
    } else if (imageType == "svg") {
        contentType = "image/svg+xml";
    } else if (imageType == "webp") {
        contentType = "image/webp";
    } else {
        return undefined;
    }

    const res = await fetch(`/api/images/manage/${imageClass}/${file.name}`, {
        method: "POST",
        body: file
    });
    const data = await res.json() as { success: boolean, message: string, dbImage: DBImage };
    // console.log(data);

    return data.dbImage;
}


export async function syncImages(): Promise<{
    success: boolean,
    message: string
}> {
    const res = await fetch("/api/images/manage/sync");
    const data = await res.json() as {
        success: boolean,
        message: string
    };

    return data;
}


export async function deleteImage(path: string): Promise<Result<boolean>> {
    const res = await fetch(`/api/images/manage/${path}`, {
        method: "DELETE"
    });
    const data = (await res.json()) as FileAPIResult;

    if (data.dbImage) {
        return new Result(true, data.message);
    } else {
        return new Result(false, data.message);
    }
}