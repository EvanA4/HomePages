import { actionChangeUserRole, actionDeleteUser } from "@/actions/userActions";
import { User } from "@/types/authtypes";
import { Result } from "@/types/result";

export async function deleteUser(by: { id?: number; username?: string }): Promise<Result<User>> {
    const res = await actionDeleteUser(by);

    if (res.data) {
        return new Result<User>(res.data, res.message);
    } else {
        return new Result<User>(undefined, res.message);
    }
}

export async function changeUserRole(by: { id?: number; username?: string }, isNewAdmin: boolean): Promise<Result<User>> {
    const res = await actionChangeUserRole(by, isNewAdmin);

    if (res.data) {
        return new Result<User>(res.data, res.message);
    } else {
        return new Result<User>(undefined, res.message);
    }
}