const templateWizardStep = document.createElement('template');
templateWizardStep.innerHTML = `
 <div>
 <slot></slot>
</div>
`;

export class WizardStep extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateWizardStep.content.cloneNode(true));
  }

  connectedCallback(){
  }

  static get observedAttributes() {
    return ['validate'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.children[0].setAttribute('validate', 'true');
  }


  get validate() {
    return this.getAttribute('validate');
  }
}

window.customElements.define('wizard-step', WizardStep);
