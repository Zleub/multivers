import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-localstorage/iron-localstorage.js';

/**
 * @customElement
 * @polymer
 */
class ClientApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        #container {
          display: flex;
          justify-content: center;
        }

        #overlay {
          width: 320px;
          float: left;
          z-index: 1;
        }

        #header {
          display: flex;
          align-items: center;
          border-bottom: 1px solid black;
          margin-bottom: 8px;
        }

        #header > * {
          margin-left: 4px;
          margin-right: 4px;
          padding-left: 8px;
          padding-right: 8px;
        }

      </style>
      <iron-localstorage name=user value={{user}}></iron-localstorage>
      <div id=header>
        <h2>Multiver</h2>
      </div>
      <div id=overlay>
        <p>name: {{ user.name }}</p>
        <p>position: {{ user.position.0 }}: {{ user.position.1 }}</p>
        <p>offset: {{ user.offset.0 }}: {{ user.offset.1 }}</p>
        <hr>
        <template is="dom-repeat" items=[[content]]>
          <p>{{ item.name }}</p>
        </template>
      </div>
      <div id=container></div>
    `;
  }
  static get properties() {
    return {
      user: Object,
      content: Array
    }
  }

  ready() {
    super.ready()

    fetchMultivers('/me').then( (response) => {
      response.json().then(e => {
        if ( JSON.stringify(e) != JSON.stringify(this.user) )
          this.set('user', e)

          let layer = setupKonva.call(this)
          this.socket = new WebSocket('ws://localhost:4242/' + this.user.token);
          this.socket.addEventListener('open', (event) => {
            this.socket.send('Hello Server!');
          });
          this.socket.addEventListener('message', (event) => {
            const msg = JSON.parse(event.data)
            this.set('user.offset', msg.offset)

            if (msg.tiles) {
              layer.map_group.children.forEach( e => {
                e.setAttrs({
                  // opacity: 0.3
                  fill: ''
                })
              })
              msg.tiles.forEach( (e) => {
                let _ = Array.from(layer.map_group.children).find(_ => {
                  return _.x() == (layer.center.x + e.x) * layer.scale && _.y() == (layer.center.y + e.y) * layer.scale
                })
                if (_) {
                  switch (e.name) {
                    case 'floor':
                        _.setAttrs({
                          content: [ e ],
                          fill: 'maroon'
                        })
                      break
                    case 'wall':
                        _.setAttrs({
                          content: [ e ],
                          fill: 'grey'
                        })
                      break
                    default :
                        _.setAttrs({
                          content: [ e ]
                        })
                  }
                }
              })

              this.set('user.position', msg.position)

            }

            // layer.player.position( {
            //   x: layer.center.x * layer.scale,
            //   y: layer.center.y * layer.scale
            // })
            layer.player.offsetX(this.user.offset[0])
            layer.player.offsetY(this.user.offset[1])
            layer.draw()
            // layer.player.position({
            //   x: msg.position[0] * 16,
            //   y: msg.position[1] * 16
            // })
          });



      })
    })
  }
}

window.customElements.define('client-app', ClientApp);
