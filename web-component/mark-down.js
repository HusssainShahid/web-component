const templateMarkDown = document.createElement('template');
templateMarkDown.innerHTML = `
<div></div>
<slot></slot>
`;

export class MarkDown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateMarkDown.content.cloneNode(true));
  }

  connectedCallback() {
    this.mark = require('markdown-it')();
  }

  static get observedAttributes() {
    return ['load'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRoot.querySelector('div').innerHTML = this.mark.render(`${this.shadowRoot.querySelector('slot').assignedNodes()[0].data}`)
    this.shadowRoot.querySelector('slot').assignedNodes()[0].data = '';
  }
}

window.customElements.define('mark-down', MarkDown);
