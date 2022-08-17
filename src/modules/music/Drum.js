import React, { useCallback, useEffect, useMemo, useRef } from "react";
import CubeGrid from "../cube-grid";
import * as Tone from "tone";
import { useState } from "react";
import er from "euclidean-rhythms";

function arrayRotate(arr, count) {
	count -= arr.length * Math.floor(count / arr.length);
	arr.push.apply(arr, arr.splice(0, count));
	return arr;
}
const useEuclidean = (beats, length, rotate) => {
	return useMemo(
		() => arrayRotate(er.getPattern(beats, length), rotate * -1),
		[beats, length, rotate]
	);
};

export default function Drum() {
	const loop = useRef(new Tone.Loop());
	// const src = useRef < Tone.Player > new Tone.Player(sample);

	const synth = new Tone.PolySynth(Tone.Synth).toDestination();

	const [beats, setBeats] = useState(1);
	const [length, setLength] = useState(4);
	const [rotate, setRotate] = useState(0);
	const pattern = useEuclidean(beats, length, rotate);
	const [drag, setDrag] = useState(0);

	const tick = useCallback(
		(time) => {
			const [_, beats, sixteenths] = Tone.Transport.position.split(":");
			const pos = Math.floor(parseInt(beats) * 4 + parseFloat(sixteenths));

			if (pattern[pos % pattern.length]) {
				const now = Tone.now();
				console.log("yo tick");
				// src.current.start(time + drag * 0.001);
			}
		},
		[pattern, drag]
	);

	useEffect(() => {
		console.log("hej");
		// src.current.toDestination();
		loop.current.callback = tick;
		loop.current.interval = "16n";
		loop.current.start(0);

		return () => {
			loop.current.dispose();
		};
	}, [tick]);

	return (
		<div
			style={{
				backgroundColor: "red",
				width: "50px",
				height: "50px",
				borderRadius: "50%",
				position: "absolute",
				bottom: "50px",
			}}
		>
			DRUM
		</div>
	);
}
