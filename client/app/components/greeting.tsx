'use client'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, PerspectiveCamera, useFBO } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'


// The below four lines are normally red, idk how to fix this yet -- still works!
import planetVert from './shaders/planetVert.glsl'
import planetFrag from './shaders/planetFrag.glsl'
import atmVert from './shaders/atmVert.glsl'
import atmFrag from './shaders/atmFrag.glsl'
import pngTexture from '../../public/marsColors.png'
import { list } from 'postcss'


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
    state.gl
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
    let period = 60
    let time = state.clock.elapsedTime
    let angle = time / period * 2 * Math.PI
    shMatRef.current.uniforms.lightPos.value.set(-80 * Math.sin(angle), 0, 80 * Math.cos(angle))

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
    // /* camZoom */ console.log(camera.zoom)

    state.gl.setRenderTarget(null)
  })

  return (
    // 1.072 is an arbitrary constant idk man
    <mesh ref={meshRef}> 
      <planeGeometry ref={rectRef} args={[size.width * .1/(size.height * 1.072), size.height * .1/(size.height * 1.072)]}/>
      <shaderMaterial ref={shMatRef}
        uniforms={{
          depthTxt: {value: null},
          colorTxt: {value: target.texture},
          atmPos: {value: props.position},
          atmR: {value: props.radius},
          meshPos: { value: meshPos.current },
          meshDim: { value: meshDim.current },
          projectionInverse: { value: camera.projectionMatrixInverse },
          modelMatrix: { value: camera.matrixWorld },
          lightPos: { value: new THREE.Vector3(0, 0, 80) }
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
      <mesh ref={planetRef} position={[0, 0, 0]}>
        <sphereGeometry args={[7, 32, 32]}/>
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


const MiniEvan = () => {
  const [model, setNodes] = useState<THREE.Mesh>()

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("cheaperMiniEvanMatte.glb", async (gltf) => {
      const nodes = await gltf.parser.getDependencies("node");
      const materials = await gltf.parser.getDependencies("materials");
      setNodes(nodes[0])
    })
  }, [])

  return (
    <mesh
      scale={[1, 1, 1]}
      rotation={[0, 1.5 * Math.PI, 0]}
      position={[0, -.2, 0]}
      geometry={model ? model.geometry : undefined}
      material={model ? model.material : undefined}>
    </mesh>
  )
}


const Sun = () => {
  const lightRef = useRef<THREE.PointLight>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    let period = 60
    let time = state.clock.elapsedTime
    let angle = time / period * 2 * Math.PI
    let pos = [-80 * Math.sin(angle), 0, 80 * Math.cos(angle)]
    meshRef.current.position.set(pos[0], pos[1], pos[2])
    lightRef.current.position.set(pos[0], pos[1], pos[2])
  })

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0, 80]} intensity={24000}/>
      <mesh ref={meshRef} position={[0, 0, 80]}>
        <sphereGeometry args={[7, 32, 32]}/>
        <meshBasicMaterial
          color={[255, 255, 0]}
        />
      </mesh>
    </>
  )
}


const Greeting = () => {

  return (
    <div className='flex justify-center items-center h-[80vh] bg-[#000000]'>
      {/* <Canvas camera={{position: [0, 0, 1]}}> */}
      <Canvas >
        <PerspectiveCamera position={[0, 0, 5]} makeDefault />
        <Sun/>
        <MiniEvan/>
        <OrbitControls/>
        <Atm position={new THREE.Vector3(0, 0, 0)} radius={5}/>
      </Canvas>
    </div>
  )
}


export default Greeting