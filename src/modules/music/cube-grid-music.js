import React, { useEffect } from "react";
import CubeGrid from "../cube-grid";
import * as Tone from "tone";
import { useState } from "react";
import Drum from "./Drum";
import Transport from "./Transport";

const divStyle = {
	position: "relative",
	left: 0,
	bottom: "50px",
	width: "100%",
	height: "100%",
};

export default function MusicCube() {
	const synth = new Tone.PolySynth(Tone.Synth).toDestination();

	const play = () => {
		const now = Tone.now();

		synth.triggerAttack(dMinorScale[0], now);
		synth.triggerAttack(dMinorScale[2], now + 0.5);
		synth.triggerAttack(dMinorScale[4], now + 1);

		synth.triggerRelease(
			[dMinorScale[0], dMinorScale[2], dMinorScale[4]],
			now + 4
		);
	};

	return (
		<>
			<CubeGrid></CubeGrid>
			<div style={divStyle}>
				<button onClick={play}>Play</button>
			</div>
			<Drum></Drum>
			<Transport></Transport>
		</>
	);
}
const dMinorScale = ["D4", "E4", "F4", "G4", "A4", "Bb4", "C5"];
