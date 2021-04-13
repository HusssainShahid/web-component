import('../../form/tag-input.js')
const groupOrganizationTemplate = document.createElement('template');
groupOrganizationTemplate.innerHTML = `

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
</style>
<div class="heading" data-tranlsate="Multiple organizations/ company">Multiple organizations/ company</div>
<div style="width: 75%">
    <label data-tranlate="Organization groups">Organization groups</label>
    <div class="field">
        <tag-input required hint="true"></tag-input>
    </div>
</div>
`;

export default class GroupOrganization extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(groupOrganizationTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    let regex = '^.{2,256}$';
    this.shadowRoot.querySelector('tag-input').setAttribute('regex', regex);
    window.addEventListener('user-guide-validate-organization', e => {
      if (e.detail === "Group of organization") {
        this.organizationGroup();
      }
    })
  }

  organizationGroup() {
    this.input = this.shadowRoot.querySelector('tag-input');
    this.input.setAttribute('validate', 'true');
    if (this.input.getAttribute('valid') === 'true') {
      window.dispatchEvent(new CustomEvent('user-guide-organization-name', {
        bubbles: true,
        detail: {organizations: JSON.parse(this.input.getAttribute('value')), holdingCompany: null}
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

window.customElements.define('group-organization', GroupOrganization);
