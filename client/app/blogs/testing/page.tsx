'use client'
import React from "react"
import Image from "next/image"
import Nav from '../../components/nav'


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
    const Elist = (props: any) => { return (
        <ul className="list-disc pl-[20px]">
            {props.children}
        </ul>
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
            <H1>Rendering a Black Hole</H1>
            <IMG
                src='/blogPics/bhFinal.png'
                height={912}
                width={1920}
                alt='My fragment shader'
            >
                The final (scuffed) black hole.
            </IMG>
            <Caution>
                This blog builds upon concepts already laid out in my <a className='text-blue-400' href="https://evanabbott.net/blogs/My+Atmosphere+Shader">atmosphere blog</a>. Please
                read this first and come back!
            </Caution>
            <H2>What is Gravity?</H2>
            <p>
                Here, we will be looking at concepts of general relativity (as opposed to special relativity). In a field where light travels no distance and time is
                measured in two dimensions, I will be oversimplifying a lot through this blog.
                <br/><br/>
                Suppose you're flying in a plane. If you try to fly straight, you'd expect to fly in a line. Ultimately, you will eventually end up flying in a ring around the Earth.
                Obviously, this has something to do with gravity.
                <br/><br/>
                One thing that makes relativity different from Newtonian mechanics, however, is that gravity isn't considered a force.
                In our case, gravity is just the byproduct of the fabric of the universe, spacetime, warping.
            </p>
            <Important>
                In this scenario, one could argue you actually <i>did</i> fly in a straight line. You only formed a ring because spacetime was warped.
            </Important>
            <H2>The Core Equation</H2>
            <IMG
                src='/blogPics/EFE.png'
                height={99}
                width={341}
                alt='EFE'
            >
                The Einstein Field Equations.
            </IMG>
            <p>
                Einstein first made his equations public in 1915, and they describe how energy and space are related. There have been multiple solutions to these equations, one of which
                being the Schwarzschild metric. This metric describes spacetime around a non-rotating, uncharged black hole:
            </p>
            <IMG
                src='/blogPics/schwarzschildMetric.png'
                height={79}
                width={766}
                alt='Schwarzschild metric'
            >
                The Schwarzschild metric.
            </IMG>
            From this, <a className='text-blue-400' href="https://rantonels.github.io/starless">Riccardo Antonelli</a> derived a second-order ordinary differential equation (ODE) which
            describes the paths of photons:
            <IMG
                src='/blogPics/starlessEq.png'
                height={135}
                width={242}
                alt='Starless eq'
            >
                The final ODE for ray tracing.
            </IMG>
            <p>
                Where <Code>h</Code> represents the angular momentum of the photon, which is a constant equal to the length of the cross product between the initial position and
                initial velocity. With some numeric integration (I used Euler's method instead of the classic Runge-Kutta method), a final position of the photon can be reached.
            </p>
            <H2>The Fragment Shader</H2>
            <p>
                Just like with the atmosphere blog, we can create a rectangle that perfectly covers the camera and use the fragment shader. The shader has three main steps for each pixel:
            </p><br/>
            <Elist>
                <li>Creating the initial position and velocity of the photon</li>
                <li>Moving the photon along its predetermined path, checking for collisions with the accretion disk</li>
                <li>If the photon hasn't fallen into the black hole, draw a straight line from the photon out into infinity</li>
                <li>From this far away position, sample the skybox for the appropriate color</li>
            </Elist>
            <H2>Precomputation and Compromises</H2>
            <p>
                There are <a href="https://arxiv.org/abs/2010.08735" className='text-blue-400'>multiple ways</a> to improve performance with precomputation.
            </p>
            <IMG
                src='/blogPics/bhPrecomp.png'
                height={680}
                width={680}
                alt='Starless eq'
            >
                Dimensions used to describe the path of a photon in 2D.
            </IMG>
            <p>
                The inputs for my precomputation image are the initial distance from the black hole and the angle of the velocity vector. However, this assumes spherical symmetry around
                the blackhole. This assumption is true as long as we aren't including the accretion disk. If you are willing to sacrifice the accretion disk for potato-as-a-computer
                optimization, this is a great option. The nice thing about this precomputation is that we can make it as accurate of a computation as we'd like before deploying it.
                <br/><br/>
                If you aren't interested in that, then using two dimensions instead of three for the ray tracing can help. The above image also
                displays <Code>e0</Code> and <Code>e1</Code> which span the entire orbital plane of the photon. Fortunately, this saves us from using a 3D cross product
                when computing the inital angular momentum. Instead, the angular momentum is just the distance of the initial position times the e1 component of the initial velocity.
            </p>
            <Warning>
                A photon only has an orbital plane if the black hole is non-rotating. Otherwise, this two component optimization will not help.
            </Warning>
            <IMG
                src='/blogPics/bhFastRaw.png'
                height={911}
                width={1920}
                alt='Starless eq'
            >
                The fast but disk-less version of the black hole ray tracer.
            </IMG>
            <H2>Final Notes</H2>
            <p>
                Over the few months I was researching how to go about this project, I noticed that there were a disproportionate number of people that had their own blog site amongst
                those who had already completed this project. This was another reason for me creating my personal website and hosting it at my own home. I specifically want to thank
                one <a href="https://seanholloway.com/" className="text-blue-400">Sean Holloway</a> for inspiring me.
                <br/><br/>
                There are a LOT of things I'm still not accounting for with this general ray tracer. Actually, the only thing I <i>am</i> accounting for is the warped spacetime. There's
                still the doppler effect and time retardation at the very least. I could implement these things, but I feel like it's time for me to move on from this project.
            </p>
        </div>
    )
}

const BlogTesting = () => {
    return (
        <div className="bg-zinc-950 min-h-[100vh]">
            <Nav alwaysOn={true}/>

            <div className="text-white my-[10vh] w-[80vw] sm:w-[73.57vw] md:w-[565px] lg:w-[55.16vw] xl:w-[706px] 2xl:w-[46vw] mx-auto">
                {blogTSX(Image)}
            </div>
        </div>
    )
}


export default BlogTesting