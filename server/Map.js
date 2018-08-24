/* @flow */

export const width = 32
export const height = 32
export const depth = 32

export const offset = 16

type Cell_t = {
    name: string,
    x: number,
    y: number,
    z: number
}

export type Limit_t = { width: number, height: number, depth: number }
type Map_t = Array< Array< Array< Cell_t > > >

class Map {
  limits: Limit_t
  map: Array< Array< Array< Cell_t > > >

  constructor(limits?: Limit_t) {
    this.map = []
    this.limits = limits || {
      width: width,
      height: height,
      depth: depth,
      offset: 16
    }

    for (var x = 0; x <= this.limits.width; x++) {
      this.map.push([])
      for (var y = 0; y <= this.limits.height; y++) {
        this.map[x].push([])
        for (var z = 0; z <= this.limits.depth; z++) {
          if ( Math.floor( Math.sin(x / 8) * Math.sin(y / 8) * 10) == 0 )
            this.map[x][y].push({
              name: 'floor',
              x: x,
              y: y,
              z: z
            })
          else
            this.map[x][y].push({
              name: 'air',
              x: x,
              y: y,
              z: z
            })
        }
      }
    }

    // for (var i = 0; i < width; i++) {
    //   if (i % 3 == 0)
    //     this.map[i][0][width / 4].name = 'wall'
    // }
    //
    // for (var i = 0; i < width; i++) {
    //   const x = Math.floor(Math.random() * width)
    //   const y = Math.floor(Math.random() * width)
    //   this.map[x][0][y].name = 'wall'
    // }

    // for (var i = 0; i < 1000; i++) {
    //   const x = Math.abs( Math.floor(Math.sin(i) * size / 2) )
    //   const y = Math.abs( Math.floor(Math.cos(i) * size / 2) )
    //   this.map[x][y].name = 'wall'
    // }
  }

  iter(
    origin: [number, number, number],
    fx: number => boolean,
    fy: number => boolean,
    fz: number => boolean,
    f: (Cell_t, [number, number, number], Map_t) => null
  ) {
    let [x, y, z] = origin
    let count = 0

    if ( fx(x) && fy(y) && fz(z) ) {
      f( this.map[x][y][z], [x, y, z], this.map )
    }

    let _x, _y, _z
    do {
      count += 1

      _x = fx(x + count)
      _y = fy(y + count)
      _z = fz(z + count)

      if (_x)
        f( this.map[x + count][y][z], [x + count, y, z], this.map )
      if (_y)
        f( this.map[x][y + count][z], [x, y + count, z], this.map )
      if (_z)
        f( this.map[x][y][z + count], [x, y, z + count], this.map )
      if (_x && _y)
        f( this.map[x + count][y + count][z], [x + count, y + count, z], this.map )
      if (_x && _z)
        f( this.map[x + count][y][z + count], [x + count, y, z + count], this.map )
      if (_y && _z)
        f( this.map[x][y + count][z + count], [x, y + count, z + count], this.map )
    }
    while ( _x || _y || _z )



    //   while ( fy(y) ) {
    //     while ( fz(z) ) {
    //       f( this.map[x][y][z], [x, y, z], this.map )
    //       z += 1
    //     }
    //     y += 1
    //   }
    //   x += 1
    // }
  }
  //
  // map(f: (Cell_t, number, number, Array<Array<Cell_t>>) => Cell_t) : Array<Array<Cell_t>> {
  //   let map = []
  //   for (var x = 0; x < this.limits.width; x++) {
  //     map[x] = []
  //     for (var y = 0; y < this.limits.height; y++) {
  //       map[x][y] = f(this.map[x][y], x, y, this.map)
  //     }
  //   }
  //   return map
  // }
  //
  // filter(f: (Cell_t, number, number, Array<Array<Cell_t>>) => boolean) : Array<Cell_t> {
  //   let map = []
  //   for (var x = 0; x < this.limits.width; x++) {
  //     for (var y = 0; y < this.limits.height; y++) {
  //       if ( f(this.map[x][y], x, y, this.map) )
  //         map.push( this.map[x][y] )
  //     }
  //   }
  //   return map
  // }
}

export default Map
