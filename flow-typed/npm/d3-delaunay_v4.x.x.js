/* @flow */

declare module 'd3-delaunay' {
  declare class Delaunay {
		static from(Array<[number, number]>) : Delaunay;

		voronoi([number, number, number, number]) : Voronoi;
    neighbors(number): Iterator<number>;
    find(number, number): number;
	}

	declare class Voronoi {
    cellPolygons(void): Iterator<Array<[number, number]>>
	}
}
