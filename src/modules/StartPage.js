import { Center } from "@react-three/drei";
import React, { useMemo, useState, useEffect, useRef } from "react";
import simplexNoise from "simplex-noise";
import Layout from '../Layout'

export default function StartPage() {

  const divStyle = {
    width:"100vw",
    height:"100vh",
    textAlign:"center",
    paddingTop:"250px",
    fontSize:"60px",
  }

  return <div style={divStyle}>React playground</div>
}