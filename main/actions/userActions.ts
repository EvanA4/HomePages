'use server'

import { UserModel } from "@/public/models/user"
import { User } from "@/types/authtypes";

export async function actionGetUsers(): Promise<User[]> {
    return (await UserModel.findAll()).map(res => res.dataValues) as unknown as User[];
}

export async function actionDeleteUser(by: {id?: number, username?: string}): Promise<{
    success: boolean;
    message: string;
    data?: User;
}> {
    const { id, username } = by;
    if (!id && !username) {
        return {
            success: false,
            message: "id or username required",
        };
    }

    try {
        // get user we're deleting
        const filter = id ? {
            id: id
        } : {
            username: username
        };

        const deleted = (await UserModel.findOne({ where: filter }))?.dataValues;

        // check if user even exists
        if (!deleted) {
            return {
                success: true,
                message: "user does not exist",
            };
        }

        await UserModel.destroy({ where: filter });

        return {
            success: true,
            message: "successfully deleted user",
            data: deleted,
        };

    } catch {
        return {
            success: false,
            message: "error deleting user",
        }
    }
}

export async function actionChangeUserRole(by: {id?: number, username?: string}, isNewAdmin: boolean): Promise<{
    success: boolean;
    message: string;
    data?: User;
}> {
    const { id, username } = by;
    if (!id && !username) {
        return {
            success: false,
            message: "id or username required",
        };
    }

    try {
        // get user we're deleting
        const filter = id ? {
            id: id
        } : {
            username: username
        };

        const toUpdate = (await UserModel.findOne({ where: filter }))?.dataValues;

        // check if user even exists
        if (!toUpdate) {
            return {
                success: true,
                message: "user does not exist",
            };
        }

        await UserModel.update({ isAdmin: isNewAdmin }, { where: filter });

        return {
            success: true,
            message: "successfully deleted user",
            data: {
                ...toUpdate,
                isAdmin: isNewAdmin,
            },
        };

    } catch {
        return {
            success: false,
            message: "error deleting user",
        }
    }
}