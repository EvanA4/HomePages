'use client'

import React, { use, useEffect } from "react";
import Image from "next/image";
import { Nav } from "../../components/general/nav";
import { useState } from "react";
import * as babel from "babel-standalone";
import { getBlogByTitle } from "@/public/utils/blogUtils";
import { addCodeFrame } from "@/public/utils/blogFrame";


export default function Blog({ params }: any) {
    const [blogCode, setBlog] = useState(<></>);
    const [loading, setLoading] = useState(true);
    const [blogError, setBlogError] = useState("");
    const { blogTitle } = use(params) as { blogTitle: string };

    function getRandomErrorImage() {
        const rand = Math.floor(Math.random() * 12);
        if (rand < 6) {
            return "error0.png";
        } else {
            return `error${rand - 5}.png`;
        }
    }

    useEffect(() => {
        (async () => {
            const blogRes = await getBlogByTitle(blogTitle.replaceAll("%2B", " "));
            if (!blogRes.error) {
                try {
                    const blog = blogRes.unwrap();
                    const babelCode = babel.transform(addCodeFrame(blog.content), {presets: ["react", "es2017"]}).code as string;
                    const func = new Function("React", `return ${babelCode}`);
                    setBlog(func(React)(Image))
                } catch (e: any) {
                    let message = e.message as string;

                    setBlogError(message);
                }
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="bg-zinc-950 min-h-[100vh]">
            <Nav alwaysOn={true}/>
                {loading ? <>
                    {/* If is loading */}
                    <div className="w-full h-screen flex justify-center items-center">
                        <div className="animate-spin">
                            <Image
                                width={80}
                                height={80}
                                alt="preparing QR code..."
                                src="/svgs/loading.svg"
                                priority
                            />
                        </div>
                    </div>
                </> : <>
                    {blogError ? <>
                        {/* If errored */}
                        <div className="w-full h-screen flex flex-col gap-10 justify-center items-center text-white">
                            <Image
                                width={300}
                                height={300}
                                alt="rendering error"
                                src={`/error/${getRandomErrorImage()}`}
                                priority
                            />

                            <div className="bg-black p-5 rounded-2xl">
                                <p className="md:text-[30px] text-[20px] text-center mb-5">Rendering Error</p>
                                <hr className="border border-neutral-400"/>
                                <div className="overflow-x-auto w-full p-5 rounded-2xl">
                                    <div className="whitespace-pre-wrap font-mono text-[14px] w-max">
                                        {blogError}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> : <>
                        {/* If valid code */}
                        <div className="text-white py-[10vh] w-[80vw] sm:w-[73.57vw] md:w-[565px] lg:w-[55.16vw] xl:w-[706px] 2xl:w-[46vw] mx-auto">
                            {blogCode}
                        </div>
                    </>}
                </>}
        </div>
    )
}

// big changes coming right up