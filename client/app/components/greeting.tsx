'use client'
import React from 'react'
import { Canvas, extend, useLoader } from '@react-three/fiber'
import { SphereGeometry, ShaderMaterial, TextureLoader, Vector3 } from 'three'
import { OrbitControls } from '@react-three/drei'
extend({ SphereGeometry, ShaderMaterial, TextureLoader })


// The below four lines are normally red, idk how to fix this yet -- still works!
import planetVert from './shaders/planetVert.glsl'
import planetFrag from './shaders/planetFrag.glsl'
import atmVert from './shaders/atmVert.glsl'
import atmFrag from './shaders/atmFrag.glsl'
import pngTexture from '../../public/marsColors.png'


const MyPlanet = () => {
  const colorMap = useLoader(TextureLoader, pngTexture.src)
  const lightDir = new Vector3(-10, 4, 10)

  return (
    <>
      {/* The raw planet texture */}
      <mesh>
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

      {/* The fancy atmosphere */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]}/>
        <shaderMaterial
          uniforms={{
            lightDir: { value: lightDir}
          }}
          vertexShader={atmVert}
          fragmentShader={atmFrag}
          transparent={true}
        />
      </mesh>
    </>
  );
}


const Greeting = () => {

  return (
    <div className='flex justify-center items-center h-[80vh] bg-[#000000]'>
      <Canvas>
        <mesh>
          <MyPlanet/>
        </mesh>
        <OrbitControls/>
      </Canvas>
    </div>
  )
}


export default Greeting