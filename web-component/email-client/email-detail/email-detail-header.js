import {SharedClass} from "../../../../src/shared/shared";
import {TranslateString} from "../../translate-string";
import('../../custom-date');
const templateEmailDetailHeader = document.createElement('template');
templateEmailDetailHeader.innerHTML = `
<style>
    .subject{
        font-size: var(--text-heading);
    }
    .container{
        position: relative;
    }
    .header-icons{
        position: absolute;
        top: -40px;
        right: 5px;
        cursor: pointer;
    }
    .reply{
        font-weight: bolder;
        transform: rotate(177deg) scale(-1, 1);
        font-size: 27px;
        padding: 0 5px;
    }
    .forward{
        padding: 0 5px;    
        font-size: 21px;    
    }
    .cursor-pointer{
         cursor: pointer;
    }
    .row{
        display: flex;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px;
    }
    .sender-email{
        opacity: 0.7;
    }
    .sender-email, .sender-name, .date{
        padding:0 5px;
        font-size: var(--text-paragraph);
    }
</style>
<div class="container">
    <p class="subject"></p>
    <div class="header-icons row">
      <div class="reply" title="Reply" >
        <link-text id="route-reply">
            &#10558;
        </link-text>
      </div>
      <div class="forward" title="Forward">
        <link-text id="route-forward">
            &#10132;
        </link-text>
      </div>
      <span title="View in new page">
        <link-text id="new-window">
          <svg width="20px" height="20px" viewBox="0 0 1792 1792" fill="#4D4DB3" class="cursor-pointer" style="padding: 5px 5px 0">
              <path d="M888 1184l116-116-152-152-116 116v56h96v96h56zm440-720q-16-16-33 1l-350 350q-17 17-1 33t33-1l350-350q17-17 1-33zm80 594v190q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q63 0 117 25 15 7 18 23 3 17-9 29l-49 49q-14 14-32 8-23-6-45-6h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-126q0-13 9-22l64-64q15-15 35-7t20 29zm-96-738l288 288-672 672h-288v-288zm444 132l-92 92-288-288 92-92q28-28 68-28t68 28l152 152q28 28 28 68t-28 68z"></path>
          </svg>
        </link-text>
      </span>
    </div>
    <div class="row">
        <span class="sender-name" title="Sender"></span>
        <span class="sender-email" title="Sender Email"></span>
        <span class="date" title="Date">
            <custom-date></custom-date>
        </span>
    </div>
    <div id="email-body"></div>
</div>
`;

export class EmailDetailHeader extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailDetailHeader.content.cloneNode(true));
  }

  connectedCallback() {
    this.shared = new SharedClass();
    this.workspace = this.shared.getCookie('workspace');
  }

  static get observedAttributes() {
    return ['data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.email = JSON.parse(this.data);
    this.showData();
  }

  showData() {
    this.shadowRoot.querySelector('.subject').innerText = this.email.subject;
    this.shadowRoot.querySelector('.sender-email').innerText = '<' + this.email.from_mail + '>';
    this.shadowRoot.querySelector('.sender-name').innerText = this.email.from_personal;
    this.shadowRoot.querySelector('custom-date').setAttribute('date', this.email.date);
    this.shadowRoot.querySelector('#email-body').innerHTML = this.email.body;
    this.idEmailAccount = this.email.id_email_account;
    this.messageId = this.email.id;
    this.shadowRoot.querySelector('#new-window').setAttribute('route', `user/account/${this.idEmailAccount}/message/${this.messageId}`);
    this.shadowRoot.querySelector('#route-forward').setAttribute('route', `user/account/${this.idEmailAccount}/message/${this.messageId}/forward`);
    this.shadowRoot.querySelector('#route-reply').setAttribute('route', `user/account/${this.idEmailAccount}/message/${this.messageId}/reply`);
  }

  get data() {
    return this.getAttribute('data');
  }
}

window.customElements.define('email-detail-header', EmailDetailHeader);
