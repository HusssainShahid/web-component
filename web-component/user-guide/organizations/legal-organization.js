import('./../../form/input-text.js')

const legalOrganizationTemplate = document.createElement('template');
legalOrganizationTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
.heading{
    font-size: var(--text-heading, 28px);
    padding: 15px 0;
}
.field{
    margin-top: 5px;
}
.hint{
    font-size: 14px;
    color: #615e5e;
}
</style>
<div class="heading" data-translate="Organization / Company">Organization / Company</div>
<div style="width: 75%">
    <label data-translate="Organization Name">Organization Name</label>
        <div class="field">
            <input-text placeholder="Enter organization name" data-placeholder="Enter organization name" required max="256"></input-text>    
        </div>
        <p class="hint" data-placeholder="Select this category if you would like to manage a single company that is legally registered in your local business community">Select this category if you would like to manage a single company that is legally registered in your local business community</p>
</div>
`;


export default class LegalOrganization extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(legalOrganizationTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    window.addEventListener('user-guide-validate-organization', e => {
      if (e.detail === "Legal organization") {
        this.legalOrganization();
      }
    })
  }

  legalOrganization() {
    this.input = this.shadowRoot.querySelector('input-text');
    this.input.setAttribute('validate', 'true');
    if (this.input.getAttribute('valid') === 'true') {
      window.dispatchEvent(new CustomEvent('user-guide-organization-name', {
        bubbles: true,
        detail: {organizations: [this.input.getAttribute('value')], holdingCompany: null}
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

window.customElements.define('legal-organization', LegalOrganization);
