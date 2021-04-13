import {EmailClientApi} from "../email-client-api.js";
import {SharedClass} from "../../../../src/shared/shared";
import {TranslateString} from "../../translate-string";

import('../../form/check-box');
import('../../custom-date');
import('./email-name');
import('./email-subject');
import('./email-message');
import('./star-email');
const templateEmailCard = document.createElement('template');
templateEmailCard.innerHTML = `
<style>
    .card{
        padding: 10px;
        border: 1px solid #d6d6d6;
        border-radius: 3px;
        margin: 4px;
        font-size: var(--text-caption);
        min-height: 50px;
        display: flex;
        word-wrap: break-word;
    }
    .check-box{
        width: 7%;
    }
    .card-body{
        width: 90%;
        position: relative;
    }
    check-box{
        padding-top: 3px;
        cursor: pointer;
    }
    #date{
        font-size: var(--text-caption);
        position: absolute;
        right: 0;
        top: 0;
    }
    #star{
        position: absolute;
        bottom: 0;
        right: 0;
    }

    #subject{
        margin-top: 10px;
        cursor: pointer;
    }
    #subject:hover{
        color: blue;
    }
</style>
<div class="card">
    <div class="check-box">
        <check-box></check-box>
    </div>
    <div class="card-body">
        <div id="name">
            <email-name></email-name>
        </div>
        <span id="star">
            <star-email></star-email>
        </span>
        <div id="date">
            <custom-date></custom-date>
        </div>
        <div id="subject">
            <email-subject></email-subject>
        </div>    
        <div id="message">
            <email-message></email-message>
        </div>    
    </div>
</div>
`;

export class EmailCard extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailCard.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new EmailClientApi();
    this.api.getMessage(this.id);
    window.addEventListener('emil-message-received', function (e) {
      if (this.id === e.detail.id.toString()) {
        this.cardData = e.detail;
        this.addValues();
      }
    }.bind(this));
    this.shadowRoot.querySelector('#subject').addEventListener('click', function () {
      if (this.cardData.status === 'unseen') {
        this.api.updateStatus(this.cardData);
        this.shadowRoot.querySelector('.card').style.fontWeight = 'normal';
      }
      window.dispatchEvent(new CustomEvent('email-card-clicked', {
        bubbles: true,
        composed: true,
        detail: this.cardData
      }));
    }.bind(this));
    this.observeMutation();
  }

  observeMutation() {
    let that = this;
    const targetNode = this.shadowRoot.querySelector('check-box');
    const config = {attributes: true};
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        that.checkboxStatus(mutation.target);
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  checkboxStatus(target) {
    if(target.getAttribute('value')=== 'true'){
      this.setAttribute('checked', 'true')
    }else {
      this.setAttribute('checked', 'false')
    }
    window.dispatchEvent(new CustomEvent('email-card-check-box-mutated'));
  }

  addValues() {
    if (this.cardData.status === 'unseen') {
      this.shadowRoot.querySelector('.card').style.fontWeight = 'bold';
    }
    this.shadowRoot.querySelector('email-name').setAttribute('name', this.cardData.from_personal);
    this.shadowRoot.querySelector('custom-date').setAttribute('date', this.cardData.date);
    this.shadowRoot.querySelector('email-subject').setAttribute('subject', this.cardData.subject);
    this.shadowRoot.querySelector('star-email').setAttribute('id', this.cardData.id);
    this.shadowRoot.querySelector('email-message').setAttribute('body', this.cardData.body);
    this.shadowRoot.querySelector('email-message').setAttribute('length', '60');
  }

  get id() {
    return this.getAttribute('id');
  }
}

window.customElements.define('email-card', EmailCard);
