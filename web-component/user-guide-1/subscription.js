import ('../form/radio-button');
import ('../form/radio-group');
import ('../form/form-field');
import ('../button-component');
import ('../link-text');

const templateSubscription = document.createElement('template');
templateSubscription.innerHTML = `
<style>
    .container{
        border-top: 1px solid #e5e5e5;
        padding: 20px 5%;
        margin-top: 40px;
    }
    link-text{
        display: none;
    }
</style>
 <div class="container">
    <label>Subscription</label>
     <radio-group value="Start your 30 days free trial">
        <radio-button>Start your 30 days free trial</radio-button>
        <radio-button>Purchase new key</radio-button>
        <radio-button>Enter key</radio-button> 
    </radio-group>
   <link-text route="subscriptions">subscriptions</link-text>
</div>
`;

export class Subscription extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateSubscription.content.cloneNode(true));
  }

  connectedCallback() {
    this.observeMutationOnRadio();
  }

  observeMutationOnRadio() {
    const targetNode = this.shadowRoot.querySelector('radio-group');
    const config = {attributes: true};
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  static get observedAttributes() {
    return ['validate'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //fire next
  }


  get validate() {
    return this.getAttribute('validate');
  }
}

window.customElements.define('subscription-step', Subscription);
