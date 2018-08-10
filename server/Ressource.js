/* @flow */

export type RessourceOpt_t = {
  name: string,

  position: Array<number>,
  offset: Array<number>
}

class Ressource {
  name: string

  position: Array<number>
  offset: Array<number>

  constructor(opts: RessourceOpt_t) {
    Object.assign(this, opts)
  }

  toString() : string {
    return JSON.stringify(this, null, 2)
  }
}

export default Ressource;
