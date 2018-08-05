/* @flow */

var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();

export type TilesetOpt_t = {
  path: string,
  tilemap?: string,
  // width?: number,
  // height?: number
}

export default function(opt: TilesetOpt_t) {
  if (opt.tilemap)
    fs.readFile(opt.path + '/' + opt.tilemap, function(err, data) {
      parser.parseString(data, function (err, result) {
        // console.dir(result);
        fs.writeFileSync('out', JSON.stringify(result, null, 2))
        // console.log(result.tileset.terraintypes[0].terrain.map(e => e.$.name));
      })
    })

}
