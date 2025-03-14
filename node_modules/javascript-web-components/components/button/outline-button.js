const template = document.createElement('template');
template.innerHTML = `
<style>
    .button{
        border: 1px solid black;
        background: transparent;
        color: black;
        padding: 8px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 3px;
        transition: background 0.3s, color 0.3s;
        position: relative;
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
    .button:hover{
        color:white;
    }
    .default {
        border-color: var(--outline-button-default-border-color, #000000);
        color: var(--outline-button-default-color, #000000);
    }
    .default:hover{
        background: var(--outline-button-default-background, #000000);

    }
    .primary {
        border-color: var(--outline-button-primary-border-color, #337AB7);
        color: var(--outline-button-primary-color, #337AB7);
    }
    .primary:hover{
        background: var(--outline-button-primary-background, #337AB7);

    }
    .secondary {
        border-color: var(--outline-button-secondary-border-color, #6C757D);
        color: var(--outline-button-secondary-color, #6C757D);
    }
    .secondary:hover{
        background: var(--outline-button-secondary-backgroud, #6C757D);

    }
    .info {
        border-color: var(--outline-button-info-border-color, #5BC0DE);
        color: var(--outline-button-info-color, #5BC0DE);
    }
    .info:hover{
        background: var(--outline-button-info-background, #5BC0DE);

    }
    .warning {
        border-color: var(--outline-button-warning-border-color, #F0AD4E);
        color: var(--outline-button-warning-color, #F0AD4E);
    }
    .warning:hover{
        background: var(--outline-button-warning-background, #F0AD4E);

    }
    .success {
        border-color: var(--outline-button-success-border-color, #5CB85C);
        color:  var(--outline-button-success-color, #5CB85C);
    }
    .success:hover{
        background: var(--outline-button-success-background, #5CB85C);

    }
    .danger {
        border-color: var(--outline-button-danger-border-color, #D9534F);
        color: var(--outline-button-danger-color, #D9534F);
    }
    .danger:hover{
        background: var(--outline-button-danger-background, #D9534F);
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

export class OutlineButton extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
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

window.customElements.define('outline-button', OutlineButton);
