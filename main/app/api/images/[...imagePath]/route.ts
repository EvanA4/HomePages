import { existsSync, readFileSync } from "fs";
import { NextResponse } from "next/server";
import { join } from "path";

export async function GET(
    request: Request,
    { params }: { params: { imagePath: string[] } }
) {
    const { imagePath } = await params;

    const imagePathStr = imagePath.reduce((prev, cur) => `${prev}/${cur}`, "dynamic");
    const filePath = join(process.cwd(), imagePathStr);
    const fileName = imagePath[imagePath.length - 1];

    if (!existsSync(filePath)) {
        return NextResponse.json({
            success: false,
            message: "file does not exist"
        }, { status: 400 });
    }

    const nsbuffer = readFileSync(filePath);
    const blob = new Blob([nsbuffer]);

    return new NextResponse(blob, {
        headers: {
            'Content-Type': blob.type, 
            'Content-Disposition': `attachment; filename="${fileName}"`,
        },
    });
}