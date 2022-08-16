import { Canvas, useFrame } from "@react-three/fiber";
import { useSpring, animated, easings } from "@react-spring/three";
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Effects as EffectsComposer } from '@react-three/drei';
import { extend, useThree } from '@react-three/fiber';
import { UnrealBloomPass } from 'three-stdlib'
import { gsap } from 'gsap';
import SimplexNoise from 'simplex-noise';
import { Vector3 } from "three";

extend({ UnrealBloomPass });

const RealParticles = () => {
  const mesh = useRef();
  const light = useRef();
  let xyz = 0;
  let grid = [60,60,60];
  const DAMPING = 0.005;
  const scale = 1;
  const STEP = 1 * scale;
  const tick = 0.1;
  const FREQUENCY = 0.001 / scale;
  const AMPLITUDE = 5;
  const simplexA = new SimplexNoise();
  const simplexB = new SimplexNoise();

  const ArrowRef = React.useRef();
  console.log(ArrowRef)

  const gridtest = grid[0] * grid[1] * grid[2];

  console.log("particle number:", gridtest)

  const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
      () => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = 1;
        controls.maxDistance = 500;
        camera.position.set(0, 0, 20);
        camera.lookAt(new THREE.Vector3(0,0,0));
        return () => {
          controls.dispose();
        };
      },
      [camera, gl]
    );
    return null;
  };

 const ParticleSystemTest = () => {
  const [coords, sizes, colors] = useMemo(() => {
    const initialCoords = [];
    const initialSizes = [];
    const initialColors = [];
    for(let iO = 0; iO < grid[0]; iO++) {
      for(let xO = 0; xO < grid[1]; xO++) {
         for(let yO = 0;yO < grid[2]; yO++) {
          initialCoords.push(Math.random() * 200 - 100);
          initialCoords.push(Math.random() * 200 - 100);
          initialCoords.push(Math.random() * 200 - 100);
          initialSizes.push(Math.ceil(Math.random() * 15));
          let newC = new THREE.Color("rgb(" + Math.floor(Math.random() * 50 + 100) + "," + Math.floor(Math.random() * 50 + 100) + "," + 255 + ")");
          initialColors.push(newC.r, newC.g, newC.b);
         }
      }
    }

    const coords = new Float32Array(initialCoords);
    const sizes = new Float32Array(initialSizes);
    const colors = new Float32Array(initialColors);
    //console.log(coords, sizes, colors)
    return [coords, sizes, colors]
  }, [])

  useEffect(
    () => {
      bufgeom.current.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(coords, 3)
      );
      bufgeom.current.setAttribute(
        "size",
        new THREE.Float32BufferAttribute(sizes, 1)
      );
      bufgeom.current.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );
      //console.log(bufgeom.current.attributes.position.array)
    },
    []
  );

  const geom = useRef();
  const bufgeom = useRef();
  useFrame((state) => {
    //geom.current.material.uniforms.time.value = state.clock.getElapsedTime();
    let pos = bufgeom.current.attributes.position.array;
    pos.forEach((item, index) => {
      //bufgeom.current.attributes.position.array[index] = bufgeom.current.attributes.position.array[index] + 0.1;
    });

    console.log()
    //geom.current.geometry.verticesNeedUpdate = true;
    bufgeom.current.attributes.position.needsUpdate = true;

  })
  return (
    <points ref={geom} position={[0, 0, 0]} /* rotation={[-Math.PI / 4, 0, Math.PI / 6]} */>
      <bufferGeometry ref={bufgeom} attach="geometry">
        <bufferAttribute attachObject={["attributes", "position"]} count={coords.length / 3} array={coords}/>
        <bufferAttribute attachObject={["attributes", "size"]} count={sizes.length} array={sizes} />
{/*         <bufferAttribute attachObject={["attributes", "color"]} count={colors.length} array={colors} />
 */}      </bufferGeometry>
      <pointsMaterial size={1}/>
        <shaderMaterial
        attach='material'
        blending={THREE.AdditiveBlending}
        depthTest={false}
        //transparent: true,
      vertexColors={true}
      vertexShader={`
      attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = size * ( 300.0 / -mvPosition.z );
          gl_Position = projectionMatrix * mvPosition;
        }`}
      fragmentShader={`
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          vec3 whiteColor = vec3(1,1,1);
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = 0.5 - length(xy)/0.5;
          vec3 mixColor = mix(vColor, whiteColor,ll);
          //gl_FragColor = vec4(vColor, smoothstep(0.0,1.0,ll));
          gl_FragColor = vec4(mixColor, smoothstep(0.0, 1.0,ll));
        }
      `
    }
    />
    </points>
  )
 }

  const divStyle = {
    width:"100vw",
    height:"100vh",
  }

  return (
    <Canvas style={divStyle} dpr={window.devicePixelRatio}>
      <CameraController />
      <arrowHelper/>
      <ParticleSystemTest />
    </Canvas>
  );
}

export default RealParticles;