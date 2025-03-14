const templateLinkButton = document.createElement('template');
templateLinkButton.innerHTML = `
<style>
    button{
        padding: 12px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 3px;
        color:#1890FF;
        background: white;
        border: none;
        outline: none;
    }
    .disable {
        pointer-events: none;
        opacity: 0.4;
    }
</style>
<button></button>
  `;

export class LinkButton extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateLinkButton.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('button').innerHTML = (this.content);
        if (this.disable){
            this.shadowRoot.querySelector('button').classList.add('disable');
        }
    }

    get content() {
        return this.getAttribute("content")
    }

    get disable() {
        return this.hasAttribute('disable');
    }

    set disable(value) {
        if (value)
            this.setAttribute('disable', '');
        else
            this.removeAttribute('disable');
    }
}

window.customElements.define('link-button', LinkButton);