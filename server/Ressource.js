/* @flow */

// const Ressource = {
//   toString : function () : string {
//     return JSON.stringify(this, null, 2)
//   }
// }
//
class Ressource {
  constructor() {}

  toString() : string {
    return JSON.stringify(this, null, 2)
  }
}

export default Ressource;
