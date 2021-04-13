import ('../wizard-form/wizard-form');
import ('../wizard-form/wizard-step');
import ('./work-space');
import ('./subscription');
const templateUserGuide = document.createElement('template');
templateUserGuide.innerHTML = `
<style>
    .card{
        padding: 30px 10%;
    }
    .heading{
        font-size: var(--text-heading, 28px);
        text-align: center;
    }
</style>
<div class="card">
    <wizard-form show-labels>
        <wizard-step>
            <work-space></work-space>
        </wizard-step>
        <wizard-step>
            <subscription-step></subscription-step>
        </wizard-step>
        <wizard-step>
            Organkization
        </wizard-step>
        <wizard-step>
            Business
        </wizard-step>
        <wizard-step>
            Office
        </wizard-step>
        <wizard-step>
            Currency
        </wizard-step>
        <wizard-step>
            Account
        </wizard-step>
    </wizard-form>
</div>
  `;

export class UserGuide extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateUserGuide.content.cloneNode(true));
  }

  connectedCallback() {
    let labels = ['Describe yourself', 'Team name', 'Welcome'];
    this.shadowRoot.querySelector('wizard-form').setAttribute('labels', JSON.stringify(labels))
  }
}

window.customElements.define('user-guide', UserGuide);
