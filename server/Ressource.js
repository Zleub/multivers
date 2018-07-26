/* @flow */

/**
 * The ressource prototype
 */
const Ressource = {
  toString : function () : string {
    return JSON.stringify(this, null, 2)
  }
}


export default Ressource;
