const TemplateDashboard = document.createElement('template');
TemplateDashboard.innerHTML = `
<div>
    <slot></slot>
</div>
  `;

export class DashBoard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateDashboard.content.cloneNode(true));
    }

    connectedCallback() {
        this.initialRoute();
        this.routing();
    }

    routing() {
        if (this.querySelector('nav-bar') !== null) {
            this.querySelector('nav-bar').addEventListener('click', this.initialRoute.bind(this));
        }
    }

    initialRoute() {
        if (this.querySelector('nav-bar') !== null) {
            let that = this;
            setTimeout(function () {
                let route = that.querySelector('nav-bar').getAttribute('href');
                that.setAttribute('route', route);
            }, 50);
        }
    }
}

window.customElements.define('dash-board', DashBoard);
