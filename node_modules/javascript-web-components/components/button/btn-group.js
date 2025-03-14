const templateBtnGroup = document.createElement('template');
templateBtnGroup.innerHTML = `
<style>
    .button {
        position: relative;
        border: none;
        padding: 12px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        color: white;
        float: left;
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
        border: var(--btn-group-default-border, 1px solid black);
        background: var(--btn-group-default-background, #000000);
    }

    .default:hover {
        background: var(--btn-group-default-background-hover, #000000);
    }

    .primary {
        border-left: var(--btn-group-primary-border-left, 1px solid #2d6a9f);
        border-right: var(--btn-group-primary-border-right, 1px solid #2d6a9f);
        background: var(--btn-group-primary-background, #337AB7);
    }

    .primary:hover {
        background: var(--btn-group-primary-background-hover, #2d6a9f);
    }

    .secondary {
        border-left: var(--btn-group-secondary-border-left, 1px solid #5f666d);
        border-right: var(--btn-group-secondary-border-right, 1px solid #5f666d);
        background: var(--btn-group-secondary-background, #6C757D);
    }

    .secondary:hover {
        background: var(--btn-group-secondary-background-hover, #5f666d);
    }

    .info {
        border-right: var(--btn-group-info-border-left, 1px solid #41b5d8);
        border-left: var(--btn-group-info-border-right, 1px solid #41b5d8);
        background: var(--btn-group-info-background, #5BC0DE);
    }

    .info:hover {
        background: var(--btn-group-info-hover-background, #41b5d8);
    }

    .warning {
        border-right: var(--btn-group-warning-border-left, 1px solid #ed9c2c);
        border-left: var(--btn-group-warning-border-right, 1px solid #ed9c2c);
        background: var(--btn-group-warning-background, #F0AD4E);
    }

    .warning:hover {
        background: var(--btn-group-warning-hover-background, #ed9c2c);;
    }

    .success {
        border-right: var(--btn-group-success-border-left, 1px solid #46a046);
        border-left: var(--btn-group-success-border-right, 1px solid #46a046);
        background: var(--btn-group-success-background, #5CB85C);
    }

    .success:hover {
        background: var(--btn-group-success-hover-background, #46a046);
    }

    .danger {
        border-right: var(--btn-group-danger-border-left, 1px solid #d1332e);
        border-left: var(--btn-group-danger-border-right, 1px solid #d1332e);
        background: var(--btn-group-danger-background, #D9534F);
    }

    .danger:hover {
        background: var(--btn-group-danger-hover-background, #d1332e);
    }
    .disable {
        pointer-events: none;
        opacity: 0.4;
    }
</style>

<div class="button">
    <slot name="icon"></slot>
    <span></span>
    <div id="splash"></div>
</div>
`;

export class BtnGroup extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateBtnGroup.content.cloneNode(true));
    }

    connectedCallback() {
        this.btnTypes = ['primary', 'secondary', 'info', 'success', 'warning', 'danger'];
        this.shadowRoot.querySelector('.button').classList.add(this.is);
        this.shadowRoot.querySelector('slot[name=icon]');
        this.setInnerHtml();
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

    setInnerHtml() {
        if (this.content != null) {
            this.shadowRoot.querySelector('span').innerHTML = (this.content);
        }
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

window.customElements.define('btn-group', BtnGroup);