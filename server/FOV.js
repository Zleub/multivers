/* @flow */

import { world } from './World'

export type FOV_t = Array<Array<number>>

type Slope = {
  x: number,
  y: number
}

export const range = 32

export function computeFOV(origin: Array<number>, rangeLimit?: number ) : FOV_t {
  let fov = [ origin ]
  rangeLimit = rangeLimit || range

  let GetDistance = (x, y) => Math.sqrt( Math.pow(origin[0] - x, 2) + Math.pow(origin[1] - y, 2) )
  let SetVisible = (x, y) => fov.push([x, y])

  let BlocksLight = (x, y) => {
    if (!world.map.map[x])
      return false

    let _ = world.map.map[x][y]

    if (_ && _.name != 'floor')
      return true
  }

  let compute = (octant, origin, rangeLimit, x, top, bottom) => {
     for(; x <= rangeLimit; x++) // rangeLimit < 0 || x <= rangeLimit
      {
        const topY = Math.floor(top.x == 1 ? x : ((x*2+1) * top.y + top.x - 1) / (top.x*2))
        const bottomY = bottom.y == 0 ? 0 : ((x*2-1) * bottom.y + bottom.x) / (bottom.x*2);

        let wasOpaque = -1;
        for(let y=topY; y >= bottomY; y--)
        {
          let tx = origin[0]
          let ty = origin[1]
          switch(octant)
          {
            case 0: tx += x; ty -= y; break;
            case 1: tx += y; ty -= x; break;
            case 2: tx -= y; ty -= x; break;
            case 3: tx -= x; ty -= y; break;
            case 4: tx -= x; ty += y; break;
            case 5: tx -= y; ty += x; break;
            case 6: tx += y; ty += x; break;
            case 7: tx += x; ty += y; break;
          }

          const inRange = rangeLimit < 0 || GetDistance(tx, ty) <= rangeLimit;
          if(inRange)
            SetVisible(tx, ty);
          // NOTE: use the next line instead if you want the algorithm to be symmetrical
          // if(inRange && (y != topY || top.y*x >= top.x*y) && (y != bottomY || bottom.y*x <= bottom.x*y)) SetVisible(tx, ty);

          const isOpaque = !inRange || BlocksLight(tx, ty);
          if(x != rangeLimit)
          {
            if(isOpaque)
            {
              if(wasOpaque == 0) // if we found a transition from clear to opaque, this sector is done in this column, so
              {                  // adjust the bottom vector upwards and continue processing it in the next column.
                let newBottom = {y: y*2+1, x: x*2-1}; // (x*2-1, y*2+1) is a vector to the top-left of the opaque tile
                if(!inRange || y == bottomY) {
                  bottom = newBottom;
                  break;
                } // don't recurse unless we have to
                else compute(octant, origin, rangeLimit, x+1, top, newBottom);
              }
              wasOpaque = 1;
            }
            else // adjust top vector downwards and continue if we found a transition from opaque to clear
            {    // (x*2+1, y*2+1) is the top-right corner of the clear tile (i.e. the bottom-right of the opaque tile)
              if(wasOpaque > 0) top = {y: y*2+1, x: x*2+1};
              wasOpaque = 0;
            }
          }
        }

        if(wasOpaque != 0) {
          break; // if the column ended in a clear tile, continue processing the current sector
        }

      }
    }


  for(let octant = 0; octant < 8; octant++) {
    compute(octant, origin, rangeLimit, 1, {y: 1, x: 1}, {y: 0, x: 1});
  }

  // not worling !
  // this.diff = fov.filter( e =>
  //   !this.fov.find(_ => e[0] == _[0] && e[1] == _[1])
  // )
  // this.fov = this.fov.concat( this.diff )
  return fov
    // Compute(octant, origin, rangeLimit, 1, new Slope(1, 1), new Slope(0, 1));
}
