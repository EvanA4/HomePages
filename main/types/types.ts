export type BlogType = {
    title: string;
    summary: string;
    content?: string | undefined;
    postdate: Date;
}


export type ExpType = {
    title: string;
    link: string;
    startTime: Date;
    endTime?: Date;
    bullets: string[];
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}


export type ExpRawSQL = {
    title: string;
    link: string;
    startTime: Date;
    endTime: Date;
    bullets: string;
}


export type ProjectFormSQL = {
    title: string;
    completed: Date;
    link: string;
    summary: string;
    flags: string;
}


export type Project = {
    title: string;
    completed: Date;
    link: string;
    summary: string;
    flags: string[];
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}


export type DBImage = {
    name: string;
    class: string;
    path: string;
    type: string;
    size: number;
    width?: number;
    height?: number;
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}


export type FileAPIResult = {
    success: boolean;
    message: string;
    dbImage?: DBImage;
}


export type ArtCollection = {
    name: string;
    count: number;
    displayImgPath: string;
}


export type ArtPiece = {
    name: string;
    imgPath: string;
    postdate: Date;
    content: string;
}