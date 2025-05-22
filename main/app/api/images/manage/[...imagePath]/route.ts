import { actionGetUserByCookie } from "@/actions/authActions";
import { DBImageModel } from "@/public/models/image";
import { DBImage, FileAPIResult } from "@/types/types";
import { Image } from "canvas";
import { existsSync, mkdirSync, readdirSync, rmdirSync, unlinkSync, writeFileSync } from "fs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { basename, dirname, extname, join } from "path";
import sharp from "sharp";


async function confirmAdmin(): Promise<boolean> {
    const session = (await cookies()).get("session")?.value;
    if (!session) {
        return false;
    }
    const res = await actionGetUserByCookie(session);
    if (!res.data) {
        return false;
    }
    return res.data.isAdmin;
}


function confirmNameMatch(extension: string, blobType: string) {
    if (extension == ".svg") {
        return blobType == "image/svg+xml";

    } else if (extension == ".png") {
        return blobType == "image/png";

    } else if (extension == ".jpg" || extension == ".jpeg") {
        return blobType == "image/jpeg";

    }  else if (extension == ".webp") {
        return blobType == "image/webp";

    } else {
        return false;
    }
}


async function apiWriteFile(
    isUpdate: boolean,
    request: Request,
    { params }: { params: { imagePath: string[] } }
): Promise<NextResponse<FileAPIResult>> {
    const isAdmin = await confirmAdmin();
    if (!isAdmin) {
        return NextResponse.json({
            success: false,
            message: "invalid permissions"
        }, { status: 400 });
    }

    const { imagePath } = await params;
    const body = await request.blob();

    const allowedClasses = ["art", "blogs", "projects"];
    if (!allowedClasses.includes(imagePath[0])) {
        return NextResponse.json({
            success: false,
            message: `invalid image class (must be art, blogs, or projects AND NOT THUMBNAIL)`
        }, { status: 400 });
    }

    if (!body.type.includes("image")) {
        return NextResponse.json({
            success: false,
            message: "invalid file type"
        }, { status: 400 });
    }

    const imagePathStr = imagePath.reduce((prev, cur) => `${prev}/${cur}`, "dynamic");
    const filePath = join(process.cwd(), imagePathStr);
    const fileParents = dirname(filePath);

    const allowedBlobTypes = ["image/svg+xml", "image/png", "image/jpeg", "image/webp"];
    const allowedUrlExts = [".svg", ".png", ".jpg", ".jpeg", ".webp"];

    if (!allowedUrlExts.includes(extname(filePath))) {
        return NextResponse.json({
            success: false,
            message: "invalid url file extension"
        }, { status: 400 });
    }

    if (!allowedBlobTypes.includes(body.type)) {
        return NextResponse.json({
            success: false,
            message: "invalid file type"
        }, { status: 400 });
    }

    if (!confirmNameMatch(extname(filePath), body.type)) {
        return NextResponse.json({
            success: false,
            message: "mismatch between url's file extension and actual file type"
        }, { status: 400 });
    }

    if (existsSync(filePath) && !isUpdate) {
        return NextResponse.json({
            success: false,
            message: "file already exists"
        }, { status: 400 });
    } else if (!existsSync(filePath) && isUpdate) {
        return NextResponse.json({
            success: false,
            message: "file does not exist"
        }, { status: 400 });
    }

    await mkdirSync(fileParents, { recursive: true });
    const abuffer = await body.arrayBuffer();
    const buffer = Buffer.from(abuffer);
    writeFileSync(filePath, buffer);


    // create corresponding thumbnail
    const thumbnailPath = join(
        process.cwd(),
        imagePath.reduce((prev, cur) => `${prev}/${cur}`, "dynamic/thumbnails")
    );
    if (existsSync(thumbnailPath)) {
        unlinkSync(thumbnailPath);
    }

    if (!existsSync(dirname(thumbnailPath))) {
        mkdirSync(dirname(thumbnailPath), { recursive: true });
    }
    const sharpImage = sharp(buffer);
    const metadata = await sharpImage.metadata();
    const scale = Math.min(200 / metadata.height!, 200 / metadata.width!);
    sharpImage.resize(
        Math.round(metadata.width! * scale),
        Math.round(metadata.height! * scale)
    ).toFile(thumbnailPath);


    // update image database
    if (!isUpdate) {
        const imageType = extname(filePath).substring(1);
        const imageSize = imageType == "svg" ? undefined : { width: metadata.width!, height: metadata.height };

        const newDBImage = {
            name: basename(filePath),
            class: imagePath[0],
            path: filePath.substring(join(process.cwd(), "/dynamic").length + 1).replaceAll("\\", "/"),
            type: imageType,
            size: body.size,
            ...imageSize
        }

        const res = (await DBImageModel.create(newDBImage)).dataValues as DBImage;

        return NextResponse.json({
            success: true,
            message: "successfully wrote file",
            dbImage: res
        });

    } else {
        const imageType = extname(filePath).substring(1);
        const imageSize = imageType == "svg" ? undefined : { width: metadata.width!, height: metadata.height };

        const newDBImage = {
            size: body.size,
            ...imageSize
        }

        await DBImageModel.update(newDBImage, {
            where: { name: basename(filePath) }
        });
        const res = (await DBImageModel.findOne({ where: { name: basename(filePath) }}))?.dataValues as unknown as DBImage;

        return NextResponse.json({
            success: true,
            message: "successfully updated file",
            dbImage: res
        });
    }
}


export async function POST(
    request: Request,
    { params }: { params: { imagePath: string[] } }
): Promise<NextResponse<FileAPIResult>> {
    return apiWriteFile(false, request, { params });
}


export async function PUT(
    request: Request,
    { params }: { params: { imagePath: string[] } }
): Promise<NextResponse<FileAPIResult>> {
    return apiWriteFile(true, request, { params });
}


export async function DELETE(
    request: Request,
    { params }: { params: { imagePath: string[] } }
): Promise<NextResponse<FileAPIResult>> {
    const isAdmin = await confirmAdmin();
    if (!isAdmin) {
        return NextResponse.json({
            success: false,
            message: "invalid permissions"
        }, { status: 400 });
    }

    const { imagePath } = await params;

    const imagePathStr = imagePath.reduce((prev, cur) => `${prev}/${cur}`, "dynamic");
    const filePath = join(process.cwd(), imagePathStr);

    const allowedClasses = ["art", "blogs", "projects"];
    if (!allowedClasses.includes(imagePath[0])) {
        return NextResponse.json({
            success: false,
            message: `invalid image class (must be art, blogs, or projects AND NOT THUMBNAIL)`
        }, { status: 400 });
    }

    const allowedUrlExts = [".svg", ".png", ".jpg", ".jpeg", ".webp"];
    if (!allowedUrlExts.includes(extname(filePath))) {
        return NextResponse.json({
            success: false,
            message: "invalid url file extension"
        }, { status: 400 });
    }

    if (!existsSync(filePath)) {
        return NextResponse.json({
            success: false,
            message: "file doesnt exist"
        }, { status: 400 });
    }

    // remove original file
    unlinkSync(filePath);
    let parentDir = dirname(filePath);
    while (readdirSync(parentDir).length == 0) {
        rmdirSync(parentDir);
        parentDir = dirname(parentDir);
    }

    // remove corresponding thumbnail
    const thumbnailPath = join(
        process.cwd(),
        imagePath.reduce((prev, cur) => `${prev}/${cur}`, "dynamic/thumbnails")
    );
    unlinkSync(thumbnailPath);
    parentDir = dirname(thumbnailPath);
    while (readdirSync(parentDir).length == 0) {
        rmdirSync(parentDir);
        parentDir = dirname(parentDir);
    }

    // remove from image database
    const res = (await DBImageModel.findOne({ where: { name: basename(filePath) }}))?.dataValues as unknown as DBImage;
    await DBImageModel.destroy({ where: { id: res.id! }});

    return NextResponse.json({
        success: true,
        message: "successfully deleted file",
        dbImage: res
    });
}