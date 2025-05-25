import { actionCreateExp, actionDeleteExp, actionGetExps, actionUpdateExp } from "@/actions/expActions";
import { Result } from "@/types/result";
import { ExpType } from "@/types/types";

export async function getExps(): Promise<Result<ExpType[]>> {
    const res = await actionGetExps();
    if (!res.error && res.data) {
        return new Result<ExpType[]>(res.data, res.message);
    } else {
        return new Result<ExpType[]>(undefined, res.message);
    }
}

export async function createExp(exp: ExpType): Promise<Result<ExpType>> {
    const res = await actionCreateExp(exp);
    if (!res.error && res.data) {
        return new Result<ExpType>(res.data, res.message);
    } else {
        return new Result<ExpType>(undefined, res.message);
    }
}

export async function deleteExp(exp: ExpType): Promise<Result<ExpType>> {
    const res = await actionDeleteExp(exp);
    if (!res.error && res.data) {
        return new Result<ExpType>(res.data, res.message);
    } else {
        return new Result<ExpType>(undefined, res.message);
    }
}

export async function updateExp(searchTitle: string, exp: ExpType): Promise<Result<boolean>> {
    const res = await actionUpdateExp(searchTitle, exp);
    if (!res.error && res.data) {
        return new Result<boolean>(res.data, res.message);
    } else {
        return new Result<boolean>(undefined, res.message);
    }
}