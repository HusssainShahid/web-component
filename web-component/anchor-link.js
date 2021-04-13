const anchorLinkTemplate = document.createElement('template');
anchorLinkTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
a:hover {
    color: #7676f9;
}
</style>

<a></a>
`;

class AnchorLink extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(anchorLinkTemplate.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['href', 'target', 'name'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'href':
                this.shadowRoot.querySelector('a').setAttribute('href', newValue);
                break;
            case 'target':
                this.shadowRoot.querySelector('a').setAttribute('target', newValue);
                break;
                case 'name':
                this.shadowRoot.querySelector('a').innerHTML = newValue;
                break;
        }
    }
}

window.customElements.define('anchor-link', AnchorLink);
export default AnchorLink;
