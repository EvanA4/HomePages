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
                alt='My Fragment Shader'
            >
                The atmosphere and postprocessing fragment shader.
            </IMG>
            <p>
                To the uninitiated, shaders are pretty much magic. Want a cube to look like a sphere? Vertex shader. Want to simulate inconceivable quantities
                of particles for a fluid simulation? Compute shader. In this blog, I'll be explaining the inner workings of my fragment shader for the atmosphere
                and how it fits in the context of the rest of my ThreeJS scene.
            </p>
            <Tip>If you're unsure what to call a sphere that is technically a cube, one of my friends called it a <Code>sphube</Code>.</Tip>
            <H2>What is a shader?</H2>
            <p>
                In my opinion, it's easiest to learn what shaders are by analyzing the types of shaders. In general, a shader is just some code than runs on a GPU,
                normally in parallel.
            </p>
            <H3>Vertex Shader</H3>
            <p>
                A vertex shader runs in parallel for each vertex on an object you wish to render. All it computes is where the vertex should appear on the screen, but
                messing with this shader can yield <a className='text-blue-400' href="https://github.com/kulesz/PlanetaryWater"><u>cool distortions</u></a> of a mesh.
            </p>
            <H3>Fragment Shader</H3>
            <p>
                A fragment shader, runs for each pixel said object takes up on the screen. This code ultimately determines what the color of that pixel shoud be. Textures
                are a common input here.
            </p>
            <Important>
                Just to reiterate, both vertex shaders and fragment shaders must be associated with an object!
            </Important>
            <H3>Compute Shader</H3>
            <p>
                A compute shader doesn't have a set purpose, as they are not a necessary part of the rendering pipeline. However, they can be used for simulations with
                many moving parts, like this <a className='text-blue-400' href="https://www.youtube.com/watch?v=X-iSQQgOd1A"><u>ant colony</u></a>.
            </p>
            <H2>My Shader's Context</H2>
            <p>
                In my scene, I told ThreeJS (it's technically React Three Fiber since this is a React site) to render the scene <i>twice</i>. The first time, the scene
                is rendered without my atmosphere around the planet. The rendered frame is then given to my fragment shader. But what object is my fragment shader for?
            </p>
            <H3>The Atmosphere "Mesh"</H3>
            <p>
                I said that fragment shaders run for a specific object, and my shader is no exception. Since my fragment shader is for postprocessing, the mesh is actually
                a rectangle (tecnically a plane) that <i>perfectly</i> covers the camera. All my shader does is take the rendered frame from earlier and draw in the atmosphere
                on top. This frame is then drawn on top of the rectangle with my fragment shader. It's like if you asked me to draw a portait of you and instead I draw a
                beautiful landscape. However, just before I turn the drawing towards you, I realize you asked for a portait and I draw in a shoddy stick figure on top.
                <br/><br/>
                The scene then renders the rectangle, and because the rectangle perfectly fits the camera, the artificial scene looks like the real one.
            </p>
            <H2>Simulating the Light</H2>
            <H3>1. Backwards Ray Tracing</H3>
            <IMG
                src='/blogPics/badRayTracing.png'
                height={687}
                width={683}
                alt='My Fragment Shader'
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
                alt='My Fragment Shader'
            >
                The better approach for ray tracing. No redundant rays!
            </IMG>
            <Note>Because we are simulating rays moving backwards, this is sometimes called backwards ray tracing.</Note>
            <H3>2. Depth Texture</H3>
            <p>
                Remember when I said there were only two renderings? I LIED. There's technically three. The computations necessary for my atmosphere require many inputs, and one of these is a
                texture where each pixel indicates how far away the object in that pixel is away from the camera. Pixels of close objects are usually black, whereas far objects appear white.
                This depth texture is rendered along with the first frame, the one that the fragment shader draws on top of.
                <br/><br/>
                Using this texture of distances, we can see how far a ray of light "emitted" from any pixel would reach into the atmosphere. Intuitively, the further a ray of light
                travels in the atmosphere, the greater the chance is to see any scattered sunlight.
            </p>
            <H3>3. Cheesing Physics</H3>
            <p>
                There are a whole bunch of integrals used to compute the exact values of light rays that would reach our camera. Unfortunately, our computer doesn't have the resources to
                perform these integrations. Instead, we can write <Code>for</Code> loops to determine the Riemann sum appoximations.
                <br/><br/>
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