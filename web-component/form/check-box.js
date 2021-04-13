const templateCheckBox = document.createElement('template');
templateCheckBox.innerHTML = `
<style>
  p{
    color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
    font-size: var(--text-caption, 14px);
    margin: 2px;
  }
</style>
<input type="checkbox">
<p id="require"></p>

`;

export class CheckBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateCheckBox.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['validate'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.getValue();
  }

  connectedCallback() {
    if(this.value){
      this.shadowRoot.querySelector('input').checked= true;
    }
    this.shadowRoot.querySelector('input').addEventListener('change', function () {
      if(this.shadowRoot.querySelector('input').checked){
        this.setAttribute('value', 'true')
      }else {
        this.setAttribute('value', 'false')
      }
    }.bind(this));
  }

  getValue() {
    this.verify(this.input.value);
    this.setAttribute('value', this.input.value);
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

  get required() {
    return this.hasAttribute('required');
  }

  get validate() {
    return this.getAttribute('validate');
  }

  get value() {
    return this.hasAttribute('value');
  }
}

window.customElements.define('check-box', CheckBox);
