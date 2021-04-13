const templateTextArea = document.createElement('template');
templateTextArea.innerHTML = `
<style>
    textarea{
    width: 100%;
    padding: 9px 20px;
    margin: 2px 0;
    box-sizing: border-box;
    background: transparent ;
    color: var(--primary-text, hsla(0, 0%, 0%, 1));
    border: 1px solid #ccc;
    font-size: var(--text-paragraph, 18px);
    border-radius: 4px;
    }
    textarea:focus{
        outline: none;
    }
    .error{
    color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
    font-size: var(--text-caption, 14px);
    margin: 2px;  
      }
      .border-none{
        border:none;
      }
</style>
<slot></slot>
<textarea id="input"></textarea>
<div id="require" class="error"></div>
<div id="max" class="error"></div>
<div id="min" class="error"></div>
`;

class TextArea extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateTextArea.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['validate', 'placeholder', 'value', 'height'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'placeholder') {
      this.shadowRoot.querySelector('textarea').placeholder = this.placeholder;
    } else if (name === 'value') {
      this.shadowRoot.querySelector('textarea').value = this.value;
    } else if (name === 'validate') {
      this.getValue();
    } else if (name === 'height') {
      this.shadowRoot.querySelector('textarea').style.height = this.height;
    }
  }

  connectedCallback() {
    this.textArea = this.shadowRoot.querySelector('textarea');
    if (this.borderNone) {
      this.textArea.classList.add('border-none');
    }
    if (this.placeholder == null) {
      this.setAttribute('placeholder', '');
    }
    if (this.height) {
      this.textArea.style.height = this.height;
    }
    this.textArea.placeholder = '';
    this.textArea.value = '';
    this.textArea.placeholder = this.placeholder;
    if (this.disable === true) {
      this.textArea.setAttribute('disabled', 'true');
    } else {
      this.textArea.removeAttribute('disabled');
    }
    this.textArea.rows = this.rows;
    this.textArea.value = this.value;
    this.addEventListener('focusout', this.getValue);
    this.addEventListener('keydown', function () {
      this.shadowRoot.getElementById("max").innerHTML = null;
      this.shadowRoot.getElementById("min").innerHTML = null;
      this.shadowRoot.getElementById("require").innerHTML = null;
    })
  }

  getValue() {
    const inputValue = this.shadowRoot.querySelector("textarea").value;
    this.verify(inputValue);
    this.setAttribute('value', inputValue);
  }

  verify(inputValue) {
    this.deleteInnerHTML('require');
    this.deleteInnerHTML('max');
    this.deleteInnerHTML('min');
    if (inputValue === '' && this.required === true) {
      this.shadowRoot.getElementById("require").innerHTML = "This field is required";
      this.deleteInnerHTML('max');
      this.deleteInnerHTML('min');
      this.setAttribute('valid', 'false');
      return false;
    } else if (inputValue.length < this.min && this.min != null) {
      this.shadowRoot.getElementById("min").innerHTML = "Value cannot be less then " + this.min;
      this.deleteInnerHTML('max');
      this.deleteInnerHTML('require');
      this.setAttribute('valid', 'false');
      return false;
    } else if (inputValue.length > this.max && this.max != null) {
      this.shadowRoot.getElementById("max").innerHTML = "Value cannot be greater then " + this.max;
      this.deleteInnerHTML('require');
      this.deleteInnerHTML('min');
      this.setAttribute('valid', 'false');
      return false;
    } else {
      this.setAttribute('valid', 'true');
    }
  }

  deleteInnerHTML(div) {
    this.shadowRoot.querySelector('#' + div).innerHTML = null;
  }

  get placeholder() {
    return this.getAttribute('placeholder');
  }

  get rows() {
    return this.getAttribute('rows');
  }

  get min() {
    return this.getAttribute('min');
  }

  get max() {
    return this.getAttribute('max');
  }

  get required() {
    return this.hasAttribute('required');
  }

  get value() {
    return this.getAttribute('value');
  }

  get disable() {
    return this.hasAttribute('disable');
  }

  get validate() {
    return this.getAttribute('validate');
  }

  get borderNone() {
    return this.hasAttribute('border-none');
  }

  get height() {
    return this.getAttribute('height');
  }
}

window.customElements.define('text-area', TextArea);
