'use client'
import React, { useEffect } from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { SphereGeometry, ShaderMaterial } from 'three'
import { OrbitControls } from '@react-three/drei'
extend({ SphereGeometry, ShaderMaterial })


// The below two lines are normally red, idk how to fix this yet -- still works!
import vert from './shaders/vert.glsl'
import frag from './shaders/frag.glsl'


const CoolSphere = () => {

  return (
    <mesh>
      <sphereGeometry />
      <shaderMaterial
        attach={'material'}
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
      </Canvas>
    </div>
  )
}

export default Greeting
