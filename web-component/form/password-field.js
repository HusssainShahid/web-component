import NonEmptyString from "../../../src/types/non-empty-string"

const templatePasswordField = document.createElement('template');
templatePasswordField.innerHTML = `
<style>
  input {
    width: 100%;
    padding: 9px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    background: transparent ;
    color: var(--primary-text, hsla(0, 0%, 0%, 1));
    border: 1px solid #ccc;
    font-size: var(--text-paragraph, 18px);
  }
  input:focus{
    outline: none;
}
  p{
    color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
    font-size: var(--text-caption, 14px);
    margin: 2px;
  }
    input:disabled {
  background: #dddddd;
}
</style>
<input type="password">
<p id="require"></p>
`;

export class PasswordField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templatePasswordField.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['validate', 'placeholder', 'focused'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'placeholder') {
      this.shadowRoot.querySelector('input').placeholder = this.placeholder;
      return
    }
    if (name === 'focused') {
      setTimeout(function () {
        this.shadowRoot.querySelector('input').focus();
      }.bind(this), 500);
      return
    }
    this.getValue();
  }

  connectedCallback() {
    this.input = this.shadowRoot.querySelector('input');
    if (this.placeholder == null) {
      this.placeholder = '';
    }
    this.input.placeholder = '';
    this.input.value = '';
    this.input.placeholder = this.placeholder;
    if (this.validateOnFocusOut !== 'false') {
      this.addEventListener('focusout', this.getValue);
    }
    this.addEventListener('keydown', function () {
      this.shadowRoot.getElementById("require").innerHTML = null;
    });
    if (this.disable === true) {
      this.input.setAttribute('disabled', 'true');
    } else {
      this.input.removeAttribute('disabled');
    }
    this.input.value = this.value;
  }

  getValue() {
    const inputValue = this.input.value;
    this.verify(inputValue);
    this.setAttribute('value', inputValue);
  }

  verify(value) {
    this.shadowRoot.getElementById("require").innerHTML = null;
    if (value === '' && this.required === true) {
      this.shadowRoot.getElementById("require").innerHTML = "This field is required";
      this.setAttribute('valid', 'false');
      return false;
    }
    this.setAttribute('valid', 'true');
  }

  get placeholder() {
    return this.getAttribute('placeholder');
  }

  get required() {
    return this.hasAttribute('required');
  }

  get value() {
    return this.getAttribute('value');
  }

  get validate() {
    return this.getAttribute('validate');
  }

  get focused() {
    return this.getAttribute('focused');
  }

  get disable() {
    return this.hasAttribute('disable');
  }

  get validateOnFocusOut() {
    return this.getAttribute('onfocusout-validate');
  }
}

window.customElements.define('password-field', PasswordField);
