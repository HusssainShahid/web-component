const templateFlatButton = document.createElement('template');
templateFlatButton.innerHTML = `
<style>
    .button{
        position: relative;
        border: none;
        padding: 8px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 3px;
        color:white;
        outline: none;
    }
    .button #splash{
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, .2);
        transform: translate(-50%, -50%);
        border-radius: 50%;
        transition: .4s ease-out;
    }
    .default {
        border: 1px solid black;
        background: var(--flat-button-default-background, #000000);
    }
    .primary {
        background: var(--flat-button-primary-background, #337AB7);
    }
    .secondary {
        background:var(--flat-button-secondary-background, #6C757D) ;
    }
    .info {
        background:var(--flat-button-info-background, #5BC0DE) ;
    }
    .warning {
        background:var(--flat-button-warning-background, #F0AD4E) ;
    }
    .success {
        background:var(--flat-success-background, #5CB85C) ;
    }
    .danger {
        background:var(--flat-button-danger-background, #D9534F) ;
    }
    .disable {
        pointer-events: none;
        opacity: 0.4;
    }
</style>
<div class="button">
    <span></span>
    <div id="splash"></div>
</div>
  `;

export class FlatButton extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateFlatButton.content.cloneNode(true));
    }

    connectedCallback() {
        this.btnTypes = ['primary', 'secondary', 'info', 'success', 'warning', 'danger'];
        this.shadowRoot.querySelector('.button').classList.add(this.is);
        this.shadowRoot.querySelector('span').innerText = (this.content);
        this.shadowRoot.querySelector('.button').addEventListener('click', this.splashEffect.bind(this));
        if (this.disable) {
            this.shadowRoot.querySelector('.button').classList.add('disable');
        }
    }

    splashEffect() {
        let splash = this.shadowRoot.querySelector('#splash');
        splash.style.width = "100%";
        splash.style.height = "50px";

        setTimeout(function () {
            splash.style.opacity = "0";
        }, 200);

        setTimeout(function () {
            splash.style.transitionDuration = "0s";
        }, 1000);

        setTimeout(function () {
            splash.style.width = "0";
            splash.style.height = "0";
            splash.style.opacity = "1";
        }, 1100);

        setTimeout(function () {
            splash.style.transitionDuration = ".3s";
        }, 1200);
    }

    get is() {
        let btnType = 'default';
        if (this.hasAttribute('is')) {
            let askedType = this.getAttribute("is");
            if (this.btnTypes.indexOf(askedType) !== -1) {
                btnType = askedType;
            }
        }
        return btnType;
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

window.customElements.define('flat-button', FlatButton);