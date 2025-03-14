const checkboxComponent = document.createElement('template');
checkboxComponent.innerHTML = `
    <style>
    span{
      width: 56px; 
      height: 56px;
      cursor: pointer;
    }
    input{
      width: 20px; 
      height: 20px;
}
</style>
    <span>
        <input type="checkbox">
    </span>
    <slot></slot>
  `;

export class CheckBox extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(checkboxComponent.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('input').checked = this.checked;
        this.shadowRoot.querySelector('input').disabled = this.disabled;
        this.addEventListener('click', this._onClick);
    }

    get checked() {
        return this.hasAttribute('checked');
    }

    set checked(value) {
        const isChecked = Boolean(value);
        if (isChecked)
            this.setAttribute('checked', '');
        else
            this.removeAttribute('checked');
    }

    set disabled(value) {
        const isDisabled = Boolean(value);
        if (isDisabled)
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

window.customElements.define('check-box', CheckBox);
