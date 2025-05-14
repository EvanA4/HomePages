'use client'

import { actionCreateUser, actionGetUserByCookie, actionGetUserByName, actionValidateCredentials } from "@/actions/authActions";
import { User } from "@/types/authtypes";
import { Result } from "@/types/result";
import { useEffect, useState } from "react";

export async function createUser(user: User): Promise<Result<User>> {
    const res = await actionCreateUser(user);
    
    if (res.data) {
        return new Result<User>(res.data);
    } else {
        return new Result<User>(undefined, res.message);
    }
}

export async function validateCredentials(username: string, password: string): Promise<Result<boolean>> {
    const res = await actionValidateCredentials(username, password);

    if (!res.success) {
        return new Result<boolean>(undefined, res.message);
    } else {
        return new Result<boolean>(res.data, res.message);
    }
}

export function useUser() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        (async () => {
            let res = await actionGetUserByCookie();
            if (res.data) {
                setUser(res.data);
            }

            setIsLoading(false);
        })();
    }, []);

    return { user, loading: isLoading }
}

export async function getHint(username: string): Promise<Result<string>> {
    const res = await actionGetUserByName(username);
    if (res.success && res.data) {
        return new Result<string>(res.data.hint, res.message);
    } else {
        return new Result<string>(undefined, res.message);
    }
}