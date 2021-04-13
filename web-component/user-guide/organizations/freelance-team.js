import('./../../form/input-text.js')
const freelanceTeamTemplate = document.createElement('template');
freelanceTeamTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
.heading{
    font-size: var(--text-heading, 28px);
    padding: 15px 0;
    margin: 0;
}
.field{
    margin-top: 5px;
}
.hint{
    font-size: 14px;
    color: #615e5e;
}
</style>
<p class="heading">Freelance team</p>
<div style="width: 75%">
<label data-tranlate="Team Name">Team Name</label>
    <div class="field">
        <input-text placeholder="Enter team name" data-placeholder="Enter team name" required max="256"></input-text>    
    </div>
    <p class="hint" data-translate="Have you named your team yet? Please enter a name for your team you can add any name which can help us identify your team.">Have you named your team yet? Please enter a name for your team you can add any name which can help us identify your team.</p>
</div>
`;

export default class FreelanceTeam extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(freelanceTeamTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    window.addEventListener('user-guide-validate-organization', e => {
      if (e.detail === "Freelancer team") {
        this.freelanceTeam();
      }
    })
  }

  freelanceTeam() {
    this.input = this.shadowRoot.querySelector('input-text');
    this.input.setAttribute('validate', 'true');
    if (this.input.getAttribute('valid') === 'true') {
      window.dispatchEvent(new CustomEvent('user-guide-organization-name', {
        bubbles: true,
        detail: {organizations: [this.input.getAttribute('value')], holdingCompany:null}
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

window.customElements.define('freelance-team', FreelanceTeam);
