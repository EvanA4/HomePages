import { actionCreateProject, actionDeleteProject, actionGetProjects, actionUpdateProject } from "@/actions/projActions";
import { Result } from "@/types/result";
import { Project } from "@/types/types";

export async function getProjects(): Promise<Result<Project[]>> {
    const res = await actionGetProjects();

    if (!res.error) {
        return new Result<Project[]>(res.data, res.message);
    } else {
        return new Result<Project[]>(undefined, res.message);
    }
}

export async function createProject(project: Project): Promise<Result<Project>> {
    const res = await actionCreateProject(project);

    if (res.data) {
        return new Result<Project>(res.data, res.message);
    } else {
        return new Result<Project>(undefined, res.message);
    }
}

export async function deleteProject(project: Project): Promise<Result<boolean>> {
    const res = await actionDeleteProject(project);

    if (res.data) {
        return new Result<boolean>(res.data, res.message);
    } else {
        return new Result<boolean>(undefined, res.message);
    }
}

export async function updateProject(searchTitle: string, project: Project): Promise<Result<boolean>> {
    const res = await actionUpdateProject(searchTitle, project);

    if (res.data) {
        return new Result<boolean>(res.data, res.message);
    } else {
        return new Result<boolean>(undefined, res.message);
    }
}