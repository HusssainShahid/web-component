import {TranslateString} from "../../translate-string";

import ('./email-detail-header');
import('./email-attachment');
const templateEmailDetail = document.createElement('template');
templateEmailDetail.innerHTML = `
<style>
    .container{
        padding: 20px;
    }
    .heading{
        font-size: var(--text-title);
    }
    .container{
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
<div class="container">
  <p class="no-conversation-selected heading" data-translate="No conversation selected">No conversation selected</p>
  <div class="email-detail">
      <email-detail-header></email-detail-header>
      <email-attachment></email-attachment>
  </div>
</div>
`;

export class EmailDetail extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailDetail.content.cloneNode(true));
  }

  connectedCallback() {
    window.addEventListener('get-email-request-sent',function (e) {
      this.shadowRoot.querySelector('.email-detail').style.display = 'none';
      this.shadowRoot.querySelector('.no-conversation-selected').style.display = 'inline';
      this.shadowRoot.querySelector('.container').style.overflowY = 'hidden';
    }.bind(this));

    this.shadowRoot.querySelector('.email-detail').style.display = 'none';
    this.shadowRoot.querySelector('.container').style.overflowY = 'hidden';
    window.addEventListener('email-card-clicked', function (e) {
      this.shadowRoot.querySelector('.container').style.overflowY = 'scroll';
      this.showDetail(e.detail);
    }.bind(this));
  }
  showDetail(data){
    this.shadowRoot.querySelector('.email-detail').style.display = 'block';
    this.shadowRoot.querySelector('.no-conversation-selected').style.display = 'none';
    this.shadowRoot.querySelector('email-detail-header').setAttribute('data', JSON.stringify(data));
    this.shadowRoot.querySelector('email-attachment').setAttribute('id', data.id);
    this.shadowRoot.querySelector('email-attachment').setAttribute('email-account-id', data.id_email_account);
  }
}

window.customElements.define('email-detail', EmailDetail);
