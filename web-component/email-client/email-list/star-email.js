import {EmailClientApi} from "../email-client-api.js";
import {SharedClass} from "../../../../src/shared/shared";
import {TranslateString} from "../../translate-string";

const templateStarEmail = document.createElement('template');
templateStarEmail.innerHTML = `
<style>
    div{
        font-size: 18px;
        cursor: pointer;
    }
    .selected-star{
        color: blue;
        font-weight: bolder;
        font-size: 20px!important;
    }
</style>
<div>&#9734;</div>
`;

export class StarEmail extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateStarEmail.content.cloneNode(true));
  }

  connectedCallback() {
    this.api= new EmailClientApi();
    window.addEventListener('emil-message-received', function (e) {
      if(this.id===e.detail.id.toString()){
        this.cardData= e.detail;
        if (this.cardData.type === 'starred') {
          this.shadowRoot.querySelector('div').classList.add('selected-star');
        } else {
          this.shadowRoot.querySelector('div').classList.remove('selected-star');
        }
      }
    }.bind(this));
    this.addEventListener('click', function () {
      this.starClicked();
    }.bind(this));
  }

  starClicked() {
    if (this.shadowRoot.querySelector('div').classList.contains('selected-star')) {
      this.shadowRoot.querySelector('div').classList.remove('selected-star');
      this.unMarkAsStar();
    } else {
      this.shadowRoot.querySelector('div').classList.add('selected-star');
      this.markAsStar();
    }
  }

  markAsStar() {
    let data={
      'userId': this.cardData.id_user,
      'emailAccountId': this.cardData.id_email_account,
      'messageId': this.cardData.id_message,
      'messageType': this.cardData.type,
      'id': this.cardData.id
    };
    this.api.markAsStared(data);
  }
  unMarkAsStar(){
    let data={
      'userId': this.cardData.id_user,
      'emailAccountId': this.cardData.id_email_account,
      'messageId': this.cardData.id_message,
      'messageType': this.cardData.type,
      'id': this.cardData.id
    };
    this.api.unMarkAsStar(data);
  }

  get id() {
    return this.getAttribute('id')
  }
}

window.customElements.define('star-email', StarEmail);
