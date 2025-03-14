const TemplateMainMenu = document.createElement('template');
TemplateMainMenu.innerHTML = `
<div style="margin: 0 10px;">
    <slot></slot>
</div>
  `;

export class MainMenu extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateMainMenu.content.cloneNode(true));
    }
}

window.customElements.define('main-menu', MainMenu);
