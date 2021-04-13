const templateSelectField = document.createElement('template');
templateSelectField.innerHTML = `
<style>
select {
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
  select:focus{
    outline: none;
}
  ::slotted(*){
        display: none;
  }
  .error{
    color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
    font-size: var(--text-caption, 14px);
    margin: 2px;
  }
  select:disabled {
    background: #dddddd;
  }
</style>
<div>
<select></select>
<slot></slot>
</div>
<div id="require" class="error"></div>
`;

class SelectField extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateSelectField.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['validate', 'value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'validate') {
      this.verify();
    }

    if(name=== 'value'){
      this.shadowRoot.querySelector('select').value= this.value;
    }
  }

  connectedCallback() {
    this.select = this.shadowRoot.querySelector('select');
    if(this.borderNone){
      this.select.style.border='none';
    }
    this.showOption();
    if (this.disable === true) {
      this.select.setAttribute('disabled', 'true');
    } else {
      this.select.removeAttribute('disabled');
    }
    this.select.addEventListener('change', e => {
      this.setAttribute('value', this.select.value)
    })
    this.generateOption();
  }

  showOption() {
    window.addEventListener('select-field-options-received', e => {
      this.generateOption()
    });
  }

  generateOption(){
    for (let i = 0; i < this.children.length; i++) {
      let option = document.createElement('option');
      option.innerHTML = this.children[i].innerHTML
      option.setAttribute('value', this.children[i].getAttribute('value'))
      this.select.appendChild(option);
    }
    this.setAttribute('value', this.select.value)
  }
  verify() {
    if(this.require){
      if(this.select.value === null || this.select.value === '' || this.select.value === '-1' || this.select.value === 'null'){
        this.shadowRoot.querySelector('#require').innerHTML='This field is required.';
        this.setAttribute('valid', 'false');
        return false;
      }
    }else {
      this.shadowRoot.querySelector('#require').innerHTML='';
      this.setAttribute('valid', 'true');
      return true;
    }
  }

  get validate() {
    this.getAttribute('validate')
  }

  get value() {
    return this.getAttribute('value')
  }

  get disable() {
    return this.hasAttribute('disable');
  }
  get require() {
    return this.hasAttribute('require');
  }

  get borderNone() {
    return this.hasAttribute('border-none');
  }
}

window.customElements.define('select-field', SelectField);

