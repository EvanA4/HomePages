'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "../components/general/nav";
import { getHint, useUser, validateCredentials } from "@/public/utils/authUtils";
import { actionLogin } from "@/actions/authActions";
import Image from "next/image";
import { User } from "@/types/authtypes";
import VerifyLayout, { PageVerifyType } from "../components/general/verifyLayout";

export default function Login() {
    const [inputUsername, setUsername] = useState("");
    const [inputPassword, setPassword] = useState("");
    const [globalError, setGlobalError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordHint, setPasswordHint] = useState("");

    const { user } = useUser();
    const router = useRouter();
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user]);

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
        
        // verify username and password
        if (!inputUsername || !inputPassword) {
            setGlobalError("Empty username or password.");
        }

        const res = await validateCredentials(inputUsername, inputPassword);
        if (!res.error && res.unwrap()) {
            await actionLogin(inputUsername);
            setGlobalError("");
            router.push("/");
        } else if (!res.error && !res.unwrap()) {
            setGlobalError("Invalid username or password.")
        } else {
            setGlobalError("Error validating credentials.");
        }
    }

    async function handleHint() {
        if (!inputUsername) {
            setGlobalError("Empty username.");
            return;
        }

        const res = await getHint(inputUsername);
        if (!res.error) {
            setPasswordHint(res.unwrap());
            setGlobalError("");

        } else if (res.message == "could not retrieve user") {
            setGlobalError("User does not exist.");
        } else {
            setGlobalError("Error fetching hint.");
        }
    }

    return (
        <div className="w-full relative">
            <Nav alwaysOn={true} />

            <VerifyLayout verify={verify}>
                <div className="h-[100vh] w-full flex flex-col items-center justify-center text-white">
                    <div className="flex flex-col items-center justify-center p-5 rounded-lg bg-neutral-950 bg-opacity-20 w-[300px]">
                        <p className="text-3xl mb-10">Login</p>

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

                        {passwordHint && <p>Hint: <i className="text-neutral-400">{passwordHint}</i></p>}

                        {globalError && <p className="text-red-500">{globalError}</p>}

                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmit}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg mt-6"
                            >Submit</button>

                            <button
                                onClick={handleHint}
                                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg mt-6"
                            >Hint</button>
                        </div>

                        <p>or</p>

                        <a href="/register" className="text-blue-500 hover:text-blue-400">Create an account</a>
                    </div>
                </div>
            </VerifyLayout>
        </div>
    )
}
