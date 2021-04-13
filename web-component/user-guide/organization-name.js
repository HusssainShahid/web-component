import('./organizations/freelance-team.js');
import('./organizations/holding-company.js');
import('./organizations/group-organization.js');
import('./organizations/legal-organization.js');
const organizationNameTemplate = document.createElement('template');
organizationNameTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
</style>
<freelance-team id="organizations"></freelance-team>
<legal-organization id="organizations"></legal-organization>
<group-organization id="organizations"></group-organization>
<holding-company id="organizations"></holding-company>
`;

export default class OrganizationName extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(organizationNameTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.organizationTypes = ['Freelancer team', 'Legal organization', 'Group of organization', 'Holding company'];
    this.organizations = this.shadowRoot.querySelectorAll('#organizations');
    window.addEventListener('user-type-selected', e => {
      this.selectedUserType = e.detail;
    });
    window.addEventListener('user-guide-next-clicked', e => {
      if (e.detail === 1) {
        for (let i = 0; i < this.organizationTypes.length; i++) {
          if (this.selectedUserType === this.organizationTypes[i]) {
            window.dispatchEvent(new CustomEvent('user-guide-validate-organization', {
              bubbles: true,
              detail: this.selectedUserType
            }));
          }
        }
      }
    });
  }

  showSelectedOrganizationFields() {
    for (let i = 0; i < this.organizationTypes.length; i++) {
      if (this.selectedUserType === this.organizationTypes[i]) {
        this.organizations[i].setAttribute('active', 'true');
      } else {
        this.organizations[i].setAttribute('active', 'false');
      }
    }
  }

  static get observedAttributes() {
    return ['active'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.active === 'true') {
      this.style.display = 'inline';
      if (this.selectedUserType === "Freelancer") {
        window.dispatchEvent(new CustomEvent('user-guide-next-tab'));
      }
      this.showSelectedOrganizationFields();
    } else {
      this.style.display = 'none';
    }
  }

  get active() {
    return this.getAttribute('active');
  }
}

window.customElements.define('organization-name', OrganizationName);
