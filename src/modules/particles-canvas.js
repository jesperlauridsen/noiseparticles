import React, { useMemo, useState, useEffect, useRef } from "react";
import simplexNoise from "simplex-noise";

const Particles2D = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);

  let context;
  let canvas;
  let z = 0;
  let height;
  let width;
  let animationFrame;
  const simplex = new simplexNoise();
  let particles = [];
  const particleNumber = 1000;
  const DAMPING = 0.005;
  const scale = 1;
  const STEP = 1 * scale;
  const tick = 0.1;
  const FREQUENCY = 0.001 / scale;
  const AMPLITUDE = 5;

  const divStyle = {
    width: "100%",
    height: "100%",
  };

/*   const clrs = {
    red: '#da3900',
    blue: '#e1e9ee',
    gray: ['#262626', '#757575', '#e9e9e9'],
    white: '#ffffff',
  }; */

  const center = {};

  useEffect(() => {
    canvas = canvasRef.current;
    context = canvasRef.current.getContext("2d");
    height = (canvas.width = document.body.clientWidth);
    width = (canvas.height = document.body.clientHeight);
    center.x =  canvas.width / 2;
    center.y = canvas.height/ 2;
    center.size = 25;
    console.log(context);
    particles = [];
    for (let i = 0; i < particleNumber; i++) {
      particles.push({
        n:i,
        angle: Math.random() * 360,
        x:0, //Math.floor(Math.random() *  document.body.clientWidth),
        y:0, //Math.floor(Math.random() *  document.body.clientHeight),
        size:Math.random() * 10 + 5,
        speed: Math.random() * 10 - 5,
        vx: 0,
        vy: 0,
        decay:Math.floor(Math.random() * 1000 + 500),
        color: '#da3900',
      });
    }
    animate();
    return () => {
        cancelAnimationFrame(animationFrame);
        setIsRunning(false);  
        console.log("yay");
    }
  }, []);

  function moveParticle(particle, i) {
    let cX = canvas.width / 2;
    let cY = canvas.height / 2;
    if(Math.hypot(cX-particle.x, cY-particle.y) > 500 || particle.decay < 0) {
      particle.x = cX;
      particle.y = cY;
      particle.decay = Math.floor(Math.random() * 1000 + 500);
    }
    particle.decay += Math.floor(Math.random() * 25);
    // Calculate direction from noise
    const angle = simplex.noise3D(particle.x * FREQUENCY, particle.y * FREQUENCY, z/100) * AMPLITUDE * particle.speed;

    if(i === 0) {
      console.log(angle)
    }

    // Update the velocity of the particle
    // based on the direction
    particle.vx += Math.cos(angle) * STEP;
    particle.vy += Math.sin(angle) * STEP;

    
    // Move the particle
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Use damping to slow down the particle (think friction)
    particle.vx *= DAMPING;
    particle.vy *= DAMPING;

    //particle.line.push([particle.x, particle.y]);
  }

  function drawParticle(particle, center) {
    let cX = canvas.width / 2;
    let cY = canvas.height / 2;
    var gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
    let color = "rgba(255,255,255," + Number(1 - Math.hypot(cX-particle.x, cY-particle.y) / 500) + ")";
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI, true);
    context.fill();
  }

  function animate() {
    console.log("yay run")
    let context = canvas.getContext("2d");
    height = (canvas.width = document.body.clientWidth);
    width = (canvas.height = document.body.clientHeight);
    z = z + 0.01;
    drawParticle(center);

    //context.beginPath();
    //context.globalCompositeOperation = "luminosity";
    //context.rect(0, 0, width *2, height);
    //context.fillStyle = "rgba(0,0,0,0.5)";
    //context.fill();
    //context.closePath();
    //context.globalAlpha = 1;
    context.globalCompositeOperation = "lighter";
    //context.fillStyle = clrs.gray[0];
    //context.fillRect(0, 0, width, height);
    //context.fillStyle = "black";

    /* const gridSize = [30, 12];
    const padding = height * 0.15;
    const tileSize = (width - padding * 2) / gridSize[0];
    const length = tileSize * 0.65;
    const thickness = 2; //tileSize * 0.1; */
    //const time = Math.sin(z * 2 * Math.PI);

/*     for (let x = 0; x < gridSize[0]; x++) {
      for (let y = 0; y < gridSize[1]; y++) {
        // get a 0..1 UV coordinate
        const u = gridSize[0] <= 1 ? 0.5 : x / (gridSize[0] - 1);
        const v = gridSize[1] <= 1 ? 0.5 : y / (gridSize[1] - 1);

       const t = {
          x: lerp(padding, width - padding, u),
          y: lerp(padding, height - padding, v),
        }; 

        // scale to dimensions with a border padding

        // Draw
        context.save();

        //context.fillRect(canvas.width/30 * x, canvas.height/12 * y, 5, 5);

       const rotation = simplex.noise3D(x / gridSize[0], y / gridSize[1], tick * z) * Math.PI;
        // Rotate in place
        context.translate(t.x, t.y);
        context.rotate(rotation);
        context.translate(-t.x, -t.y);

        // Draw the line
         context.fillRect(t.x, t.y - thickness, length, thickness);
        context.restore();
      }
    } */

    particles.forEach((particle, i) => {
      moveParticle(particle, i);
      drawParticle(particle, false);
    })
    if(isRunning) {
        animationFrame = requestAnimationFrame(animate);
    }
  };
  return <div style={divStyle}><canvas ref={canvasRef} id="duack"></canvas></div>
}

export default Particles2D;