// @ts-nocheck
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei'
// import { EXRLoader } from 'three/examples/jsm/Addons.js'


// The below five lines are normally red, idk how to fix this yet -- still works!
import atmVert from './shaders/atmVert.glsl'
import atmFrag from './shaders/atmFrag.glsl'
import sunVert from './shaders/sunVert.glsl'
import sunFrag from './shaders/sunFrag.glsl'

// skybox
import px from '../../public/skybox/px.png'
import nx from '../../public/skybox/nx.png'
import py from '../../public/skybox/py.png'
import ny from '../../public/skybox/ny.png'
import pz from '../../public/skybox/pz.png'
import nz from '../../public/skybox/nz.png'

// backup sim pic
import simPic from '../../public/simPicSmall.png'
import Image from 'next/image'


interface AtmProps {
  position: THREE.Vector3
  radius: number
}


const Atm = (props: AtmProps) => {
  const { scene, camera, size } = useThree()
  const shMatRef = useRef<THREE.ShaderMaterial>(null!)
  const rectRef = useRef<THREE.PlaneGeometry>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  const opticalTxt = useRef<THREE.DataTexture>(null!)

  const meshPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const meshDim = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))
  const lightPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))

  const target = useRef<THREE.WebGLRenderTarget>(new THREE.WebGLRenderTarget(
    size.width,
    size.height,
    {
      samples: 4,
      depthBuffer: true,
      depthTexture: new THREE.DepthTexture(size.width, size.height)
    }
  ))

  // useEffect(() => {
  //   const exrLoader = new EXRLoader();
  //   exrLoader.setDataType(THREE.FloatType)
  //   exrLoader.load('/opticalDepth.exr', (texture) => {
  //     shMatRef.current.uniforms.opticalTxt.value = texture
  //     // console.log(texture.image.data)
  //   })
  // }, [])

  useFrame((state) => {
    shMatRef.current.visible = false;
    state.gl.setRenderTarget(target.current)
    state.gl.render(scene, camera)
    shMatRef.current.visible = true;

    shMatRef.current.uniforms.depthTxt.value = target.current.depthTexture
    shMatRef.current.uniforms.colorTxt.value = target.current.texture
    
    // match post-processing mesh to camera
    let cameraDir = new THREE.Vector3()
    camera.getWorldDirection(cameraDir)
    let cameraLength = Math.sqrt(Math.pow(cameraDir.x, 2) + Math.pow(cameraDir.y, 2) +  Math.pow(cameraDir.z, 2))
    let cameraNorm = [cameraDir.x / cameraLength, cameraDir.y / cameraLength, cameraDir.z / cameraLength]
    meshRef.current.position.set(camera.position.x + cameraNorm[0] * .1, camera.position.y + cameraNorm[1] * .1, camera.position.z + cameraNorm[2] * .1)
    meshRef.current.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z)

    // find position of sun
    let period = 40
    let time = state.clock.elapsedTime
    let angle = time / period * 2 * Math.PI
    lightPos.current.set(-80 * Math.sin(angle), 0, 80 * Math.cos(angle))

    meshPos.current.copy(meshRef.current.position)
    meshDim.current.set(rectRef.current.parameters.width, rectRef.current.parameters.height)

    // shMatRef.current.uniformsNeedUpdate = true
    shMatRef.current.needsUpdate = true

    // DEBUGING
    // /* distance */ console.log(Math.sqrt(Math.pow(camera.position.x - meshRef.current.position.x, 2) + Math.pow(camera.position.y - meshRef.current.position.y, 2) +  Math.pow(camera.position.z - meshRef.current.position.z, 2)))
    // /* scale */ console.log(meshRef.current.scale)
    // /* mesh pos */ console.log(meshRef.current.position)
    // /* rect dim */ console.log(rectRef.current.parameters.width, rectRef.current.parameters.height)
    // /* canvas size */ console.log(state.size.width, state.size.height)
    // /* camera pos */ console.log(camera.position)
    // /* camRight */ console.log(shMatRef.current.uniforms.camRight.value)
    // /* camUp */ console.log(shMatRef.current.uniforms.camUp.value)
    // /* raw camera up */ console.log(camera.up)
    // /* camDir */ console.log(cameraDir)
    // /* camZoom */ console.log(camera.zoom)
    // /* time */ console.log(state.clock.elapsedTime)
    // /* lightPos */ console.log(shMatRef.current.uniforms.lightPos.value)

    state.gl.setRenderTarget(null)
    state.gl.clear()
  })

  return (
    // 1.072 is an arbitrary constant idk man
    <mesh ref={meshRef}> 
      <planeGeometry ref={rectRef} args={[size.width * .1/(size.height * 1.072), size.height * .1/(size.height * 1.072)]}/>
      <shaderMaterial ref={shMatRef}
        uniforms={{
          depthTxt: {value: null},
          colorTxt: {value: target.current.texture},
          opticalTxt: { value: opticalTxt.current },
          atmPos: {value: props.position},
          atmR: {value: props.radius},
          meshPos: { value: meshPos.current },
          meshDim: { value: meshDim.current },
          projectionInverse: { value: camera.projectionMatrixInverse },
          modelMatrix: { value: camera.matrixWorld },
          lightPos: { value: lightPos.current }
        }}
        vertexShader={atmVert}
        fragmentShader={atmFrag}
        depthWrite={false}
        transparent
        opacity={.01}
      />
    </mesh>
  )
}


const MiniEvan = () => {
  const glb = useGLTF('planetEvan.glb')

  return (
    <primitive object={glb.scene} scale={[1.4, 1.4, 1.4]} rotation={[0, -Math.PI/2, 0]} position={[.1, -.1, -.3]}/>
  )
}


const Sun = () => {
  // spherical gerstner waves
  // https://cescg.org/wp-content/uploads/2018/04/Michelic-Real-Time-Rendering-of-Procedurally-Generated-Planets-2.pdf

  const lightRef = useRef<THREE.PointLight>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const shMatRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state) => {
    let period = 40
    let time = state.clock.elapsedTime
    let angle = time / period * 2 * Math.PI
    let pos = [-80 * Math.sin(angle), 0, 80 * Math.cos(angle)]
    meshRef.current.position.set(pos[0], pos[1], pos[2])
    lightRef.current.position.set(pos[0], pos[1], pos[2])
  })

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0, 80]} intensity={16000}/>
      <mesh ref={meshRef} position={[0, 0, 80]}>
        <sphereGeometry args={[7, 20, 20]}/>
        <shaderMaterial
          ref={shMatRef}
          uniforms={{
          }}
          vertexShader={sunVert}
          fragmentShader={sunFrag}
        />
      </mesh>
    </>
  )
}


const MyStars = () => {

  const {scene} = useThree()
  const loader = new THREE.CubeTextureLoader()
  const texture = loader.load([
      px.src,
      nx.src,
      py.src,
      ny.src,
      pz.src,
      nz.src
    ])

  scene.background = texture

  return(<></>)
}


interface simButtonProps {
  simRef: React.MutableRefObject<number>
  simState: number
  setPhysics: React.Dispatch<React.SetStateAction<number>>
}


const SimButton = (props: simButtonProps) => {
  const [buttonDisabled, setButton] = useState<boolean>(false)

  return (
    <button disabled={buttonDisabled} onClick={()=>{
      setButton(true)

      if (props.simState == 0) {
        props.setPhysics(1)
        props.simRef.current = 1
      } else {
        props.setPhysics(0)
        props.simRef.current = 0
      }

      setTimeout(() => {
        setButton(false)
      }, 1000)
    }} className={'pointer-events-auto transition-all h-[80px] w-[80px] md:h-[100px] md:w-[100px] rounded-full border px-[10px] ' + (props.simState == 1 ? 'border-green-400 bg-green-700' : 'border-red-400 bg-red-700 rotate-180')}>
      <Image src="/svgs/powerButton.svg" height={100} width={100} alt="Power button" />
    </button>
  )
}


const Greeting = () => {
  const [simState, setPhysics] = useState<number>(1)
  const simRef = useRef<number>(1)

  const handleScroll = () => {
    if (window.scrollY > window.innerHeight * .8 && simRef.current == 0) {
      setPhysics(1)
      simRef.current = 1
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {handleScroll()}, { passive: true });

    return () => {
      window.removeEventListener('scroll', () => {handleScroll()});
    };
  }, [simState]);

  const simOptions = [
    <Canvas resize={{scroll: false}}>
      <PerspectiveCamera position={[4.9, 0, 7.7]}
        makeDefault fov={50}/>
      <MyStars />
      <Sun />
      <MiniEvan/>
      <OrbitControls/>
      <Atm position={new THREE.Vector3(0, 0, 0)} radius={5}/>
    </Canvas>,
    <div className='w-[100%] h-[100%] overflow-hidden relative pointer-events-none'>
      <Image
        priority
        src={simPic.src}
        fill
        alt="Simulation picture"
        style={{objectFit: "cover"}}
        unoptimized
      />
    </div>
  ]

  return (
    <div className='flex justify-center items-center h-[80vh] bg-[#000000] relative text-white'>

      {simOptions[simState]}

      <div className={'absolute top-[5vh] md:top-[8vh] md:left-[4vw] pointer-events-none transition-opacity duration-300 ' + (simState == 0 ? 'opacity-0' : 'opacity-100')}>
        <p className='text-[20px] md:text-[2.6vw] 2xl:text-[40px] w-fit'>Hi, I'm</p>
        <p className='text-[40px] md:text-[5.2vw] 2xl:text-[80px] w-fit'>Evan Abbott</p>
      </div>
      <div className='absolute bottom-[20px] right-[20px]'>
        <SimButton simRef={simRef} simState={simState} setPhysics={setPhysics}/>
        <p className='text-center pointer-events-none'>Power <label className={simState == 1 ? 'text-red-600' : 'text-green-400'}>{simState == 1 ? " OFF" : " ON"}</label></p>
      </div>
    </div>
  )
}


export default Greeting