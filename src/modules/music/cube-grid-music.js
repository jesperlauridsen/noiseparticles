import React from "react";
import CubeGrid from "../cube-grid";
import * as Tone from "tone";

export default function MusicCube() {
	const synth = new Tone.PolySynth(Tone.Synth).toDestination();
	const now = Tone.now();
	synth.triggerAttack("D4", now);
	synth.triggerAttack("F4", now + 0.5);
	synth.triggerAttack("A4", now + 1);
	synth.triggerAttack("C4", now + 1.5);
	synth.triggerAttack("E4", now + 2);
	synth.triggerRelease(["D4", "F4", "A4", "C4", "E4"], now + 4);
	return <CubeGrid></CubeGrid>;
}
