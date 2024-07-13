'use client'
import React, { useEffect } from 'react'
import { Canvas, extend, useLoader } from '@react-three/fiber'
import { SphereGeometry, ShaderMaterial, TextureLoader } from 'three'
import { OrbitControls, Stars } from '@react-three/drei'
extend({ SphereGeometry, ShaderMaterial, TextureLoader })


// The below two lines are normally red, idk how to fix this yet -- still works!
import vert from './shaders/vert.glsl'
import frag from './shaders/frag.glsl'

import pngTexture from './marsColors.png'

const CoolSphere = () => {
  const colorMap = useLoader(TextureLoader, pngTexture.src)

  return (
    <mesh>
      <sphereGeometry />
      <shaderMaterial
        uniforms={{
          colorMap: { value: colorMap }
        }}
        vertexShader={vert}
        fragmentShader={frag}
      />
    </mesh>
  );
}


const Greeting = () => {
  useEffect(() => {
    console.log(vert)
  }, [])

  return (
    <div className='flex justify-center items-center h-[80vh] bg-[#000000]'>
      <Canvas>
        <mesh>
          <CoolSphere />
        </mesh>
        <OrbitControls/>
        <Stars speed={0}/>
      </Canvas>
    </div>
  )
}

export default Greeting
