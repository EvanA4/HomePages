'use client'
import React from "react"
import Image from "next/image"
import Nav from '../../components/nav'
import * as babel from "babel-standalone"


const userInputtedCode = `
function blogTSX(props: any) {
    const Image = props

    const Note = (props: any) => {return (
        <div className={"my-[20px] border-l-[5px] border-l-blue-500 pl-[10px] py-[5px]"}>
            <p className={"text-blue-500"}>Note</p>
            <p className="text-[16px] text-white">{props.children}</p>
        </div>
    )}
    const Tip = (props: any) => {return (
        <div className={"my-[20px] border-l-[5px] border-l-green-600 pl-[10px] py-[5px]"}>
            <p className={"text-green-600"}>Tip</p>
            <p className="text-[16px] text-white">{props.children}</p>
        </div>
    )}
    const Important = (props: any) => {return (
        <div className={"my-[20px] border-l-[5px] border-l-[#c977ff] pl-[10px] py-[5px]"}>
            <p className={"text-[#c977ff]"}>Important</p>
            <p className="text-[16px] text-white">{props.children}</p>
        </div>
    )}
    const Warning = (props: any) => {return (
        <div className={"my-[20px] border-l-[5px] border-l-orange-500 pl-[10px] py-[5px]"}>
            <p className={"text-orange-500"}>Warning</p>
            <p className="text-[16px] text-white">{props.children}</p>
        </div>
    )}
    const Caution = (props: any) => {return (
        <div className={"my-[20px] border-l-[5px] border-l-red-500 pl-[10px] py-[5px]"}>
            <p className={"text-red-500"}>Caution</p>
            <p className="text-[16px] text-white">{props.children}</p>
        </div>
    )}
    const Textblock = (props: any) => {return (
        <p className="my-[20px] py-[5px] pl-[10px] border-l-[5px] border-l-neutral-400">{props.children}</p>
    )}
    const Code = (props: any) => {return (
        <span className='font-mono bg-zinc-800 p-1 rounded-[5px]'>{props.children}</span>
    )}
    const Codeblock = (props: any) => {return (
        <div className='font-mono bg-zinc-800 py-2 px-3 rounded-[5px]'>
            {props.children}
        </div>
    )}
    const H1 = (props: any) => {
        return (
            <div className='mt-[40px] mb-[20px]'>
                <p className='text-white text-[36px]'><b>{props.children}</b></p>
                <hr className='border-neutral-700'/>
            </div>
        )
    }
    const H2 = (props: any) => {
        return (
            <div className='mt-[40px] mb-[20px]'>
                <p className='text-white text-[24px]'><b>{props.children}</b></p>
                <hr className='border-neutral-700'/>
            </div>
        )
    }
    const H3 = (props: any) => {
        return (<p className='mt-[20px] mb-[10px] text-white text-[20px]'><b>{props.children}</b></p>)
    }
    const IMG = (props: any) => {
        return (
            <div className='flex flex-col items-center my-[50px]'>
                <Image
                    priority
                    src={props.src}
                    height={props.height}
                    width={props.width}
                    alt={props.alt}
                />
                <p className='my-[10px]'>{props.children}</p>
            </div>
        )
    }

    return (
        <div className='text-neutral-200'>
            <H1>Welcome to HomePages</H1>
            <p>
                I'm gonna pull a <a className='text-blue-400' href="https://blog.seanholloway.com/2021/09/08/home-web-server-and-hosting/"><u>
                Sean Holloway</u></a> and say,
                <br/>
                If you’re seeing this page, welcome to my living room! You are here:
            </p>
            <IMG
                src='/blogPics/ingenuity.png'
                height={500}
                width={500}
                alt="some alt text"
            >
                This is <i>Ingenuity</i>, the GMKTec NucBox mini computer hosting this site.
            </IMG>
            <H2>What's the Deal With Ingenuity?</H2>
            <H3>1. The Name</H3>
            <p>
                Ingenuity was given its name because of the name of my main computer: Perseverance. When I was setting up that computer tower, I
                somehow corrupted the memory and spent like two days figuring out how to save it. I ended up just reformatting everything. However, since I
                pushed through to save that PC, the PC's name became Perseverance. I also chose the name because Perseverance is the name of a still-active
                Mars rover (as of August 2024). Interestingly, Perseverance came with a little helicopter friend strapped to its belly named Ingenuity.
                Since my little machine is under the desk of my Perseverance, Ingenuity was a fitting choice.
            </p>
            <H3>2. Reason for Self-Hosting</H3>
            <p>
                A couple of months ago, I was wanting to try a project in graphics programming. Specifically, I wanted to render a black hole by simulating
                the paths of photons in warped spacetime. I found many solo developers had written blogs on this subject, and most of these devs also
                had their own websites. I realized that, if I were to make my own relativistic ray tracer, it's only fitting I do the same thing.
                <br/><br/>
                It's also a great experience for web development. I had an excuse to try Nginx for reverse proxying, but I also learned about DNS, SSL
                certificates, making my own SSH machine, and more.
            </p>
            <Caution>If you ever need to forward ports, avoid Spectrum if you can!</Caution>
            <H2>Dividing this Blog</H2>
            <p>
                Creating this website had quite a few ups and downs. The hardest part of this website, however, was creating the fancy simulation at
                the top of the main page. I used Sebastian
                Lague's <a className='text-blue-400' href='https://www.youtube.com/watch?v=DxfEbulyFcY'><u>video</u></a> on creating a postprocessing
                shader for simulating atmospheric light scattering. Unfortunately, figuring out how to use conveniently use my own shaders for
                react-three-fiber turned out to be more of a problem than I had thought.
                <br/><br/>
                Another difficult but fun part of designing this site was powering the blog features with my own MySQL database server. Although, both
                my MySQL server and shader deserve their own blogs. I'll see you there!
            </p>
        </div>
    )
}
`

const BlogTesting = () => {
    const babelCode = babel.transform(userInputtedCode, {presets: ["react", "es2017"]}).code;
    const code = babelCode.replace('"use strict";', "").trim();
    const func = new Function("React", `return ${code}`);
    const blogTSX = func(React);

    return (
        <div className="bg-zinc-950 min-h-[100vh]">
            <Nav alwaysOn={true}/>

            <div className="text-white py-[10vh] px-[10vw]">
                {blogTSX(Image)}
            </div>
        </div>
    )
}


export default BlogTesting