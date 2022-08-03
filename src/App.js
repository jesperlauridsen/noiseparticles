import React, { useMemo, useState, useEffect, useRef } from "react";
import simplexNoise from "simplex-noise";
import { gsap } from "gsap";
import lerp from "lerp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ParticlesCanvas from './modules/particles-canvas';
import CubeFlow from './modules/cube-flow';
import CubeGrid from "./modules/cube-grid";
import ReactParticles from './modules/react-particles'
import ReactComponents from './modules/react-components';
import StartPage from './modules/StartPage';
import Layout from "./Layout";

export default function App() {
  return (
  <div>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Layout />}>
          <Route index element={<StartPage />} />
          <Route path="/particles-canvas" element={<ParticlesCanvas />} />
          <Route path="/react-components" element={<ReactComponents />} />
          <Route path="/cube-flow" element={<CubeFlow />} />
          <Route path="/cube-grid" element={<CubeGrid />} />
          <Route path="/react-particles" element={<ReactParticles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
  )
}
