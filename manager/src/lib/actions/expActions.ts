import type { ExpType, ExpFormSQL } from "$lib/types/types"
import { fromSQLDate } from "$lib/utils/sqlDate";


export async function GetExps(title: string, startTime: string, endTime: string, strict: boolean = false): Promise<ExpType[]> {
    // get raw SQL rows for each blog
    let res = await fetch('/api/experiences?' + new URLSearchParams({
        title: title,
        strict: (strict ? "true" : "false")
    }).toString(), {
        cache: "no-cache"
    });

    let rows: ExpFormSQL[] = await res.json();
    let exps: ExpType[] = [];

    // simplify and convert each row into an exp object
    for (let i = 0; i < rows.length; ++i) {
        let exp: ExpType = {
            title: rows[i].title,
            link: rows[i].link,
            startTime: fromSQLDate(rows[i].startTime),
            endTime: rows[i].endTime ? fromSQLDate(rows[i].endTime) : "Present",
            bullets: rows[i].bullets == "" ? [] : JSON.parse(rows[i].bullets),
        };

        if (exp.endTime != "Present") exps.push(exp);
        else exps.splice(0, 0, exp);
    }

    return exps;
}


export async function DeleteExp(title: string, startTime: string, endTime: string): Promise<boolean> {
    // make DELETE request
    let res = await fetch('/api/experiences?' + new URLSearchParams({
        title: title,
    }).toString(), {
        method: "DELETE",
        cache: "no-cache"
    });

    // return success or failure
    let rawres = await res.json();
    if (!rawres) {
        console.log(`Error: failed to delete experience \"${title}\".`);
        return false;
    }
    return true;
}


export async function PostExp(exp: ExpFormSQL): Promise<boolean> {
    // delete blog if already exists
    let expCheck = await GetExps(exp.title, exp.startTime, exp.endTime, true);
    if (expCheck.length > 0) {
        console.log("Warning: experience already exists, replacing existing experience.");
        await DeleteExp(exp.title, exp.startTime, exp.endTime);
    }

    // remove annoying characters and add back slash to quotation marks
    exp.bullets = exp.bullets.replace(/\t/g,'');
    exp.bullets = exp.bullets.replace(/\n/g,'');
    // exp.bullets = exp.bullets.replace(/\"/g,'\\\"');

    // make actual POST request
    let res = await fetch("/api/experiences", {
        method: "POST",
        body: JSON.stringify(exp),
        cache: "no-cache"
    });

    // return success or failure
    let rawres = await res.json();
    if (!rawres) {
        console.log(`Error: failed to post exp \"${exp.title}\".`);
        return false;
    }
    return true;
}