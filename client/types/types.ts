import type { RowDataPacket } from "mysql2";

export interface BlogRow extends RowDataPacket {
    id: number;
    title: string;
    summary: string;
    content: string;
    postdate: string;
}


export interface Blog {
    title: string;
    summary: string;
    content: string;
    postdate: string;
}


export interface ExpRow extends RowDataPacket {
    id: number;
    title: string;
    link: string;
    timeperiod: string;
    bullets: string;
}


export interface Exp {
    title: string;
    link: string;
    timeperiod: string;
    bullets: string[];
}


export interface NewExp {
    title: string;
    link: string;
    timeperiod: string;
    bullets: string;
}

// -- CREATE TABLE Projects (
// --     id INT PRIMARY KEY AUTO_INCREMENT,
// --     title VARCHAR(255) NOT NULL UNIQUE,
// --     link VARCHAR(255),
// --     bullets TEXT(511) NOT NULL,
// --     flags VARCHAR(255)
// -- );

export interface ProjectRow extends RowDataPacket {
    id: number;
    title: string;
    link: string;
    bullets: string;
    flags: string;
}


export interface Project {
    title: string;
    link: string;
    summary: string;
    flags: string[];
}


export interface NewProject {
    title: string;
    link: string;
    summary: string;
    flags: string;
}