import { actionGetUserByCookie } from "@/actions/authActions";
import { DBImageModel } from "@/public/models/image";
import { DBImage } from "@/types/types";
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "fs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { basename, extname, join } from "path";
import sharp from "sharp";


function getAllFilesRecursive(dirPath: string, arrayOfFiles: string[]): string[] {
  const files = readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFilesRecursive(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(join(dirPath, file));
    }
  });

  return arrayOfFiles;
}
function getAllFiles(dirPath: string): string[] {
  return getAllFilesRecursive(dirPath, []);
}


function fromImgPathToFilePath(imagePath: string) {
    return join(
        process.cwd(),
        join(
            "dynamic",
            imagePath
        )
    );
}


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


export async function GET(request: Request): Promise<NextResponse<{
    success: boolean,
    message: string
}>> {
    const isAdmin = await confirmAdmin();
    if (!isAdmin) {
        return NextResponse.json({
            success: false,
            message: "invalid permissions"
        }, { status: 400 });
    }

    const genericFilePath = join(process.cwd(), "dynamic")
    const genericThumbnailPath = join(genericFilePath, "thumbnails");
    const classes = ["projects", "art", "blogs"];
    classes.forEach(async (imageClass: string) => {
        const classDir = join(genericFilePath, imageClass);
        const thumbnailDir = join(genericThumbnailPath, imageClass);
        if (!existsSync(thumbnailDir)) {
            mkdirSync(thumbnailDir, { recursive: true });
        }
        if (!existsSync(classDir)) {
            mkdirSync(classDir, { recursive: true });
        }

        const dbImages = (await DBImageModel.findAll({ where: { class: imageClass }})).map(x => x.dataValues) as unknown as DBImage[];
        const fileImages = getAllFiles(classDir);
        const thumbnailImages = getAllFiles(thumbnailDir);
        const toThumbnail = fileImages.filter(fileImage => {
            const corrThumbnail = join(genericThumbnailPath, fileImage.substring(genericFilePath.length));
            return (extname(fileImage).substring(1).toLocaleLowerCase() != "svg") && !thumbnailImages.includes(corrThumbnail);
        });
        const delThumbnails = thumbnailImages.filter(fileImage => {
            const corrFile = join(genericFilePath, fileImage.substring(genericThumbnailPath.length));
            return (extname(fileImage).substring(1).toLocaleLowerCase() != "svg") && !fileImages.includes(corrFile);
        });

        // console.log("imageClass:", imageClass);
        // console.log("fileImages:", fileImages);
        // console.log("thumbnailImages:", thumbnailImages);
        // console.log("toThumbnail:", toThumbnail);
        // console.log("delThumbnails:", delThumbnails);

        delThumbnails.forEach(filePath => unlinkSync(filePath));

        toThumbnail.forEach(async (filePath: string) => {
            const corrThumbnail = join(genericThumbnailPath, filePath.substring(join(process.cwd(), `/dynamic`).length));
            const image = sharp(filePath);
            const metadata = await image.metadata();
            const scale = Math.min(200 / metadata.height!, 200 / metadata.width!);
            image.resize(
                Math.round(metadata.width! * scale),
                Math.round(metadata.height! * scale)
            ).toFile(corrThumbnail);
        });

        const toDelete = dbImages.filter(dbImage => !fileImages.includes(fromImgPathToFilePath(dbImage.path)));
        const toCreate = fileImages.filter(fileImage => dbImages.filter(dbImage => fromImgPathToFilePath(dbImage.path) == fileImage).length == 0);
        
        // console.log("imageClass:", imageClass);
        // console.log("dbImages:", dbImages);
        // console.log("fileImages:", fileImages);
        // console.log("toDelete:", toDelete);
        // console.log("toCreate:", toCreate);

        toDelete.forEach(async (dbImage: DBImage) => {
            await DBImageModel.destroy({ where: { id: dbImage.id! }});
        });

        toCreate.forEach(async (filePath: string) => {
            const fileSize = statSync(filePath).size;
            const imageType = extname(filePath).substring(1).toLocaleLowerCase();
            
            let imageSize: undefined | { width: number, height: number } = undefined;
            if (imageType != "svg") {
                const image = sharp(filePath);
                const metadata = await image.metadata();
                imageSize = {
                    width: metadata.width!,
                    height: metadata.height!
                };
            }

            const newDBImage = {
                name: basename(filePath),
                class: imageClass,
                path: filePath.substring(join(process.cwd(), "/dynamic").length + 1).replaceAll("\\", "/"),
                type: imageType,
                size: fileSize,
                ...imageSize
            }

            await DBImageModel.create(newDBImage);
        });
    });


    // return success
    return NextResponse.json({
        success: true,
        message: "successfully synced image database to image files"
    });
}

/*
session=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyIiwiZXhwaXJlc0F0IjoiMjAyNS0wNS0yM1QxOTozNzo1NS4yMjJaIiwiaWF0IjoxNzQ3NDI0Mjc1LCJleHAiOjE3NDgwMjkwNzV9.4rF0COJ_whj3LGKJR38eHMw0S4nAkWGqWPZ5FyeAuNQ
*/