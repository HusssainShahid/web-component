import('./user-type.js');
import('./organization-name.js');
import('./thank-you.js');
import('./../button-component.js');
const userGuideTemplate = document.createElement('template');
userGuideTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
.container {
      min-height: 70vh;
      padding:30px;
      position: relative;
      color: var(--primary-text);
}
.footer{
    position: absolute;
    bottom: 35px;
    width: 100%;
}
.footer-container{
   display: flex;
   justify-content: space-between;
   padding: 0 74px 0 30px;
}
.error{
    color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
    font-size: var(--text-caption, 14px);
    margin: 2px;
    padding-left: 30px;
}
</style>
<div class="container">
    <user-type id="tab"></user-type>
    <organization-name id="tab"></organization-name>
    <thank-you id="tab"></thank-you>
    <div class="error"></div>
    <div class="footer">
        <div class="footer-container">
            <button-component is="primary" content="previous" data-content="previous" id="previous"></button-component>
            <button-component is="primary" content="next" data-content="next"  id="next"></button-component> 
        </div>      
    </div>
</div>
`;

export default class UserGuide extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(userGuideTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.activeTab = 0;
    this.selectedUserType = '';
    this.events();
    this.showActiveTab();
    this.navigationButtonVisibility();
  }

  events() {
    window.addEventListener('user-type-selected', e => {
      this.shadowRoot.querySelector('.error').innerHTML = '';
      this.selectedUserType = e.detail;
    });
    window.addEventListener('user-guide-next-tab', e => {
      this.next();
    });
    window.addEventListener('user-guide-organization-name', e => {
      this.next();
    });
    window.addEventListener('user-guide-next-clicked', e => {
      this.shadowRoot.querySelector('.error').innerHTML = '';
      if (this.activeTab === 0) {
        if (this.selectedUserType === '') {
          this.shadowRoot.querySelector('.error').innerHTML = "Please select one of these options";
        } else {
          this.next();
        }
      }
    });
    this.shadowRoot.querySelector('#next').addEventListener('click', e => {
      window.dispatchEvent(new CustomEvent('user-guide-next-clicked', {bubbles: true, detail: this.activeTab}));
    });
    this.shadowRoot.querySelector('#previous').addEventListener('click', e => {
      if (this.selectedUserType === "Freelancer") {
        this.activeTab = 0;
        this.showActiveTab();
      } else {
        this.previous();
      }
    });
  }

  next() {
    if(this.activeTab===1){
      this.shadowRoot.querySelector('#next').setAttribute('content', 'Lets jump in');
      this.shadowRoot.querySelector('#next').shadowRoot.querySelector('.button').style.padding='13px 22px'
      this.shadowRoot.querySelector('#next').shadowRoot.querySelector('.button').style.fontSize='16px';
      this.shadowRoot.querySelector('.footer-container').style.justifyContent='center';
      this.shadowRoot.querySelector('#previous').style.position='absolute';
    }else {
      this.shadowRoot.querySelector('#next').setAttribute('content', 'Next')
    }
    this.activeTab = this.activeTab + 1;
    this.showActiveTab();
  }

  previous() {
    if (this.activeTab === 1) {
      this.activeTab = this.activeTab - 1;
      this.showActiveTab();
    }
  }

  showActiveTab() {
    this.tabs = this.shadowRoot.querySelectorAll('#tab');
    for (let i = 0; i < this.tabs.length; i++) {
      if (i === this.activeTab) {
        this.tabs[i].setAttribute('active', 'true');
      } else {
        this.tabs[i].setAttribute('active', 'false');
      }
    }
    this.navigationButtonVisibility();
  }

  navigationButtonVisibility() {
    if (this.activeTab === 1) {
      this.shadowRoot.querySelector('#previous').style.opacity = 1;
    } else {
      this.shadowRoot.querySelector('#previous').style.opacity = 0;
    }
  }
}

window.customElements.define('user-guide', UserGuide);
