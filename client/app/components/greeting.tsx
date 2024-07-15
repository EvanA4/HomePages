'use client'
import React, { useEffect, useRef } from 'react'
import { Canvas, extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'


// The below four lines are normally red, idk how to fix this yet -- still works!
import planetVert from './shaders/planetVert.glsl'
import planetFrag from './shaders/planetFrag.glsl'
// import atmVert from './shaders/atmVert.glsl'
// import atmFrag from './shaders/atmFrag.glsl'
import pngTexture from '../../public/marsColors.png'
import { EffectComposer, ShaderPass, RenderPass } from 'three/examples/jsm/Addons.js'
extend({ EffectComposer, ShaderPass, RenderPass })


const atmPost = {
  uniforms: {
      depthTexture: { value: null}
  },
  vertexShader: `
    uniform sampler2D depthTexture;
    varying sampler2D vdepthTxt;
    varying vec2 vUv;

    void main () {
      vdepthTxt = depthTexture;
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }        
  `,
  fragmentShader: `
    varying sampler2D vdepthTxt;
    varying vec2 vUv;

    void main() {
      float depth = texture2D(vdepthTxt, vUv);
      gl_FragColor = vec4(depth, depth, depth, 1.0); boogie woogie
    }
  `
}


const PostFX = () => {
  const effectRef = useRef<EffectComposer>(null!)
  const shaderRef = useRef<ShaderPass>(null!)
  const { gl, size, scene, camera } = useThree()


  const [ target ] = React.useMemo(() => {
    const target = new THREE.WebGLRenderTarget(
        size.width,
        size.height,
        {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBuffer: false,
            depthBuffer: true,
            depthTexture: new THREE.DepthTexture(size.width, size.height)
        },
    );
    return [ target ];
  }, []);


  useEffect(() => {
    effectRef.current.setSize(size.width, size.height)
  }, [size])


  useFrame((state) => {
    // First pass, get the depth texture
    state.gl.setRenderTarget(target)
    state.gl.render(scene, camera)

    shaderRef.current.material.uniforms.depthTexture.value = target.depthTexture;

    // Second pass, render normal stuff
    effectRef.current.render()
  }, 1)


  return (
    <effectComposer ref={effectRef} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass attachArray="passes" ref={shaderRef} args={[atmPost]} needsSwap={false} renderToScreen ></shaderPass>
    </effectComposer>
  )
}


const MyPlanet = () => {
  const planetRef = useRef<THREE.Mesh>(null!)
  const colorMap = useLoader(THREE.TextureLoader, pngTexture.src)
  const lightDir = new THREE.Vector3(-10, 4, 10)

  return (
    <>
      <mesh ref={planetRef}>
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
      <Canvas>
        <MyPlanet/>
        <OrbitControls/>
        <PostFX/>
      </Canvas>
    </div>
  )
}


export default Greeting