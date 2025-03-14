const templateFloatingButton = document.createElement('template');
templateFloatingButton.innerHTML = `
<style>
    .button{
        position: relative;
    }
    button{
          height: 50px;
          width: 50px;
          padding-top: 5px;
          cursor: pointer;
          text-decoration: none;
          color:white;
    }
     button:focus{
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
        transition: .3s ease-out;
    }
    .trueRound{
          border-radius: 50%;
    }
    .trueShadow{
        box-shadow: 0 0 10px #d9d9d9;
    }
    .default {
        background: var(--floating-button-default-background, #000000);
        color: var(--floating-default-color, white)
    }
    .dark{
        background: black;
    }
    .light{
        background: white;
        border: 1px solid black;
        color:black;
    }
    .disable {
        pointer-events: none;
        opacity: 0.4;
    }
</style>
<span class="button">
    <button>
        <slot name="icon"></slot>
    </button>
    <div id="splash"></div>
</span>
  `;

export class FloatingButton extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateFloatingButton.content.cloneNode(true));

    }

    connectedCallback() {
        this.btnTypes = ['dark', 'light'];
        this.shadowRoot.querySelector('button').classList.add(this.is);
        this.shadowRoot.querySelector('slot[name=icon]');
        this.shadowRoot.querySelector('button').classList.add(this.round + 'Round');
        this.shadowRoot.querySelector('button').classList.add(this.shadow + 'Shadow');
        this.shadowRoot.querySelector('button').addEventListener('click', this.splashEffect.bind(this));
        if (this.disable) {
            this.shadowRoot.querySelector('button').classList.add('disable');
        }
    }

    splashEffect() {
        let splash = this.shadowRoot.querySelector('#splash');
        splash.style.width = "50px";
        splash.style.height = "50px";

        setTimeout(function () {
            splash.style.opacity = "0";
        }, 400);

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

    get icon() {
        return this.getAttribute("icon")
    }

    get round() {
        return this.hasAttribute('round');
    }

    set round(val) {
        if (val) {
            this.setAttribute('round', '');
        } else {
            this.removeAttribute('round');
        }
    }

    get shadow() {
        return this.hasAttribute('shadow');
    }

    set shadow(val) {
        if (val) {
            this.setAttribute('shadow', '');
        } else {
            this.removeAttribute('shadow');
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

window.customElements.define('floating-button', FloatingButton);
