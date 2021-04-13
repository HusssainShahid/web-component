const templateButton = document.createElement('template');
templateButton.innerHTML = `
<style>
    .button{
        position: relative;
        border: none;
        padding: 6px 16px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: var(--text-caption);
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
        outline: none;
    }
    .rounded{
        border-radius: 50%;
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
    .primary{
        background: var(--base-color-light, hsla(240, 40.2%, 50.2%, 1));
        color:white;
    }
    .primary:hover{
          background-color: var(--hover-effect,hsla(240,40.2%,60%,1));
    }
    .secondary {
        color: var(--base-color, hsla(240, 40.3%, 15.1%, 1));
        background:var(--base-color-lightest, hsla(240, 38.5%, 94.9%, 1)) ;
    }
    .secondary:hover{
        color:var(--base-color-lightest, hsla(240,40.2%,60%,1)) ;
        background: var(--base-color, hsla(240, 40.3%, 15.1%, 1));
    }
    .success {
        color: white;
        background:var(--color-success, hsla(144.6, 73.5%, 38.4%, 1)) ;
    }
    .success:hover{
        background: var(--color-success-light,hsla(145, 73%, 45.1%, 1));
    }
    .danger {
        color: white;
        background:var(--color-danger, hsla(354.3, 70.5%, 53.5%, 1)) ;
    }
    .danger:hover {
        background:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1)) ;
    }
    .disable {
        pointer-events: none;
        opacity: 0.4;
    }
    .full-width{
        width: 100%;
        max-width: 463px;
    }
</style>
<div class="button">
    <slot></slot>
    <span></span>
    <div id="splash"></div>
</div>
  `;

export class ButtonComponent extends HTMLElement {
  static get observedAttributes() {
    return ['content'];
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateButton.content.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRoot.querySelector('span').innerText = (this.content);
  }

  connectedCallback() {
    this.btnTypes = ['primary', 'secondary', 'success', 'danger'];
    this.shadowRoot.querySelector('.button').classList.add(this.is);
    if (this.color && this.background) {
      this.shadowRoot.querySelector('.button').style.color = this.color;
      this.shadowRoot.querySelector('.button').style.background = this.background;
    }
    if (this.border) {
      this.shadowRoot.querySelector('.button').style.border = this.border;
    }
    this.shadowRoot.querySelector('span').innerText = (this.content);
    this.shadowRoot.querySelector('.button').addEventListener('click', this.splashEffect.bind(this));
    if (this.disable) {
      this.shadowRoot.querySelector('.button').classList.add('disable');
    }
    if (this.rounded) {
      this.shadowRoot.querySelector('.button').classList.add('rounded');
    }
    if (this.fullwidth) {
      this.shadowRoot.querySelector('.button').classList.add('full-width');
    }
    if (this.event != null) {
      this.shadowRoot.querySelector('.button').addEventListener('click', function () {
        window.dispatchEvent(new CustomEvent(this.event, {bubbles: true, detail: this.event}));
      }.bind(this));
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

  get event() {
    return this.getAttribute("event")
  }

  get disable() {
    return this.hasAttribute('disable');
  }

  get fullwidth() {
    return this.hasAttribute('fullwidth');
  }

  set disable(value) {
    if (value)
      this.setAttribute('disable', '');
    else
      this.removeAttribute('disable');
  }

  get rounded() {
    return this.hasAttribute('rounded');
  }

  get color() {
    return this.getAttribute('color');
  }

  get background() {
    return this.getAttribute('background');
  }

  get border() {
    return this.getAttribute('border');
  }
}

window.customElements.define('button-component', ButtonComponent);
