import { Canvas, useFrame } from "@react-three/fiber";
import { useSpring, animated, easings } from "@react-spring/three";
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import React, { useMemo, useState, useEffect, useRef, useContext } from 'react';
import { extend, useThree } from '@react-three/fiber';
import { UnrealBloomPass } from 'three-stdlib'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { gsap } from 'gsap';
import SimplexNoise from 'simplex-noise';
import { Vector3 } from "three";

extend({ UnrealBloomPass });

const RealParticles = () => {
  const [STEP, setSTEP] = useState(2);
  const [FREQUENCY, setFREQUENCY] = useState(0.0015);
  const [AMPLITUDE, setAMPLITUDE] = useState(5);

  let xyz = 0;
  const pN = 60000;
/*   let STEP = 2;
  let FREQUENCY = 0.0015;
  let AMPLITUDE = 5; */
  const simplexA = new SimplexNoise();
  const simplexB = new SimplexNoise();
  let controls;
  const ArrowRef = React.useRef();
  console.log(ArrowRef)

  const maxDecay = 1000;
  const gridSize = 500;

  const particles = [];
	
  let Raytracing;

  console.log("particle number:", pN)

/*   const DisplayControls = () => {
    return (<div id="controlsDiv">
      <label>STEP</label><input type="range" min="0" max="5" step="0.01" value={STEP} className="slider" onChange={ e => setSliderStep(e.target.value)} id="myRange"></input>
      <label>FREQUENCY</label><input type="range" min="0" max="2" step="0.001" value={FREQUENCY} className="slider" onChange={ e => setSliderFrequency(e.target.value)} id="myRange"></input>
      <label>AMPLITUDE</label><input type="range" min="0" max="20" step="0.1" value={AMPLITUDE} className="slider" onChange={ e => setSliderAmplitude(e.target.value)} id="myRange"></input>
    </div>)
  } */

  const setSliderStep = (n) => {
    setSTEP(n);
  }
  const setSliderFrequency = (n) => {
    setFREQUENCY(n);
  }
  const setSliderAmplitude = (n) => {
    setAMPLITUDE(n);
  }

  const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
      () => {
        controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = 1;
        controls.maxDistance = 500;
        camera.position.set(0, 0, 500);
        camera.lookAt(new THREE.Vector3(0,0,0));
        controls.target = new THREE.Vector3(0,0,0)
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.5;
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
    for(let c = 0; c < pN; c++) {
          initialCoords.push(Math.random() * gridSize - gridSize/2);
          initialCoords.push(Math.random() * gridSize - gridSize/2);
          initialCoords.push(Math.random() * gridSize - gridSize/2);
          let newSize = Math.floor(Math.random() * 15 + 5)
          initialSizes.push(Math.floor(Math.random() * 15 + 5));
          let newC = new THREE.Color("rgb(" + Math.floor(Math.random() * 50 + 100) + "," + Math.floor(Math.random() * 50 + 100) + "," + 255 + ")");
          initialColors.push(newC.r, newC.g, newC.b);
          const obj = {
            time: Math.floor(Math.random() * 100000),
            speed: 2,//Math.random() * 10,
            aAngle: Math.random() * 360,
            bAngle: Math.random() * 360,
            decay:Math.random() * maxDecay,
            newborn:false,
            newBornSize: newSize,
          };
          particles.push(obj);
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

  const pointZero = new THREE.Vector3(0,0,0);
  const geom = useRef();
  const bufgeom = useRef();
  useFrame((state) => {
    controls.update();
    //geom.current.material.uniforms.time.value = state.clock.getElapsedTime();
    let position = bufgeom.current.attributes.position.array;
    let size = bufgeom.current.attributes.size.array;
    let color = bufgeom.current.attributes.color.array;

    particles.forEach((item, index) => {
        /* position[index] = position[index] + Math.random() - 0.5;
        position[index + 1] = position[index + 1] + Math.random() - 0.5;
        position[index + 2] = position[index + 2] + Math.random() - 0.5; */
          particles[index].aAngle = simplexA.noise3D(position[index * 3] * FREQUENCY, position[index * 3 + 1] * FREQUENCY, xyz/100) * AMPLITUDE * particles[index].speed;
          particles[index].bAngle = simplexB.noise3D(position[index * 3 + 1] * FREQUENCY, position[index  * 3 + 2] * FREQUENCY, xyz/100) * AMPLITUDE * particles[index].speed;
        
          position[index * 3] += Math.cos(particles[index].aAngle) * Math.cos(particles[index].bAngle) * STEP;
          position[index * 3 + 1] += Math.sin(particles[index].aAngle) * Math.cos(particles[index].bAngle) * STEP;
          position[index  * 3 + 2] += Math.sin(particles[index].bAngle) * STEP;
          
          let newC = new THREE.Vector3(Math.cos(particles[index].aAngle) * Math.cos(particles[index].bAngle),
          Math.sin(particles[index].aAngle) * Math.cos(particles[index].bAngle),
          Math.sin(particles[index].bAngle)
          ).normalize()
           color[index * 3] = newC.x / 5;
          color[index * 3 + 1] = newC.y / 5;
          color[index * 3 + 2] = newC.z / 5;

          particles[index].decay -= Math.random() * 5;
          if(index === 0) {
            //console.log(colz.x);
          }
          if(particles[index].newborn === true) {
            size[index] += 1;
            if(size[index] > particles[index].newBornSize) {
              particles[index].newborn = false;
            }
          }
          else {
            if(particles[index].decay < 20)
            size[index] -= 1;
          }
          /* if(Raytracing) {
            if(Raytracing.distanceTo(new THREE.Vector3(position[index * 3], position[index * 3 + 1], position[index  * 3 + 2])) < 20) {
              if(size[index] < 50) {
                size[index] += 5;
              }
            }
            else {
              if(size[index] > particles[index].newBornSize) {
                size[index] -= 1;
              }
            }
          } */
          //const test = new THREE.Vector3(position[index * 3], position[index * 3 + 1], position[index  * 3 + 2]);
        /* if(test.distanceTo(pointZero) > gridSize) {
          position[index * 3] = Math.random() * gridSize - gridSize/2;
          position[index * 3 + 1] = Math.random() * gridSize - gridSize/2;
          position[index  * 3 + 2] = Math.random() * gridSize - gridSize/2;

        } */
        if(size[index] < 0) {
          position[index * 3] = Math.random() * gridSize - gridSize/2;
          position[index * 3 + 1] = Math.random() * gridSize - gridSize/2;
          position[index  * 3 + 2] = Math.random() * gridSize - gridSize/2;
          particles[index].newborn = true;
          particles[index].decay = Math.random() * maxDecay/2 + maxDecay/2;
        }
      //<bufgeom.current.attributes.size.array[index] = bufgeom.current.attributes.size.array[index] + (Math.random() - 0.5);
    });
    //geom.current.geometry.verticesNeedUpdate = true;
    bufgeom.current.attributes.position.needsUpdate = true;
    bufgeom.current.attributes.size.needsUpdate = true;
    bufgeom.current.attributes.color.needsUpdate = true;


    xyz = xyz + 0.05;
  })
  
  const onPointerOver = (e) => {
    Raytracing = (e.point)
  }

  return (
    <points /* onPointerOver={onPointerOver} */ ref={geom} position={[0, 0, 0]} /* rotation={[-Math.PI / 4, 0, Math.PI / 6]} */>
      <bufferGeometry ref={bufgeom} attach="geometry">
        <bufferAttribute attachObject={["attributes", "position"]} count={coords.length / 3} array={coords}/>
        <bufferAttribute attachObject={["attributes", "size"]} count={sizes.length} array={sizes} />
        <bufferAttribute attachObject={["attributes", "color"]} count={colors.length} array={colors} />
      </bufferGeometry>
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

  const styles = {
    width:"100vw",
    height:"100vh",
    position:"absolute",
    zIndex:"-1",
    top:"0px",
    left:"0px",
    mixBlendMode: "color",
    PointerEvent:"none",
    backgroundImage: "linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)",
  }

  const Effects = () => {
    
    const height = 1500;
    const width = 1500;

    return (
      <EffectComposer autoclear={false}>
        {/* <renderPass attachArray="passes" scene={scene} camera={camera} /> */}
        {/*<unrealBloomPass attachArray="passes" radius={0.5} strength={0.8} args={[aspect, 0.4, 1, 0]} /> */}
        {/* <Noise opacity={0.5} /> */}
        <DepthOfField focusDistance={100} focalLength={500} bokehScale={5}/>
        {/* <unrealBloomPass attachArray="passes" radius={0.5} strength={0.8} args={[new THREE.Vector2(width, height), 0.4, 1, 0]} /> */}
        <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={1} />
      </EffectComposer>
    )
  }

  return (
    <>
    <Canvas style={divStyle} dpr={window.devicePixelRatio}>
      <CameraController />
{/*       <arrowHelper/>
 */}      <ParticleSystemTest />
      <Effects />
    </Canvas>
    <div style={styles}></div>
{/*     <DisplayControls />
 */}    </>
  );
}

export default RealParticles;