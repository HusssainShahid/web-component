const radioButtonComponent = document.createElement("template");
radioButtonComponent.innerHTML = `
    <style>
    input{
      width: 15px; 
      height: 15px;
      margin-top: 15px;
      margin-right: 10px;
      cursor: pointer;
}
</style>
        <input type="checkbox">
    <slot></slot>
  `;

export class RadioButton extends HTMLElement {
    static get observedAttributes() {
        return ['checked'];
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(radioButtonComponent.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('input').checked = this.checked;
        this.shadowRoot.querySelector('input').disabled = this.disabled;
        this.addEventListener('click', this._onClick);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.shadowRoot.querySelector('input').checked = this.checked;
    }

    get checked() {
        return this.hasAttribute('checked');
    }

    set checked(value) {
        if (value)
            this.setAttribute('checked', '');
        else
            this.removeAttribute('checked');
    }

    set disabled(value) {
        if (value)
            this.setAttribute('disabled', '');
        else
            this.removeAttribute('disabled');
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    _onClick(event) {
        this.checked = !this.checked;
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                checked: this.checked,
            },
            bubbles: true,
        }));
    }
}

window.customElements.define('radio-button', RadioButton);
