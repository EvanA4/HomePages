import { StaticImageData } from "next/image";

export type BlogType = {
    title: string;
    summary: string;
    content: string;
    postdate: string;
}


export type ExpType = {
    title: string;
    link: string;
    startTime: string;
    endTime: string;
    bullets: string[];
}


export type ExpFormSQL = {
    title: string;
    link: string;
    startTime: string;
    endTime: string;
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