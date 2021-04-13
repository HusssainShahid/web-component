import {fields} from './fields';

const templateFormField = document.createElement('template');
templateFormField.innerHTML = `
<form>
    <slot></slot>
    <slot name="submit"></slot>
</form>
`;

export class FormField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateFormField.content.cloneNode(true));
  }

  connectedCallback() {
    this.fields = [];
    this.data = [];
    this.getFields();
    this.addEnterEvent(this.getFields());
    this.shadowRoot.querySelector('slot[name=submit]').addEventListener('click', function () {
      this.getValues(this.getFields());
    }.bind(this));
  }
  
  getFields() {
    this.fields = [];
    for (let i = 0; i < this.childNodes.length; i++) {
      for (let j = 0; j < fields.length; j++) {
        if(this.childNodes[i].tagName){
          if (fields[j] === this.childNodes[i].tagName.toLowerCase()) {
            this.fields.push(this.childNodes[i]);
          }
        }
        if(this.childNodes[i].children){
          for (let k = 0; k < this.childNodes[i].children.length; k++) {
            if (fields[j] === this.childNodes[i].children[k].tagName.toLowerCase()) {
              this.fields.push(this.childNodes[i].children[k]);
            }
          }
        }
      }
    }
    return this.fields;
  }


  getValues(field) {
    this.keyValues = this.key.split(',');
    this.data = [];
    for (let i = 0; i < field.length; i++) {
      if (field[i].shadowRoot) {
        field[i].setAttribute('validate', 'true');
        if (field[i].getAttribute('valid') === 'true') {
          this.data[this.keyValues[i]] = field[i].getAttribute('value');
        }
      } else {
        this.data[this.keyValues[i]] = field[i].value;
      }
      if (Object.keys(this.data).length === this.keyValues.length) {
        window.dispatchEvent(new CustomEvent(this.event, {
          bubbles: true, detail: this.data
        }));
      }
    }
  }

  addEnterEvent(fields) {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].shadowRoots) {
        fields[i].shadowRoots.querySelector("input").addEventListener('keyup', function (e) {
          if (e.keyCode === 13) {
            this.shadowRoot.querySelector('slot[name=submit]').click();
          }
        }.bind(this))
      } else {
        fields[i].addEventListener('keyup', function (e) {
          if (e.keyCode === 13) {
            this.shadowRoot.querySelector('slot[name=submit]').click();
          }
        }.bind(this))
      }
    }
  }

  get event() {
    return this.getAttribute('event')
  }

  get key() {
    return this.getAttribute('key')
  }
}

window.customElements.define('form-field', FormField);
