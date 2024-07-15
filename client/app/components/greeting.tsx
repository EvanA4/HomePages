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



const PostFX = () => {
  const { viewport, scene, camera, size } = useThree()
  const shMatRef = useRef<THREE.ShaderMaterial>(null!)

  const target = useFBO(size.width, size.height, {
    depthBuffer: true,
    depthTexture: new THREE.DepthTexture(size.width, size.height)
  })

  useFrame((state) => {
    state.gl.setRenderTarget(target)
    state.gl.render(scene, camera)
    shMatRef.current.uniforms.depthTxt.value = target.depthTexture

    state.gl.setRenderTarget(null)
  })

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]}/>
      <shaderMaterial ref={shMatRef}
        uniforms={{
          depthTxt: {value: null}
        }}
        vertexShader={atmVert}
        fragmentShader={atmFrag}
        depthWrite={false}
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
        <PostFX/>
      </Canvas>
    </div>
  )
}


export default Greeting