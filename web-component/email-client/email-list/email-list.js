import {EmailClientApi} from "../email-client-api.js";
import {languages} from "../../localization/locales";
import {TranslateString} from "../../translate-string";

import ('./email-card');
const templateEmailList = document.createElement('template');
templateEmailList.innerHTML = `
<style>
#configure-error{
    font-size: var(--text-heading);
}
#email-list{
    max-height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
}
::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
}
::-webkit-scrollbar-button {
    background: #ccc
}
::-webkit-scrollbar-track-piece {
    background: #eee
}
::-webkit-scrollbar-thumb {
    background: #888

}​
</style>
<div id="configure-error"></div>
<div id="email-list"></div>
`;

export class EmailList extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailList.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new EmailClientApi();
    this.emailAccountId = -1;
    this.labelId = undefined;
    this.pageNo = 1;
    this.selectedEmails = [];
    this.events();
  }

  events() {
    window.addEventListener('email-messages-received', function (e) {
      if (e.detail.data.status) {
        if (e.detail.data.message.data.length > 0) {
          this.type = e.detail.data.message.data[0].type;
        }
        this.cardData = e.detail;
        if (e.detail.data.message.data.length === 0) {
          this.shadowRoot.querySelector('#configure-error').innerHTML = 'No message Found.';
          this.shadowRoot.querySelector('#configure-error').style.padding = '30px'
        } else {
          this.generateEmailCard(e.detail);
        }
      } else {
        this.shadowRoot.querySelector('#configure-error').innerHTML = e.detail.data.message;
        this.shadowRoot.querySelector('#configure-error').style.padding = '30px'
      }
    }.bind(this));
    window.addEventListener('email-card-check-box-mutated', function (e) {
      this.checkedEmails();
    }.bind(this));
    window.addEventListener('get-email-messages', function (e) {
      this.api.getUserMessages(this.emailAccountId, this.type, this.labelId, this.pageNo);
    }.bind(this));
    window.addEventListener('user-multiple-account-labels-received', (e) => {
      this.getMessages(e.detail);
    });
    window.addEventListener('email-change-page-button-clicked', function (e) {
      if (e.detail === 'next') {
        this.pageNo++;
        this.api.getUserMessages(this.emailAccountId, this.type, this.labelId, this.pageNo);
      } else {
        this.pageNo--;
        this.api.getUserMessages(this.emailAccountId, this.type, this.labelId, this.pageNo);

      }
    }.bind(this));
    window.addEventListener('get-email-request-sent', function (e) {
      this.shadowRoot.querySelector('#email-list').innerHTML = ``;
      this.shadowRoot.querySelector('#configure-error').innerHTML = ``;
      this.shadowRoot.querySelector('#configure-error').style.padding = '0'
    }.bind(this));
    window.addEventListener("popstate", e => {
      this.type = e.state;
      this.api.getUserMessages(this.emailAccountId, this.type, this.labelId, this.pageNo);
    });
    window.addEventListener("email-label-clicked", e => {
      this.labelId = e.detail.id;
      this.emailAccountId = e.detail.account_id;
      this.type = 'label';
      this.api.getUserMessages(this.emailAccountId, this.type, this.labelId, this.pageNo);
    });
  }

  checkedEmails() {
    let selectedEmails = [];
    let emailCards = this.shadowRoot.querySelectorAll('email-card');
    for (let i = 0; i < emailCards.length; i++) {
      if (emailCards[i].getAttribute('checked') === 'true') {
        selectedEmails.push(emailCards[i].getAttribute('id'));
      }
    }
    this.checkedEmailAddress(selectedEmails);
  }

  checkedEmailAddress(emails) {
    this.selectedEmails = [];
    let data = this.cardData.data.message.data;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < emails.length; j++) {
        if (data[i].id.toString() === emails[j]) {
          this.selectedEmails.push({
            id: data[i].id,
            emailAccountId: data[i].id_email_account,
            userId: data[i].id_user,
            messageId: data[i].id_message,
            type: data[i].type,
            currentPage: data[i].current_page
          });
        }
      }
    }
    window.dispatchEvent(new CustomEvent('email-top-nav-link-status', {
      bubbles: true,
      composed: true,
      detail: this.selectedEmails
    }));
  }

  generateEmailCard(data) {
    this.shadowRoot.querySelector('#email-list').innerHTML = ``;
    if (data.data.messageList) {
      this.messages = data.data.messageList;
    } else {
      this.messages = data.data.message.data;
    }
    for (let i = 0; i < this.messages.length; i++) {
      let emailCard = document.createElement('email-card');
      emailCard.setAttribute('id', this.messages[i].id);
      this.shadowRoot.querySelector('#email-list').appendChild(emailCard);
    }
  }

  getMessages(e) {
    this.route = window.location.pathname.split('/')[4];
    if (!this.route) {
      this.type = 'inbox';
    } else if (this.route === 'inbox', this.route === 'sent', this.route === 'draft', this.route === 'starred', this.route === 'trash') {
      this.type = this.route;
    } else {
      this.emailAccountId = 1;
      this.type = "label";
      this.labelId = this.getLabelId(e, this.route);
    }
    this.api.getUserMessages(this.emailAccountId, this.type, this.labelId, this.pageNo);
  }

  getLabelId(data, name) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].email_labels.length; j++) {
        if (name === data[i].email_labels[j].name) {
          return data[i].email_labels[j].id;
        }
      }
    }
  }
}

window.customElements.define('email-list', EmailList);
