const templateSelectOption = document.createElement('template');
templateSelectOption.innerHTML = `
<div>
<slot></slot>
<div>
`;

class SelectOption extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateSelectOption.content.cloneNode(true));
  }
}

window.customElements.define('select-option', SelectOption);

