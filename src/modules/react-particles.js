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
  let grid = [40,40,40];
  const DAMPING = 0.005;
  const scale = 1;
  const STEP = 1 * scale;
  const tick = 0.1;
  const FREQUENCY = 0.001 / scale;
  const AMPLITUDE = 5;
  const simplexA = new SimplexNoise();
  const simplexB = new SimplexNoise();

  const ROW = 50;
  const COL = 50;
  const NUM = ROW * COL;

  const ArrowRef = React.useRef();
  console.log(ArrowRef)

  const gridtest = grid[0] * grid[1] * grid[2];

  const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
      () => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = 1;
        controls.maxDistance = 500;
        camera.position.set(0, 0, 200);
        camera.lookAt(new THREE.Vector3(0,0,0));
        return () => {
          controls.dispose();
        };
      },
      [camera, gl]
    );
    return null;
  };

 const ParticleSystemTest = (pointCount) => {
  console.log(pointCount)
  const [coords, sizes] = useMemo(() => {
    const initialCoords = [];
    const initialSizes = [];
    let i = 0
    for (let y = 0; y < ROW; y += 1) {
      for (let x = 0; x < COL; x += 1) {
        initialCoords.push(x);
        initialCoords.push(y);
        initialCoords.push(i);
        initialSizes.push(Math.random() < 0.03 ? 15 : 6);
        i++;
      }
    }

    const coords = new Float32Array(initialCoords);
    const sizes = new Float32Array(initialSizes);
    return [coords, sizes]
  }, [pointCount])

  useEffect(
    () => {
     console.log(geom);
    },
    []
  );

  const geom = useRef();
  console.log(geom);
  useFrame((state) => {
    //geom.current.material.uniforms.time.value = state.clock.getElapsedTime();
    geom.current.geometry.verticesNeedUpdate = true;
  })
  return (
    <points ref={geom} position={[0, 0, 0]} /* rotation={[-Math.PI / 4, 0, Math.PI / 6]} */>
      <bufferGeometry>
        <bufferAttribute attachObject={["attributes", "position"]} count={coords.length / 3} array={coords} itemSize={3} />
        <bufferAttribute attachObject={["attributes", "size"]} count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
     <DotMaterial />
    </points>
  )
 }

 const DotMaterial = () => {
  let vertex = `
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = 5.0 * ( 300.0 / -mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;
    }`;

  let fragment = `
    uniform sampler2D pointTexture;
    void main() {
      vec3 whiteColor = vec3(1,1,1);
      vec3 vColor = vec3(0.5,0.3,0.7);
      vec2 xy = gl_PointCoord.xy - vec2(0.5);
      float ll = 1.0 - length(xy)/0.5;
      vec3 mixColor = mix(vColor, whiteColor,ll);
      //gl_FragColor = vec4(vColor, smoothstep(0.0,1.0,ll));
      gl_FragColor = vec4(mixColor, smoothstep(0.0, 1.0,ll));
    }`;
  return (
    <shaderMaterial
      fragmentShader={fragment}
      vertexShader={vertex}
    />
    )
 }

 const Meshes = () => {
    // Generate some random positions, speed factors and timings
  let particles = useMemo(() => {
    const temp = [];
    let grid = [20,20,20];
    for(let iO = 0; iO < grid[0]; iO++) {
      for(let xO = 0; xO < grid[1]; xO++) {
         for(let yO = 0;yO < grid[2]; yO++) {
          let time = Math.floor(Math.random() * 100000);
          let speed = Math.random() * 20 - 10;
          let aAngle = Math.random() * 360;
          let bAngle = Math.random() * 360;
          let x = 0; //Math.random() * 300 - 150;
          let y = 0; //Math.random() * 300 - 150;
          let z = 0; //Math.random() * 300 - 150;
          let vx = x;
          let vy = y;
          let vz = z;
          temp.push({ time, speed, x, y, z, vx, vy, vz, aAngle, bAngle });
        }
      }
    }
    return temp;
  }, []);

  console.log(particles)

  let dummy = useMemo(() => new THREE.Object3D(), []);
  const pointZero = new THREE.Vector3(0,0,0);

    useFrame(() => {
      // Run through the randomized data to calculate some movement
      particles.forEach((particle, index) => {
      //dummy.position.set(particle.x,particle.y,particle.z);
      particle.aAngle = simplexA.noise3D(particle.vx * FREQUENCY, particle.vy * FREQUENCY, xyz/100) * AMPLITUDE * particle.speed;
      particle.bAngle = simplexB.noise3D(particle.vy * FREQUENCY, particle.vz * FREQUENCY, xyz/100) * AMPLITUDE * particle.speed;

      //https://stackoverflow.com/questions/30011741/3d-vector-defined-by-2-angles
        
      /*    
      vx = Math.cos(aAngle) * Math.cos(bAngle) * STEP;
      vz = Math.sin(aAngle) * Math.cos(bAngle) * STEP;
      vy = Math.sin(bAngle) * STEP;
      */

     // if(dummy.distanceTo(pointZe))

      if(index === 0) {
      }

      particle.vx += Math.cos(particle.aAngle) * Math.cos(particle.bAngle) * STEP;
      particle.vy += Math.sin(particle.aAngle) * Math.cos(particle.bAngle) * STEP;
      particle.vz += Math.sin(particle.bAngle) * STEP;


     /*  let vec = new THREE.Vector3(Math.sin(aAngle), Math.sin(aAngle), z); */
      //console.log(vec);
      //dummy.lookAt(vec);
      //dummy.position.addScaledVector(vec, 0.01)
      
      dummy.position.x = particle.vx;
      //particle.x = dummy.position.x;

      dummy.position.y = particle.vy;
      //particle.y = dummy.position.y;
     
      dummy.position.z = particle.vz;

      const test = new THREE.Vector3(dummy.position.x, dummy.position.y, dummy.position.z);
        if(test.distanceTo(pointZero) > 600) {
          dummy.position.x = 0; // Math.random() * 300 - 150;
          dummy.position.y = 0; //Math.random() * 300 - 150;
          dummy.position.z = 0; //Math.random() * 300 - 150;
          particle.vx = dummy.position.x;
          particle.vy = dummy.position.y;
          particle.vz = dummy.position.z;
        }

      if(index === 0) {
        //console.log(particle.vx);
        //console.log(vec)
      }
      /* vx += Math.cos(aAngle) * STEP;
      vy += Math.sin(aAngle) * STEP;
      if(index === 0) {
        console.log(aAngle);
      }
      let newX = x + vx;
      let newY = y + vy;
      dummy.position.set(newX, newY, z); */
      dummy.scale.set(1,1,1);
      dummy.updateMatrix();
      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(index, dummy.matrix);
      });

      mesh.current.instanceMatrix.needsUpdate = true;
      xyz = xyz + 0.05;
    });
    
    return (
      <instancedMesh ref={mesh} args={[null, null, gridtest]}>
        <boxGeometry args={[1,1,1]} />
        <arrowHelper ref={ArrowRef} />
        <meshPhongMaterial color="#050505" />
      </instancedMesh>
    )
  }

  const divStyle = {
    width:"100vw",
    height:"100vh",
  }

  return (
    <Canvas style={divStyle} dpr={window.devicePixelRatio}>
      <CameraController />
{/*       <pointLight position={[0,0,200]} ref={light} distance={500} intensity={8} color="lightblue" />
 */}    {/* <Meshes /> */}
        <ParticleSystemTest pointCount={500} />
    </Canvas>
  );
}

export default RealParticles;