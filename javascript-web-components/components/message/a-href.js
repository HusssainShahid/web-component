const TemplateAHref = document.createElement('template');
TemplateAHref.innerHTML = `
<style>
   a{
     color: #000;
     text-decoration: none;
   }
  
</style>
<a>
<slot></slot>
</a>
  `;

export class AHref extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateAHref.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('a').setAttribute('href', this.href);
        this.shadowRoot.querySelector('a').setAttribute('target', '_top');
        if(this.color!==null){
            this.shadowRoot.querySelector('a').style.color=this.color;
        }
        if (this.target !== null) {
            this.shadowRoot.querySelector('a').setAttribute('target', this.target);
        }
    }

    get href() {
        return this.getAttribute('href');
    }

    get color() {
        return this.getAttribute('color');
    }

    get target() {
        return this.getAttribute('target');
    }
}

window.customElements.define('a-href', AHref);