import type { ProjectRow, Project, NewProject } from "$lib/types/types";


export async function GetProjs(title: string, strict: boolean = false): Promise<Project[]> {
    // get raw SQL rows for each blog
    let res = await fetch('/api/projects?' + new URLSearchParams({
        title: title,
        strict: (strict ? "true" : "false")
    }).toString(), {
        cache: "no-cache"
    });
    let rows: ProjectRow[] = await res.json();
    let projs: Project[] = [];

    // simplify and convert each row into an exp object
    for (let i = 0; i < rows.length; ++i) {
        let flagsArr: string[] = JSON.parse(rows[i].flags);
        
        let proj: Project = {
            title: rows[i].title,
            link: rows[i].link,
            summary: rows[i].summary,
            flags: flagsArr,
        };

        projs.push(proj);
    }

    return projs;
}


export async function DeleteProj(title: string): Promise<boolean> {
    // make DELETE request
    let res = await fetch('/api/projects?' + new URLSearchParams({
        title: title
    }).toString(), {
        method: "DELETE",
        cache: "no-cache"
    });

    // return success or failure
    let rawres = await res.json();
    if (!rawres) {
        console.log(`Error: failed to delete project \"${title}\".`);
        return false;
    }
    return true;
}


export async function PostProj(proj: NewProject): Promise<boolean> {
    // delete blog if already exists
    let projCheck = await GetProjs(proj.title, true);
    if (projCheck.length > 0) {
        console.log("Warning: project already exists, replacing existing project.");
        await DeleteProj(proj.title);
    }

    // remove annoying characters and add back slash to quotation marks
    proj.flags = proj.flags.replace(/\t/g,'');
    proj.flags = proj.flags.replace(/\n/g,'');
    proj.flags = proj.flags.replace(/\"/g,'\\\"');

    // make actual POST requestproj
    let res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(proj),
        cache: "no-cache"
    });

    // return success or failure
    let rawres = await res.json();
    if (!rawres) {
        console.log(`Error: failed to post project \"${proj.title}\".`);
        return false;
    }
    return true;
}