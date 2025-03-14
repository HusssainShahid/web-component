const TemplateToolBar = document.createElement('template');
TemplateToolBar.innerHTML = `
<style>
    div{
        display: flex;
        height: var(--tool-bar-height, 40px);
        width: 100%;
        background: var(--tool-bar-background, white);
        margin: 0;
        padding: 1px;
    }
</style>
<div>
    <slot></slot>
</div>
  `;

export class ToolBar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateToolBar.content.cloneNode(true));
    }
}

window.customElements.define('tool-bar', ToolBar);
