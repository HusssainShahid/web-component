const templateButtonGroup = document.createElement('template');
templateButtonGroup.innerHTML = `<slot name="button"></slot>`;

export class ButtonGroup extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateButtonGroup.content.cloneNode(true));
    }
}

window.customElements.define('button-group', ButtonGroup);