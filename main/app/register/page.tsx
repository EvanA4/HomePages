'use client';
import { useState } from "react";
import { Nav } from "../components/general/nav";
import { createUser } from "@/public/utils/authUtils";
import { actionLogin } from "@/actions/authActions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/types/authtypes";
import VerifyLayout, { PageVerifyType } from "../components/general/verifyLayout";

export default function Login() {
    const [inputUsername, setUsername] = useState("");
    const [inputPassword, setPassword] = useState("");
    const [inputHint, setHint] = useState("");
    const [globalError, setGlobalError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    function verify(user: User | undefined): PageVerifyType {
        const pv: PageVerifyType = {
            accepted: false,
            rejectMsg: "You cannot be logged in to visit this page.",
            url: "/",
        }

        if (user) {
            return pv;
        } else {
            pv.accepted = true;
            return pv;
        }
    }

    async function handleSubmit() {
        // console.log(`inputUsername: \"${inputUsername}\"`);
        // console.log(`inputPassword: \"${inputPassword}\"`);
        // console.log(`inputHint: \"${inputHint}\"`);

        // verify username and password
        const userRegex = /^[a-zA-Z0-9]+$/;
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{6,16}$/

        if (inputUsername.length < 4 || inputUsername.length > 15) {
            setGlobalError("Username must be between 4-15 characters in length.");
            return;
        }

        if (!userRegex.test(inputUsername)) {
            setGlobalError("Username must only contain letters and numbers.");
            return;
        }

        if (!passwordRegex.test(inputPassword)) {
            setGlobalError("Password must be 6-16 characters long with one number and special character.");
            return;
        }

        if (inputHint.length == 0) {
            setGlobalError("Hint cannot be empty.");
            return;
        }

        const res = await createUser({
            username: inputUsername,
            password: inputPassword,
            hint: inputHint,
            isAdmin: false,
        });
        if (res.success && res.unwrap()) {
            await actionLogin(res.unwrap().username);
            router.push("/");
        } else if (res.message == "Failed to create user.") {
            setGlobalError("Failed to create user (may already exist).");
            return;
        } else {
            setGlobalError("Error creating user.");
            return;
        }
    }

    return (
        <div className="w-full">
            <Nav alwaysOn />

            <VerifyLayout verify={verify}>
                <div className="h-[100vh] w-full flex flex-col items-center justify-center text-white">
                    <div className="flex flex-col items-center justify-center p-5 rounded-lg bg-neutral-950 bg-opacity-20 w-[300px]">                    
                        <p className="text-3xl mb-10">Register</p>

                        <div className="p-2">
                            <label htmlFor="username" className="mr-3 block">Username</label>
                            <input
                                value={inputUsername}
                                onChange={e => setUsername(e.target.value)}
                                type="text"
                                name="username"
                                id="username"
                                className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black"
                                placeholder="username"
                            />
                            <br />
                        </div>

                        <div className="p-2">
                            <label htmlFor="password" className="mr-3 block">Password</label>
                            <div className="relative inline">
                                <input
                                    value={inputPassword}
                                    onChange={e => setPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black"
                                    placeholder="password"
                                    content="hide"
                                />

                                <button
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute top-[50%] right-0 -translate-y-[50%] mr-2 opacity-70 hover:opacity-100"
                                >
                                    <Image
                                        src={showPassword ? "/svgs/show.svg" : "/svgs/hide.svg"}
                                        height={20}
                                        width={20}
                                        alt="Hide icon"
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="p-2">
                            <label htmlFor="hint" className="mr-3 block">Hint</label>
                            <input
                                value={inputHint}
                                onChange={e => setHint(e.target.value)}
                                type="text"
                                name="hint"
                                id="hint"
                                className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black"
                                placeholder="hint"
                            />
                        </div>

                        {globalError && <p className="text-red-500">{globalError}</p>}

                        <button
                            onClick={handleSubmit}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg mt-6"
                        >Submit</button>

                        <p>or</p>

                        <a href="/login" className="text-blue-500 hover:text-blue-400">Sign in</a>
                    </div>
                </div>
            </VerifyLayout>
        </div>
    )
}
