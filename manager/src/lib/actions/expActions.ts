import type { ExpRow, Exp, NewExp } from "$lib/types/types"


export async function GetExps(title: string, timeperiod: string, strict: boolean = false): Promise<Exp[]> {
    // get raw SQL rows for each blog
    let res = await fetch('/api/experiences?' + new URLSearchParams({
        title: title,
        timeperiod: timeperiod,
        strict: (strict ? "true" : "false")
    }).toString(), {
        cache: "no-cache"
    });
    let rows: ExpRow[] = await res.json();
    let exps: Exp[] = [];

    // simplify and convert each row into an exp object
    for (let i = 0; i < rows.length; ++i) {
        let bulletsArr: string[] = JSON.parse(rows[i].bullets);
        
        let exp: Exp = {
            title: rows[i].title,
            link: rows[i].link,
            timeperiod: rows[i].timeperiod,
            bullets: bulletsArr,
        };

        exps.push(exp);
    }

    return exps;
}


export async function DeleteExp(title: string, timeperiod: string): Promise<boolean> {
    // make DELETE request
    let res = await fetch('/api/experiences?' + new URLSearchParams({
        title: title,
        timeperiod: timeperiod
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


export async function PostExp(exp: NewExp): Promise<boolean> {
    // delete blog if already exists
    let expCheck = await GetExps(exp.title, exp.timeperiod, true);
    if (expCheck.length > 0) {
        console.log("Warning: experience already exists, replacing existing experience.");
        await DeleteExp(exp.title, exp.timeperiod);
    }

    // remove annoying characters and add back slash to quotation marks
    exp.bullets = exp.bullets.replace(/\t/g,'');
    exp.bullets = exp.bullets.replace(/\n/g,'');
    exp.bullets = exp.bullets.replace(/\"/g,'\\\"');

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