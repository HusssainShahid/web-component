import ('../progress-bar');
import ('../button-component');
const templateWizardForm = document.createElement('template');
templateWizardForm.innerHTML = `
  <style>
      .wizard-container{
        width: 100%;
        min-height: 410px;
        margin-top: 30px;
        padding-top: 20px;
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        position: relative;
      }
      .navigation-buttons{
        display: flex;
      }
      #previous{
        bottom: 5px;
        position: absolute;
        left: 5px;
      }
      #next{
        bottom: 5px;
        position: absolute;
        right: 5px;
      }
      ::slotted(*){
        padding: 1px;
      }
  </style>
  <div class="wizard-container">
    <progress-bar></progress-bar>
    <slot></slot>
    <div class="navigation-buttons">
      <button-component content="Previous" is="primary" id="previous"></button-component>
      <button-component content="Next" is="primary" id="next"></button-component>
    </div>
  </div>
`;

export class WizardForm extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateWizardForm.content.cloneNode(true));
  }

  connectedCallback() {
    this.activeStep = 0;
    this.activateStep(this.activeStep);
    this.shadowRoot.querySelector('#next').addEventListener('click', function () {
      this.children[this.activeStep].setAttribute('validate', 'true');
    }.bind(this));
    this.shadowRoot.querySelector('#previous').addEventListener('click', function () {
      this.activeStep = this.activeStep - 1;
      this.activateStep(this.activeStep);
      this.shadowRoot.querySelector('progress-bar').setAttribute('active-step', [this.activeStep+1].toString());
    }.bind(this));
    window.addEventListener('change-step', function (e) {
      for (let i = 0; i < JSON.parse(this.labels).length; i++) {
        if (e.detail.moveTo === JSON.parse(this.labels)[i]) {
          this.activeStep = i;
          this.activateStep(i);
          this.shadowRoot.querySelector('progress-bar').setAttribute('active-step', [this.activeStep+1].toString());
        }
      }
    }.bind(this));
  }

  setProgressBar() {
    if (this.showLabels) {
      this.shadowRoot.querySelector('progress-bar').setAttribute('show-labels', this.showLabels.toString());
    }
    this.shadowRoot.querySelector('progress-bar').setAttribute('labels', this.labels);
    this.shadowRoot.querySelector('progress-bar').setAttribute('rounded', 'true');

  }

  activateStep(id) {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].style.display = 'none';
    }
    this.children[id].style.display = 'inline';
    if (this.activeStep === 0) {
      this.shadowRoot.querySelector('#previous').style.display = 'none';
    } else {
      this.shadowRoot.querySelector('#previous').style.display = 'inline';
    }
  }

  static get observedAttributes() {
    return ['labels'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(this.labels){
      this.setProgressBar();
    }
  }
    get labels() {
    return this.getAttribute('labels');
  }

  get showLabels() {
    return this.hasAttribute('show-labels');
  }
}

window.customElements.define('wizard-form', WizardForm);
