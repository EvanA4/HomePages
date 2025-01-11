import type { ProjectType, ProjectFormSQL } from "@/types/types";
import { fromSQLDate } from "@/public/utils/sqlDate";


export async function GetProjs(title: string, strict: boolean = false): Promise<ProjectType[]> {
    // get raw SQL rows for each blog
    let res = await fetch('/api/projects?' + new URLSearchParams({
        title: title,
        strict: (strict ? "true" : "false")
    }).toString(), {
        cache: "no-cache"
    });
    let rows: ProjectFormSQL[] = await res.json();
    let projs: ProjectType[] = [];

    // simplify and convert each row into an exp object
    for (let i = 0; i < rows.length; ++i) {
        let proj: ProjectType = {
            title: rows[i].title,
            completed: fromSQLDate(rows[i].completed),
            link: rows[i].link,
            summary: rows[i].summary,
            flags: rows[i].flags ? JSON.parse(rows[i].flags) : [],
        };

        projs.push(proj);
    }

    return projs;
}