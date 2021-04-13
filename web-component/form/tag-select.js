import('../pill-badge');
const templateTagSelect = document.createElement('template');
templateTagSelect.innerHTML = `
<style>
    .tag-select-container{
        border: 1px solid #cccccc;
        padding: 5px;
        cursor: text;
        border-radius: 4px;
    }
    select {
       appearance: none;
       border: none;
       width: 100%;
    }
    select:focus{
        outline: none;
    }
    #require{
      color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
      font-size: var(--text-caption, 14px);
      margin: 2px;
    }
</style>
<div class="tag-select-container">
    <span class="tags"></span>
    <select></select>
</div>
<div id="require"></div>
`;

export class TagSelect extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateTagSelect.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['validate', 'options', 'reset'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'validate') {
      this.verify();
    } else if (name === 'options') {
      this.setOptions();
    } else if (name === 'reset') {
      this.select = this.shadowRoot.querySelector('select');
      this.select.value = '';
      let tags = this.shadowRoot.querySelector('.tags');
      tags.innerHTML = '';
      this.tags=[];
    }
  }

  connectedCallback() {
    this.select = this.shadowRoot.querySelector('select');
    this.container = this.shadowRoot.querySelector('.tag-select-container');
    this.tags = [];
    this.valid = true;
    this.select.addEventListener('change', e => {
      this.addValue();
    });
  }

  setOptions() {
    this.select = this.shadowRoot.querySelector('select');
    this.select.innerHTML=``;
    this.selectOptions = JSON.parse(this.options);
    let placeholder = document.createElement('option');
    placeholder.setAttribute('disabled', 'disabled');
    placeholder.setAttribute('selected', 'selected');
    if (this.placeholder) {
      placeholder.innerText = this.placeholder
    } else {
      placeholder.innerText = 'Choose Option';
    }
    this.select.add(placeholder);
    for (let i = 0; i < this.selectOptions.length; i++) {
      let option = document.createElement('option');
      option.setAttribute('value', this.selectOptions[i][this.model]);
      option.text = this.selectOptions[i][this.optionText];
      this.select.add(option);
    }
  }

  addValue() {
    if (this.select.value !== '') {
      for (let i = 0; i < this.tags.length; i++) {
        if (this.select.value === this.tags[i]) {
          this.select.value = '';
          return
        }
      }
      this.tags.push(this.select.value);
      this.addTag(this.tags);
      this.setAttribute('value', JSON.stringify(this.tags));
      this.select.value = '';
    }
  }

  addTag(data) {
    let tags = this.shadowRoot.querySelector('.tags');
    tags.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      let pillBadge = document.createElement('pill-badge');
      pillBadge.setAttribute('show-cross-button', 'show-cross-button');
      pillBadge.setAttribute('id', i);
      for (let j = 0; j < this.selectOptions.length; j++) {
        if (parseInt(data[i]) === this.selectOptions[j][this.model]) {
          pillBadge.innerText = this.selectOptions[j][this.optionText];
        }
      }
      tags.appendChild(pillBadge);
      pillBadge.shadowRoot.querySelector('.close').addEventListener('click', function () {
        this.removePill(i);
      }.bind(this));
    }
  }

  verify() {
    this.shadowRoot.getElementById("require").innerHTML = null;
    if (this.tags.length === 0 && this.required === true) {
      this.shadowRoot.getElementById("require").innerHTML = 'This field is required';
      this.setAttribute('valid', 'false');
      return false;
    }
    if (this.valid) {
      this.setAttribute('valid', 'true');
    } else {
      this.setAttribute('valid', 'false');
      return false;
    }
    return true;
  }

  removePill(index) {
    this.tags.splice(index, 1);
    this.valid = true;
    this.addTag(this.tags);
    this.setAttribute('value', JSON.stringify(this.tags));
  }

  get required() {
    return this.hasAttribute('required');
  }

  get options() {
    return this.getAttribute('options')
  }

  get model() {
    return this.getAttribute('model')
  }

  get optionText() {
    return this.getAttribute('option-text')
  }

  get placeholder() {
    return this.getAttribute('placeholder')
  }

  get reset() {
    return this.getAttribute('reset')
  }
}

window.customElements.define('tag-select', TagSelect);

