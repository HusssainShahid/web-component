const templateLocaleOption = document.createElement('template');
templateLocaleOption.innerHTML = `
<style>
a {
  padding: 5px 16px;
  text-decoration: none;
  display: block;
  color: var(--primary-text) !important;
  background: var(--secondary-base);
  text-align: left;
  font-size: var(--text-caption, 14px);
}

a:hover {
  background-color: var(--primary-base);
}
</style>
<a href="javascript:void(0)"></a>
`;

export class LocaleOption extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateLocaleOption.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['language'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRoot.querySelector('a').innerHTML = newValue;
  }
}

window.customElements.define('locale-option', LocaleOption);
