const TemplateTextMessage = document.createElement('template');
TemplateTextMessage.innerHTML = `
<slot></slot>
  `;

export class TextMessage extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateTextMessage.content.cloneNode(true));
    }
}

window.customElements.define('text-message', TextMessage);
