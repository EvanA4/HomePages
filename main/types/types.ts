export interface BlogType {
    title: string;
    summary: string;
    content: string;
    postdate: string;
}


export interface ExpType {
    title: string;
    link: string;
    startTime: string;
    endTime: string;
    bullets: string[];
}


export interface ExpFormSQL {
    title: string;
    link: string;
    startTime: string;
    endTime: string;
    bullets: string;
}


export interface ProjectFormSQL {
    title: string;
    completed: string;
    link: string;
    summary: string;
    flags: string;
}


export interface ProjectType {
    title: string;
    completed: string;
    link: string;
    summary: string;
    flags: string[];
}