const TemplateNavbar = document.createElement('template');
TemplateNavbar.innerHTML = `
<style>
    nav{
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #F8F9FA;
    }
    ul {
      margin: 0; 
      list-style-type: none;
    }
</style>
<nav>
    <ul>
        <slot></slot>
    </ul>
</nav>
  `;

export class NavBar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateNavbar.content.cloneNode(true));
    }

    connectedCallback() {
        this.nav = this.shadowRoot.querySelector('nav');
        this.routing();
        this.theme();
        this.linkActivation();
    }

    routing() {
        let elements = this.querySelectorAll('nav-link');
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].hasAttribute('active')) {
                let href = elements[i].getAttribute('href');
                this.setAttribute('href', href)
            }
        }
    }

    linkActivation() {
        let elements = this.querySelectorAll('nav-link');
        for (let i = 0; i < elements.length; i++) {
            this.querySelectorAll('nav-link')[i].addEventListener('click', this.activate.bind(this, i));
        }
    }

    activate(i) {
        let elements = this.querySelectorAll('nav-link');
        for (let i = 0; i < elements.length; i++) {
            elements[i].active = false;
            elements[i].shadowRoot.querySelector('a').classList.remove('active');
        }
        elements[i].active = true;
        elements[i].shadowRoot.querySelector('a').classList.add('active');
        this.routing();
    }


    theme() {
        window.onload = function () {
            if (this.dark) {
                this.nav.style.background = '#343A40';
                this.querySelector('nav-brand').setAttribute('dark', true);
                for (let i = 0; i < this.querySelectorAll('nav-link').length; i++) {
                    this.querySelectorAll('nav-link')[i].setAttribute('dark', true);
                }
            }
        }.bind(this)
    }

    get dark() {
        return this.hasAttribute('dark');
    }
}

window.customElements.define('nav-bar', NavBar);
