const templateDropContent = document.createElement('template');
templateDropContent.innerHTML = `
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
<a href="javascript:void(0)">
<slot></slot>
</a>
`;

class DropContent extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateDropContent.content.cloneNode(true));
  }

  connectedCallback() {

  }
}

window.customElements.define('drop-content', DropContent);

