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
        <h4>Multiver</h4>
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
          setupKonva.call(this)

          const socket = new WebSocket('ws://localhost:4242');
          socket.addEventListener('open', function (event) {
              socket.send('Hello Server!');
          });
          socket.addEventListener('message', function (event) {
              console.log('Message from server ', event.data);
          });
      })
    })
  }
}

window.customElements.define('client-app', ClientApp);
