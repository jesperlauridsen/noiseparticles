import { Canvas, useFrame } from "@react-three/fiber";
import { useSpring, animated, easings } from "@react-spring/three";
import * as THREE from 'three';
import React, { useMemo, useState, useEffect } from 'react';
import { Effects as EffectsComposer } from '@react-three/drei';
import { extend, useThree } from '@react-three/fiber';
import { UnrealBloomPass } from 'three-stdlib'
import { gsap } from 'gsap';
import SimplexNoise from 'simplex-noise';


extend({ UnrealBloomPass });

export const Effects = (hovered) => {
  
  const { size, scene, camera } = useThree();
  const bloomRef = 	React.useRef();
 
  //console.log(bloomRef)

  const aspect = useMemo(
    () => new THREE.Vector2(size.width, size.height),
    [size]
  );

  useEffect(() => {
		if(bloomRef.current.strength === 0) {
     gsap.to(bloomRef.current,  {strength:0.8, duration:0.2, ease:gsap.easeInOut, overwrite:true})
    }
    else {
    gsap.to(bloomRef.current,  {strength:0, duration:0.2, ease:gsap.easeInOut,overwrite:true})
    }
	}, [hovered]);
 
  return (
    <EffectsComposer
      multisamping={8}
      renderIndex={1}
      disableGamma
      disableRenderPass
    >
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass ref={bloomRef} attachArray="passes" radius={0.5} strength={0.8} args={[aspect, 0.4, 1, 0]} />
    </EffectsComposer>
  );
};

function Box(props) {
  const meshRef = React.useRef();
  useEffect(() => {
    //gsap.to(meshRef.current.rotation, {x:Math.PI / 4,y:Math.PI / 4,z:Math.PI, ease:easings.easeInOutQuart, duration:1, repeat:-1, yoyo:true, overwrite:true});
    //gsap.to(meshRef.current.position, {x:1, ease:easings.easeInOutQuart, duration:1, repeat:-1, yoyo:true,overwrite:true});
  },[props.hovered])

  return (
    <animated.mesh ref={meshRef}
    onClick={() => {console.log("YEP", props.hovered); props.setHover(!props.hovered);}}
    //onPointerEnter={() => props.setHover(true)}
    //onPointerOut={() => props.setHover(false)} 
    position={[0,2,0]} 
    rotation={[Math.PI / 4, Math.PI / 4, 0]}>
      <boxGeometry ref={meshRef} args={[1, 2, 1]} />
      <meshStandardMaterial color={props.hovered ? "hotpink" : "orange"} />
    </animated.mesh>
  );
}

function MovingBox() {
  const meshRef = React.useRef();
  useEffect(() => {
    gsap.to(meshRef.current.rotation, {x:Math.PI / 4,y:Math.PI / 4,z:Math.PI, ease:easings.easeInOutQuart, duration:1, repeat:-1, yoyo:true, overwrite:true});
    gsap.to(meshRef.current.position, {x:1, ease:easings.easeInOutQuart, duration:1, repeat:-1, yoyo:true,overwrite:true});
  },[])

  return (
    <animated.mesh ref={meshRef}
    position={[-1,-2,0]} 
    rotation={[Math.PI / 4, Math.PI / 4, 0]}>
      <boxGeometry ref={meshRef} args={[1, 2, 1]} />
      <meshStandardMaterial color={'blue'} />
    </animated.mesh>
  );
}

export default function React3dTest() {
  const [hovered, setHover] = useState(false);
  const boxMesh = React.useRef();

  const divStyle = {
    width:"100vw",
    height:"100vh",
  }


  return (
    <div style={divStyle}>
      <Canvas  dpr={window.devicePixelRatio}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box innerRef={boxMesh} hovered={hovered} setHover={setHover} />
          <MovingBox />

          <Effects active={hovered} />
      </Canvas>
    </div>
  );
}