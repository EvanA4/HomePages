'use server'
import { hash, compare } from "bcrypt";
import { cookies } from "next/headers";
import { SessionPayload, User } from "@/types/authtypes";
import { UserModel } from "@/public/models/user";
import { jwtVerify, SignJWT } from "jose";


const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);


export async function actionCreateUser(user: User): Promise<{
    success: boolean;
    message: string;
    data?: User;
}> {
    if (!user.username || !user.password || !user.hint) {
        return {
            success: false,
            message: "Invalid body."
        };
    }
    
    user.password = await hash(user.password, 10);
    try {
        const result = (await UserModel.create({...user})).dataValues as unknown as User;
        
        return {
            success: true,
            data: result,
            message: "Successfully created user.",
        };

    } catch {
        return {
            success: true,
            message: "Failed to create user.",
        };
    }
}


export async function actionValidateCredentials(username: string, password: string): Promise<{
    success: boolean;
    message: string;
    data: boolean;
}> {
    try {
        let user = (await UserModel.findOne({ where: { username: username} }))?.dataValues as unknown as User | undefined;

        if (!user) {
            return {
                success: true,
                message: "user does not exist",
                data: false,
            };
        }

        let result = await compare(password, user.password);

        return {
            success: true,
            message: "successfully compared passwords",
            data: result,
        };

    } catch {
        return {
            success: false,
            message: "failed to validate credentials",
            data: false,
        };
    }
}


export async function actionGetUserByCookie(apiCookie?: string): Promise<{
    success: boolean;
    message: string;
    data?: User;
}> {
    try {
        const cookie = apiCookie ? apiCookie : (await cookies()).get("session")?.value;
        if (cookie) {
            const session = await actionDecryptJWT(cookie);
            if (session) {
                if (Date.now() < session.expiresAt.getTime()) {
                    // token hasn't expired
                    const user = (await UserModel.findOne({ where: { id: session.userId }}))?.dataValues;
                    if (user) {
                        return {
                            success: true,
                            message: "successfully retrieved user",
                            data: user,
                        };
                    }

                } else {
                    // token has expired
                    if (!apiCookie) {
                        (await cookies()).delete("session");
                    }
                    return {
                        success: true,
                        message: "token expired",
                    };
                }
            }
        }

        return {
            success: true,
            message: "session cookie does not exist",
        };

    } catch {
        return {
            success: false,
            message: "could not retrieve user",
        };
    }
}


export async function actionGetUserByName(username: string): Promise<{
    success: boolean;
    message: string;
    data?: User;
}> {
    try {
        const user = (await UserModel.findOne({ where: { username: username }}))?.dataValues;
        if (user) {
            return {
                success: true,
                message: "successfully retrieved user",
                data: user,
            };

        } else {
            return {
                success: true,
                message: "could not retrieve user",
            };
        }

    } catch {
        return {
            success: false,
            message: "errored while retrieving user",
        };
    }
}


export async function actionCreateSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await actionCreateJWT({ userId, expiresAt });

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt
    });
}


export async function actionCreateJWT(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}


export async function actionDecryptJWT(session: string | undefined = "") {
    try {
        const blah = (await jwtVerify(session, encodedKey, { algorithms: ["HS256"] })).payload as {
            userId: string,
            expiresAt: string
        };
        return {
            userId: parseInt(blah.userId),
            expiresAt: new Date(blah.expiresAt),
        }
    } catch (error) {
        console.log("failed to verify session");
    }
}


export async function actionLogin(username: string) {
    // get userId
    const user = (await UserModel.findOne({ where: { username: username }}))?.dataValues as unknown as User;
    await actionCreateSession(user.id!.toString());
}


export async function actionLogout() {
    (await cookies()).delete("session");
}