/* @flow */

export type Drawable_t = {
  name: string,
  ascii: string,
  path?: string
}

export type DrawableOpts_t = {
  name: string,
  ascii?: string,
  path?: string
}

export const config : Array<Drawable_t> = []
const preconfig : Array<Drawable_t> = [
  {
    name: 'floor',
    ascii: '.'
  }
]

export default function (opts: DrawableOpts_t) : Drawable_t {
  if (preconfig.find(e => e.name == opts.name)) {
    let e = preconfig.filter(e => e.name == opts.name)[0]
    return config[config.push(e) - 1]
  }
  else if (opts.ascii)
    return config[config.push( Object.assign({}, opts) ) - 1]
  else
    throw "Drawable generation failure. Provide at least an ascii symbol."
}
