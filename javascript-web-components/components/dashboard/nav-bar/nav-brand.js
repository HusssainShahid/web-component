const TemplateNavBrand = document.createElement('template');
TemplateNavBrand.innerHTML = `
<style>
    li {
      float: left;
    }
    
    li a {
      display: block;
      color: black;
      text-align: center;
      padding: 16px;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
      font-size: 19px;
    }
    ::slotted(*){
      max-height: 100%;
      max-width: 90px;
    }
</style>
<li>
    <a>
        <slot></slot>
    </a>
</li>
  `;

export class NavBrand extends HTMLElement {

    static get observedAttributes() {
        return ['dark'];
    }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateNavBrand.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.dark) {
            this.shadowRoot.querySelector('a').style.color = 'white';
        }
    }

    get dark() {
        return this.hasAttribute("dark")
    }
}

window.customElements.define('nav-brand', NavBrand);
