import {EmailClientApi} from "../email-client-api.js";
import {SharedClass} from "../../../../src/shared/shared";
import {TranslateString} from "../../translate-string";

import ('../../link-text');
// import('../../drop-down/drop-down');
// import('../../drop-down/drop-content');
import('./email-pages');
const templateEmailTopLink = document.createElement('template');
templateEmailTopLink.innerHTML = `
    <style>
    .top-bar-right{
        float: right;
        position: relative;
    }
    .setting{
        position: absolute;
        top: 9px;
        right: 2px;
    }
    li{
        display: inline;
        padding: 20px;
        position: relative;
    }
    li a{
        position: absolute;
        top: 28px;
        font-weight: bolder;
        cursor:pointer;
    }
    .actions{
        display: flex;
    }
    email-pages{
        margin-right: 200px;
    }
    </style>
    <div class="actions">
      <li>
        <a title="Delete all selected" type="moveToTrash" class="buttons">&#128465;</a>
      </li>
      <li id="mark-as-star">
        <a title="star all selected" type="markAsStarred" class="buttons">&#9734;</a>
      </li>
      <li>
        <a title="mark as read" type="markAsRead" class="buttons">&#128387;</a>
      </li>
<!--      <li>-->
<!--         <a title="move to folder" id="move-to-folder">-->
<!--         <drop-down search event="move-to-folder-option-selected">-->
<!--            <span slot="drop-down">&#128449;</span>-->
<!--         </drop-down>-->
<!--         </a>-->
<!--      </li>-->
    </div>
    <li>
        <span class="top-bar-right">
        <email-pages></email-pages>
            <link-text>
                <span class="setting">&#9881;</span>
            </link-text> 
        </span>
    </li>
`;

class EmailTopLink extends TranslateString {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateEmailTopLink.content.cloneNode(true));
  }

  connectedCallback() {
    this.shared = new SharedClass();
    this.api = new EmailClientApi();
    this.workspace = this.shared.getCookie('workspace');
    this.api.accountLabels(1);
    this.shadowRoot.querySelector('link-text').setAttribute('route', `email/configuration`);
    this.shadowRoot.querySelector('.actions').style.display = 'none';
    this.ManageEvents();
  }

  ManageEvents() {
    window.addEventListener('email-top-nav-link-status', function (e) {
      this.selectedMails = e.detail;
      if (e.detail.length > 0) {
        this.shadowRoot.querySelector('.actions').style.display = 'inline'
      } else {
        this.shadowRoot.querySelector('.actions').style.display = 'none'
      }
    }.bind(this));
    let buttons = this.shadowRoot.querySelectorAll('.buttons');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        this.performAction(buttons[i].getAttribute('type'));
      }.bind(this));
    }
    window.addEventListener('user-labels-received', function (e) {
      this.userLabels = e.detail;
      // this.addOptionsToFolderDropDown();
    }.bind(this));
    window.addEventListener('email-messages-received', function (e) {
      if (e.detail.data.message.data.length > 0) {
        if (e.detail.data.message.data[0].type === 'starred' || e.detail.data.message.data[0].type === 'trash') {
          this.shadowRoot.querySelector('#mark-as-star').style.display = 'none';
        } else {
          this.shadowRoot.querySelector('#mark-as-star').style.display = 'inline';
        }
      }
      this.setValuesToEmailPage(e);
    }.bind(this));
  }

  setValuesToEmailPage(e) {
    let emailPages = this.shadowRoot.querySelector('email-pages');
    emailPages.setAttribute('to', e.detail.data.message.to);
    emailPages.setAttribute('from', e.detail.data.message.from);
    emailPages.setAttribute('total', e.detail.data.message.total);
    emailPages.setAttribute('current-page', e.detail.data.message.current_page);
    emailPages.setAttribute('last-page', e.detail.data.message.last_page);
    emailPages.setAttribute('per-page', e.detail.data.message.per_page);
  }

  addOptionsToFolderDropDown() {
    let dropDown = this.shadowRoot.querySelector('drop-down');
    for (let i = 0; i < this.userLabels.length; i++) {
      let dropContent = document.createElement('drop-content');
      dropContent.innerText = this.userLabels[i].name;
      dropContent.setAttribute('value', this.userLabels[i].id);
      dropContent.setAttribute('slot', 'drop-content');
      dropDown.appendChild(dropContent)
    }
  }

  performAction(type) {
    let body = {
      messages: this.selectedMails,
      type: type,
      selectedLabelId: undefined
    };
    if (confirm('Are you sure you want to delete selected messages?')) {
      this.api.performAction(body);
    }
  }
}

window.customElements.define('email-top-link', EmailTopLink);

