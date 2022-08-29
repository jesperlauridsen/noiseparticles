import { Center } from "@react-three/drei";
import React, { useMemo, useState, useEffect, useRef } from "react";
import simplexNoise from "simplex-noise";
import Layout from '../Layout'

export default function StartPage() {
  console.log("We're live!")
  return <div id="welcome">React playground v2</div>
}