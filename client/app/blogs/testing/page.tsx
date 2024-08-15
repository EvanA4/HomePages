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
            <H1>Blog Example: Everything In One Place</H1>
            <p>If you haven't immediately noticed, this blog style is heavily inspired by GitHub's unique markdown documents.</p>
            <H2>Motivation Behind This Blog</H2>
            <p>
                In my GitHub projects, I've always tried to explaining some about how the project works to inspire any onlookers to try it themselves.
                This blog is another way of explaining how my website works. I hope some fellow computer nerds enjoy seeing behind the scenes and try
                to implement this themselves!
            </p>
            <H3>So What About a <i>REAL</i> Blog?</H3>
            <p>
                My first blog is likely going to be explaining how this site works or how
                my <a href="https://github.com/EvanA4/CNNChess" className="text-blue-400"><u>chess bot</u></a> works (it's terrible, by the way).
                Wanna guess what the hardest part of developing this website was? It was learning how to write shaders for the fancy space simulation
                at the top of the home page. It took like two full months, but half of the struggle was coming home from working full-time at ORNL as
                a SULI intern just to code even more.
            </p>
            <H3>The Rest of This Blog</H3>
            <p>
                The rest of this blog is just going to demonstrate other elements I can add to my blogs for visual flare. I can't really come up with
                a cool segway, so I just made this additional subsection.
            </p>
            <Note>Hi there!</Note>
            <Tip>What's up?</Tip>
            <Important>This is good to know.</Important>
            <Warning>Uh oh...</Warning>
            <Caution>This is terrible!</Caution>
            <Textblock>Here is some less dramatic stuff.</Textblock>
            <p>To print something to the console in JavaScript, simply write <Code>console.log("Hello world!")</Code></p>
            <p>Take a look at this <a href="https://google.com" className="text-blue-400"><u>link</u></a> to Google!</p>
            <IMG
                src='/blogPics/example.png'
                height={500}
                width={500}
                alt="some alt text"
            >
                Figure 1. Here is a caption.
            </IMG>
            <Codeblock>
                This is a lot of information, so sit down! <br/>
                Check out all of these individual lines! <br/>
                Oh yeah, this baby *pat pat* can fit so many lines in it.
            </Codeblock>
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