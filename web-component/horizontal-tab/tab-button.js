const templateTabButton = document.createElement('template');
templateTabButton.innerHTML = `
<style>
  .active{
    background-color: #ccc;
  }
  div{
      background-color: inherit;
      float: left;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 14px 16px;
      transition: 0.3s;
      font-size: 17px;
  }
  div:hover{
    background-color: #ddd;
  }
</style>
<div>
    <slot></slot>
</div>`;

export class TabButton extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateTabButton.content.cloneNode(true));
    }
    static get observedAttributes() {
        return ['active'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue==='true') {
            this.shadowRoot.querySelector('div').classList.add('active');
        } else {
            this.shadowRoot.querySelector('div').classList.remove('active');
        }
    }
}

window.customElements.define('tab-button', TabButton);
