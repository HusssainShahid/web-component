const templateRadioGroup = document.createElement('template');
templateRadioGroup.innerHTML = `
<div id="radio-group">
    <slot></slot>
</div>
`;

export class RadioGroup extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateRadioGroup.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.value == null) {
      this.setAttribute('value', '')
    } else {
      this.setAttribute('value', this.value);
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].addEventListener('click', function () {
        this.selectButton(i);
      }.bind(this));
      if (this.value === this.children[i].childNodes[0].data) {
      this.children[i].setAttribute('checked', 'checked')
      }
    }
  }

  selectButton(id) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].hasAttribute('checked')) {
        this.children[i].removeAttribute('checked');
      }
    }
    this.children[id].setAttribute('checked', 'checked');
    this.setAttribute('value', this.children[id].childNodes[0].data)
  }

  get value() {
    return this.getAttribute('value');
  }
}

window.customElements.define('radio-group', RadioGroup);
