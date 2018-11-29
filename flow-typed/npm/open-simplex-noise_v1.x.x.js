/* @flow */

declare type noiseFunction = (number, number) => number

declare class OpenSimplexNoise {
	constructor(seed: number) : void;
	noise2D (x: number, y: number) : number;
	noise3D (x: number, y: number, z: number) : number;
	noise4D (x: number, y: number, z: number, w: number) : number;
}


declare module 'open-simplex-noise' {
	// declare export type OpenSimplexNoise = OpenSimplexNoise
  // declare module.exports: {
  declare export default typeof OpenSimplexNoise
  // };
}
