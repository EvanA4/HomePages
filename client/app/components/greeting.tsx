'use client'
import React, { useRef } from 'react'
import { Canvas, extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, useFBO } from '@react-three/drei'


// The below four lines are normally red, idk how to fix this yet -- still works!
import planetVert from './shaders/planetVert.glsl'
import planetFrag from './shaders/planetFrag.glsl'
import atmVert from './shaders/atmVert.glsl'
import atmFrag from './shaders/atmFrag.glsl'
import pngTexture from '../../public/marsColors.png'


interface AtmProps {
  position: THREE.Vector3
  radius: number
}


const Atm = (props: AtmProps) => {
  const { scene, camera, size } = useThree()
  const shMatRef = useRef<THREE.ShaderMaterial>(null!)
  const rectRef = useRef<THREE.PlaneGeometry>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  const meshPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const meshDim = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))

  const target = useFBO(size.width, size.height, {
    depthBuffer: true,
    depthTexture: new THREE.DepthTexture(size.width, size.height)
  })

  useFrame((state) => {
    state.gl.setRenderTarget(target)
    state.gl.render(scene, camera)

    shMatRef.current.uniforms.depthTxt.value = target.depthTexture
    
    // match post-processing mesh to camera
    let cameraDir = new THREE.Vector3()
    camera.getWorldDirection(cameraDir)
    let cameraLength = Math.sqrt(Math.pow(cameraDir.x, 2) + Math.pow(cameraDir.y, 2) +  Math.pow(cameraDir.z, 2))
    let cameraNorm = [cameraDir.x / cameraLength, cameraDir.y / cameraLength, cameraDir.z / cameraLength]
    meshRef.current.position.set(camera.position.x + cameraNorm[0] * .1, camera.position.y + cameraNorm[1] * .1, camera.position.z + cameraNorm[2] * .1)
    meshRef.current.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z)

    // set some of the uniforms
    meshPos.current.copy(meshRef.current.position)
    meshDim.current.set(rectRef.current.parameters.width, rectRef.current.parameters.height)

    // DEBUGING
    // /* distance */ console.log(Math.sqrt(Math.pow(camera.position.x - meshRef.current.position.x, 2) + Math.pow(camera.position.y - meshRef.current.position.y, 2) +  Math.pow(camera.position.z - meshRef.current.position.z, 2)))
    // /* scale */ console.log(meshRef.current.scale)
    // /* mesh pos */ console.log(meshRef.current.position)
    // /* rect dim */ console.log(rectRef.current.parameters.width, rectRef.current.parameters.height)
    // /* camera pos */ console.log(camera.position)
    // /* camRight */ console.log(shMatRef.current.uniforms.camRight.value)
    // /* camUp */ console.log(shMatRef.current.uniforms.camUp.value)
    // /* raw camera up */ console.log(camera.up)
    // /* camDir */ console.log(cameraDir)

    state.gl.setRenderTarget(null)
  })

  return (
    // Wanna know about this .6515 constant? See more at the bottom of the file.
    <mesh ref={meshRef}> 
      <planeGeometry ref={rectRef} args={[size.width * .1/(size.height * .6515), size.height * .1/(size.height * .6515)]}/>
      <shaderMaterial ref={shMatRef}
        uniforms={{
          depthTxt: {value: null},
          atmPos: {value: props.position},
          atmR: {value: props.radius},
          camNear: {value: camera.near},
          camFar: {value: camera.far},
          meshPos: { value: meshPos.current },
          meshDim: { value: meshDim.current }
        }}
        vertexShader={atmVert}
        fragmentShader={atmFrag}
        depthWrite={false}
        transparent
      />
    </mesh>
  )
}


const MyPlanet = () => {
  const planetRef = useRef<THREE.Mesh>(null!)
  const colorMap = useLoader(THREE.TextureLoader, pngTexture.src)
  const lightDir = new THREE.Vector3(-10, 4, 10)

  return (
    <>
      <mesh ref={planetRef} position={[0, 0, -1]}>
        <sphereGeometry args={[1, 32, 32]}/>
        <shaderMaterial
          uniforms={{
            colorMap: { value: colorMap },
            lightDir: { value: lightDir}
          }}
          vertexShader={planetVert}
          fragmentShader={planetFrag}
        />
      </mesh>
    </>
  );
}


const Greeting = () => {

  return (
    <div className='flex justify-center items-center h-[80vh] bg-[#000000]'>
      <Canvas camera={{position: [0, 0, 1]}}>
        <MyPlanet/>
        <OrbitControls/>
        <Atm position={new THREE.Vector3(0, 0, -1)} radius={1.5}/>
      </Canvas>
    </div>
  )
}


export default Greeting

/*

So what's the deal with this constant?
Apparently changing the size of the canvas height requires the canvas to be scaled differently.
I noticed that the scaling was inversely proportional to the canvas size. So, I collected a few points of data:
canvas height, constant, constant/height
358.4, 233, .6501
341.75, 222, .6496
320, 208, .65
I'd love to figure out how to derive this constant, but this will have to work for now.

*/