import type { ExpType, ExpFormSQL } from "@/types/types"
import { fromSQLDate } from "@/public/utils/sqlDate";


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