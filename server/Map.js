/* @flow */

export const size = 32
export const offset = 16

type Cell_t = {
    name: string,
    x: number,
    y: number
}

class Map {
  limits: {
    width: number,
    height: number
  }
  map: Array< Array< Cell_t > >

  constructor(limits?: { width: number, height: number }) {
    this.map = []
    this.limits = limits || {
      width: size,
      height: size,
      offset: 16
    }

    for (var x = 0; x <= this.limits.width; x++) {
      this.map.push([])
      for (var y = 0; y <= this.limits.height; y++) {
        this.map[x].push({
          name: 'floor',
          x: x,
          y: y
        })
      }
    }
    console.log(this.map[16][16])

    for (var i = 0; i < 10; i++) {
      this.map[i][10].name = 'wall'
    }

    for (var i = 0; i < 10; i++) {
      const x = Math.floor((Math.random() * size) % size)
      const y = Math.floor((Math.random() * size) % size)
      this.map[x][y].name = 'wall'
    }
  }

  iter(f: (Cell_t, number, number, Array<Array<Cell_t>>) => null) {
    for (var x = 0; x < this.limits.width; x++) {
      for (var y = 0; y < this.limits.height; y++) {
        f(this.map[x][y], x, y, this.map)
      }
    }
  }

  map(f: (Cell_t, number, number, Array<Array<Cell_t>>) => Cell_t) : Array<Array<Cell_t>> {
    let map = []
    for (var x = 0; x < this.limits.width; x++) {
      map[x] = []
      for (var y = 0; y < this.limits.height; y++) {
        map[x][y] = f(this.map[x][y], x, y, this.map)
      }
    }
    return map
  }

  filter(f: (Cell_t, number, number, Array<Array<Cell_t>>) => boolean) : Array<Cell_t> {
    let map = []
    for (var x = 0; x < this.limits.width; x++) {
      for (var y = 0; y < this.limits.height; y++) {
        if ( f(this.map[x][y], x, y, this.map) )
          map.push( this.map[x][y] )
      }
    }
    return map
  }
}

export default Map
