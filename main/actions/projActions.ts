'use server';

import { ProjectModel } from "@/public/models/project";
import { ActionResult } from "@/types/actionResult";
import type { Project, ProjectFormSQL } from "@/types/types";


export async function actionGetProjects(): Promise<ActionResult<Project[]>> {
    // get raw SQL rows for each blog
    let rows: ProjectFormSQL[] = (await ProjectModel.findAll({
        order: [
            ['completed', 'DESC'],
        ],
    })).map(el => el.dataValues);
    
    // simplify and convert each row into an exp object
    let projs: Project[] = rows.map(row => ({
        title: row.title,
        completed: row.completed,
        link: row.link,
        summary: row.summary,
        flags: row.flags ? JSON.parse(row.flags) : [],
    }));

    return {
        error: false,
        message: "successfully retrieved projects",
        data: projs,
    };
}


export async function actionCreateProject(project: Project): Promise<ActionResult<Project>> {
    try {
        const result = (await ProjectModel.create({...project, flags: JSON.stringify(project.flags)})).dataValues as unknown as Project;
        return {
            error: false,
            message: "successfully added project",
            data: result,
        }

    } catch {
        return {
            error: true,
            message: "error adding project",
        }
    }
}


export async function actionDeleteProject(project: Project): Promise<ActionResult<boolean>> {
    try {
        await ProjectModel.destroy({ where: { title: project.title } });
        return {
            error: false,
            message: "successfully deleted project",
            data: true,
        }

    } catch {
        return {
            error: true,
            message: "error deleting project",
        }
    }
}


export async function actionUpdateProject(searchTitle: string, project: Project): Promise<ActionResult<boolean>> {
    try {
        await ProjectModel.update({
            ...project,
            flags: JSON.stringify(project.flags)
        }, { where: { title: searchTitle } });

        return {
            error: false,
            message: "successfully updated project",
            data: true,
        }

    } catch {
        return {
            error: true,
            message: "error updating project",
        }
    }
}