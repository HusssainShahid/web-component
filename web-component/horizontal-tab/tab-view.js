const templateTabView = document.createElement('template');
templateTabView.innerHTML = `
<style>
div{
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
}
</style>
<div>
    <slot></slot>
</div>
`;

export class TabView extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateTabView.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['show'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue==='true') {
            this.style.display = 'inline';
        } else {
            this.style.display = 'none';
        }
    }
}

window.customElements.define('tab-view', TabView);
