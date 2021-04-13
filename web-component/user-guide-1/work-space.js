import {UserGuideApi} from "./user-guide-api";

import ('../form/input-text');
import ('../form/form-field');
import ('../button-component');
const templateWorkspace = document.createElement('template');
templateWorkspace.innerHTML = `
<style>
    .container{
        border-top: 1px solid #e5e5e5;
        padding: 20px 5%;
        margin-top: 40px;
    }
    .w-50{
        width: 50%;
    }
    .d-none{
        display: none;
    }
    
   .text-success{
    color:#28a745
   }
   .text-danger{
    color:#C32232
   }
.waiting-spinner {
  margin: 100px auto 0;
  width: 70px;
  text-align: center;
}

.waiting-spinner > span {
  width: 8px;
  height: 8px;
  background-color: #28a745;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.waiting-spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.waiting-spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0)
  }
  40% {
    -webkit-transform: scale(1.0)
  }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>
 <div class="container">
    <div class="w-50">
      <form-field event="guide-workspace-added">
          <label>Workspace</label>
          <input-text placeholder="Enter workspace name" required></input-text>
          <span id="workspace-message"></span>
          <small class="text-success" id="checking-availability">Checking availability
              <span class="waiting-spinner">
                  <span class="bounce1"></span>
                  <span class="bounce2"></span>
                  <span class="bounce3"></span>
              </span>
          </small>
        <div slot="submit" class="d-none" id="submit-form">
          <button-component content="Next" is="primary"></button-component>      
        </div>
      </form-field>
    </div>
 </div>
`;

export class WorkSpace extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateWorkspace.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new UserGuideApi();
    this.shadowRoot.querySelector('#checking-availability').style.display = 'none';
    setTimeout(function () {
      let workspace = this.shadowRoot.querySelector('input-text').shadowRoot.querySelector('input');
      workspace.addEventListener('keyup', function () {
        this.workspaceAvailability(workspace.value);
      }.bind(this));
    }.bind(this), 1000);
    this.formKeys = ['workspace'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    window.addEventListener('guide-workspace-added', function (e) {
      window.dispatchEvent(new CustomEvent('change-step', {bubbles: true, composed: true, detail: {
        activeStep: "Workspace",
         moveTo: "Subscription"
         }}));
    });
    window.addEventListener('workspace-availability-response', function (e) {
      this.workspaceAvailabilityResponse(e.detail);
    }.bind(this))

  }

  workspaceAvailability(name) {
    this.shadowRoot.querySelector('#workspace-message').innerHTML = '';
    if (name.length > 0) {
      this.shadowRoot.querySelector('#checking-availability').style.display = 'inline';
      this.api.workspaceAvailability(name);
    }
  }

  workspaceAvailabilityResponse(data) {
    this.shadowRoot.querySelector('#checking-availability').style.display = 'none';
    if (data === 'false') {
      this.shadowRoot.querySelector('#workspace-message').innerHTML = '';
    } else {
      this.shadowRoot.querySelector('#workspace-message').innerHTML = 'Workspace name already exist.';
      this.shadowRoot.querySelector('#workspace-message').classList.add('text-danger');
    }
  }

  static get observedAttributes() {
    return ['validate'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
      this.shadowRoot.querySelector('#submit-form').click();
  }

  get validate() {
    return this.getAttribute('validate');
  }
}

window.customElements.define('work-space', WorkSpace);
