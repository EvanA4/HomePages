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
            <H1>My Atmosphere Shader</H1>
            <IMG
                src='/blogPics/simPicCrop.png'
                height={687}
                width={683}
                alt='My fragment shader'
            >
                The atmosphere and postprocessing fragment shader.
            </IMG>
            <p>
                To the uninitiated, shaders are pretty much magic. Want a cube to look like a sphere? Vertex shader. Want to simulate inconceivable quantities
                of particles for a fluid simulation? Compute shader. In this blog, I'll be explaining what shaders even are. I'll also discuss the inner workings of
                my fragment shader for the atmosphere and how it fits in the context of the rest of my ThreeJS scene.
            </p>
            <Tip>If you're unsure what to call a sphere that is technically a cube, one of my friends called it a <Code>sphube</Code>.</Tip>
            <H2>What is a shader?</H2>
            <p>
                Very generally, a shader is just some code than runs in parallel on a GPU. Here are some of the different types:
            </p>
            <H3>Vertex Shader</H3>
            <p>
                Suppose you want to render an object. All objects in the rendering pipeline are comprised of vertices and edges. The vertex shader just computes where each vertex
                should appear on the screen, but messing with this shader can yield <a className='text-blue-400' href="https://github.com/kulesz/PlanetaryWater"><u>cool
                distortions</u></a> of a mesh.
            </p>
            <H3>Fragment Shader</H3>
            <p>
                Rendering this object also requires a fragment shader. This shader runs for each pixel the object takes up on the screen. This code ultimately determines what color
                of a pixel should be. Textures are a common input here.
            </p>
            <Important>
                Both vertex shaders and fragment shaders are <i>always</i> associated with an object!
            </Important>
            <H3>Compute Shader</H3>
            <p>
                A compute shader doesn't have a set purpose, as they are not a necessary part of the rendering pipeline. However, they can be used for simulations with
                many moving parts, like this <a className='text-blue-400' href="https://www.youtube.com/watch?v=X-iSQQgOd1A"><u>ant colony</u></a>.
            </p>
            <H2>My Shader's Context</H2>
            <p>
                My shader is responsible for displaying the atmosphere on my home page, and I just said that a fragment shader must be associated with an object. So what object
                does my fragment shader describe the pixels of? It's not the atmosphere.
            </p>
            <H3>The Atmosphere "Object"</H3>
            <p>
                Since my fragment shader is for postprocessing, the mesh is actually a rectangle (tecnically a plane) that <i>perfectly</i> covers the camera.
                <br/><br/>
                My shader has two steps:
            </p>
            <Elist>
                <li>Take the pixel that is below the rectangle</li>
                <li>Add any necessary atmospheric coloring</li>
                <li>Display that to the screen</li>
            </Elist>
            <br/>
            <p>    
                It's like if you asked me to draw a portait of you and instead I draw a
                beautiful landscape. However, just before I turn the drawing towards you, I realize you asked for a portait and I draw in a shoddy stick figure on top.
                <br/>
            </p>
            <Note>Because my shader's object perfectly fits the camera, the artificial scene looks like the real one.</Note>
            <H2>Ray Tracing 101</H2>
            <IMG
                src='/blogPics/badRayTracing.png'
                height={687}
                width={683}
                alt='Bad ray tracing'
            >
                The bad approach for ray tracing.
            </IMG>
            <p>
                If we were to simulate light in the way light actually works (as in, track the light emitted from a source), we would waste a lot of computation on rays which don't
                even meet our eyes. The image above shows a cute cow and a cool sun and how realistic light isn't very computer friendly. Fortunately, if we backtrack hypothetical rays
                that hit our eyes, we can reverse engineer what the colors of those rays are meant to be. Check this out:
            </p>
            <IMG
                src='/blogPics/goodRayTracing.png'
                height={687}
                width={683}
                alt='Good ray tracing'
            >
                The better approach for ray tracing. No redundant rays!
            </IMG>
            <Note>Because we are simulating rays moving backwards, this is sometimes called backwards ray tracing.</Note>
            <H2>Depth Texture</H2>
            <IMG
                src='/blogPics/depth.png'
                height={680}
                width={680}
                alt='Motivation for depth texture'
            >
                Two rays casted into an atmosphere.
            </IMG>
            <p>
                There's another critical part of the atmosphere we're forgetting. The further a ray travels into the atmosphere, the more the atmosphere should contribute
                to the color of the pixel. Take a look at the photo above.
                <br/><br/>
                The ray on the left doesn't travel far into the atmosphere, because it hits the top of the mountain. The right ray doesn't, and travels much further into denser parts
                of the atmosphere. We should expect that the pixel corresponding to the left ray should have a lot less atmospheric color than the ray on the right.
                <br/><br/>
                However, determining the path our ray travels into the atmosphere, we need a measurement of depth from the environment. A depth texture tell us how far each pixel
                reaches into the scene we are rendering.
            </p>
            <H2>The Physics</H2>
            <p>
                As it turns out, the equations for determining how much atmospheric color should be added to a pixel are rather intimidating.
                <br/><br/>
                In a perfect world, integrals would be used to compute the exact values of light rays that would reach our camera. Although, our computer doesn't have the ability to
                evaluate them. Instead, we can write <Code>for</Code> loops to determine the Riemann sum appoximations.
            </p>
            <Important>
                The name of this process is called numeric integration, and it may be an important part of future blogs!
            </Important>
            <p>
                For more details on the math behind atmospheric scattering, check out
                Nvidia's <a className='text-blue-400'
                href="https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-16-accurate-atmospheric-scattering"><u>guide</u></a> and Sebastian
                Lague's <a className="text-blue-400" href="https://www.youtube.com/watch?v=DxfEbulyFcY"><u>video</u></a>.
            </p>
        </div>
    )
}

const BlogTesting = () => {
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