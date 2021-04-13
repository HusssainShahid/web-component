import('../../form/input-text.js')
import('../../form/tag-input.js');
const holdingCompanyTemplate = document.createElement('template');
holdingCompanyTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
.heading{
    font-size: var(--text-heading, 28px);
    padding: 15px 0;
}
.mb-10{
margin-bottom: 10px;
}
.field{
    margin-top: 5px;
}
</style>
<div class="heading" data-translate="Holding Company">Holding Company</div>
<div style="width: 75%">
  <div class="mb-10">
    <label data-translate="Holding company name">Holding company name</label>
        <div class="field">
                <input-text  placeholder="Enter holding company name" data-placeholder="Enter holding company name"  required max="256"></input-text>
        </div>
  </div>
  <div class="mb-10">
    <label data-translate="Organization names">Organization names</label>
        <div class="field">
    
    </div>
    <tag-input required hint="true"></tag-input>
  </div>
</div>`;

export default class HoldingCompany extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(holdingCompanyTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    let regex = '^.{2,256}$';
    this.shadowRoot.querySelector('tag-input').setAttribute('regex', regex);
    window.addEventListener('user-guide-validate-organization', e => {
      if (e.detail === "Holding company") {
        this.holderCompany();
      }
    })
  }

  holderCompany() {
    this.input = this.shadowRoot.querySelector('input-text');
    this.tagInput = this.shadowRoot.querySelector('tag-input');
    this.input.setAttribute('validate', 'true');
    this.tagInput.setAttribute('validate', 'true');
    if (this.input.getAttribute('valid') === 'true' && this.tagInput.getAttribute('valid') === 'true') {
      window.dispatchEvent(new CustomEvent('user-guide-organization-name', {
        bubbles: true,
        detail: {
          organizations: JSON.parse(this.tagInput.getAttribute('value')),
          holdingCompany: this.input.getAttribute('value')
        }
      }));
    }
  }

  static get observedAttributes() {
    return ['active'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.active === 'true') {
      this.style.display = 'inline';
    } else {
      this.style.display = 'none';
    }
  }

  get active() {
    return this.getAttribute('active');
  }
}

window.customElements.define('holding-company', HoldingCompany);
