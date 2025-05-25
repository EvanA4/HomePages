'use server'

import type { ExpType, ExpRawSQL } from "@/types/types"
import { ActionResult } from "@/types/actionResult";
import { Experience } from "@/public/models/experience";


export async function actionGetExps(): Promise<ActionResult<ExpType[]>> {
    let rows: ExpRawSQL[] = (await Experience.findAll({
        order: [
            ['startTime', 'DESC'],
        ],
    })).map(x => x.dataValues);
    let exps: ExpType[] = rows.map(
        rawExp => ({
            ...rawExp,
            bullets: JSON.parse(rawExp.bullets) as string[]
        })
    );

    return {
        error: false,
        message: "successfully retrieved experiences",
        data: exps
    };
}


export async function actionCreateExp(exp: ExpType): Promise<ActionResult<ExpType>> {
    const rawSQL = (await Experience.create({
        ...exp,
        bullets: JSON.stringify(exp.bullets)
    }))?.dataValues as unknown as ExpRawSQL;
    const res = {
        ...rawSQL,
        bullets: JSON.parse(rawSQL.bullets)
    };

    return {
        error: false,
        message: "successfully created experience",
        data: res
    };
}


export async function actionDeleteExp(exp: ExpType): Promise<ActionResult<ExpType>> {
    const rawSQL = (await Experience.findOne({ where: { title: exp.title } }))?.dataValues as unknown as ExpRawSQL;
    if (!rawSQL) {
        return {
            error: false,
            message: "experience already exists"
        };
    }
    
    await Experience.destroy({ where: { title: exp.title }});
    const res = {
        ...rawSQL,
        bullets: JSON.parse(rawSQL.bullets)
    };

    return {
        error: false,
        message: "successfully created experience",
        data: res
    };
}


export async function actionUpdateExp(searchTitle: string, exp: ExpType): Promise<ActionResult<boolean>> {
    await Experience.update({
        ...exp,
        bullets: JSON.stringify(exp.bullets)
    }, { where: { title: searchTitle } });

    return {
        error: false,
        message: "successfully updated experience",
        data: true
    };
}