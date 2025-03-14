const TemplateNavlink = document.createElement('template');
TemplateNavlink.innerHTML = `
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
        cursor: pointer;
    }
    li a:hover{
        color: grey;
    }
    .active{
        font-weight: bold;
    }
</style>
<li>
    <a>
        <slot></slot>
    </a>
</li>
  `;

export class NavLink extends HTMLElement {

    static get observedAttributes() {
        return ['dark'];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateNavlink.content.cloneNode(true));
    }

    connectedCallback() {
        if (this.active) {
            this.shadowRoot.querySelector('a').classList.add('active');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.dark) {
            this.shadowRoot.querySelector('a').style.color = 'white';
        }
    }

    get dark() {
        return this.hasAttribute("dark")
    }

    get active() {
        return this.hasAttribute("active")
    }

    set active(val) {
        if (val) {
            this.setAttribute('active', '');
        } else {
            this.removeAttribute('active');
        }
    }
}

window.customElements.define('nav-link', NavLink);
