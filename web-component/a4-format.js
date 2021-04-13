const a4FormatTemplate = document.createElement('template');
a4FormatTemplate.innerHTML = `
<style>
:host([hidden]) {
    display: none 
}
.page {
  background: white;
  display: block;
  box-shadow: 0 0 0.2cm rgba(172,172,172,0.5);
  border: 1px solid #cacaca;
  border-radius: 2px;
}

.page[size="A4"] {
  width: 21cm;
  height: 29.7cm;
}
</style>
<div class="page" size="A4">
    <slot></slot>
</div>
`;

export class A4Format extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(a4FormatTemplate.content.cloneNode(true));
    }
}

window.customElements.define('a-4', A4Format);
