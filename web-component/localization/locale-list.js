import('./locale-option');
import {languages} from "./locales";

const templateLocaleList = document.createElement('template');
templateLocaleList.innerHTML = `
<style>
.cursorPointer{
    cursor: pointer;
}
input{
    width: 100%;
    padding: 6px 9px;
    margin: 0;
    box-sizing: border-box;
    background: transparent ;
    color: var(--primary-text, hsla(0, 0%, 0%, 1));
    font-size: var(--text-paragraph, 18px);
    border:1px solid #ccc;
}
 input:focus{
    outline: none;
}
</style>
    <input type="text" class="dropdown-input" placeholder="Search">
    <div id="languages-list"></div>
`;

export class LocaleList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateLocaleList.content.cloneNode(true));
  }

  connectedCallback() {
    this.loadLanguages(languages);
    this.shadowRoot.querySelector('input').addEventListener('keyup', function () {
      this.filterLanguage(this.shadowRoot.querySelector('input').value);
    }.bind(this));
  }

  filterLanguage(value) {
    this.shadowRoot.querySelector('#languages-list').innerHTML = ``;
    this.filteredLanguage = [];
    let character = value.length;
    for (let i = 0; i < languages.length; i++) {
      if (value.toLowerCase() === languages[i].language.slice(0, character).toLowerCase()) {
        this.filteredLanguage.push(languages[i])
      }
    }
    this.loadLanguages(this.filteredLanguage);
  }

  loadLanguages(languages) {
    let dropDown = this.shadowRoot.querySelector('#languages-list');
    dropDown.innerHTML = ``;
    this.getActiveLang();
    console.log(this.activeLang)
    for (let i = 0; i < languages.length; i++) {
      if (languages[i].code !== this.activeLang) {
        let language = document.createElement('locale-option');
        language.setAttribute('language', languages[i].language);
        language.addEventListener('click', e => {
          this.shadowRoot.querySelector('input').value = '';
          window.dispatchEvent(new CustomEvent('language-switched', {bubbles: true, detail: languages[i].code}));
          this.loadLanguages(languages)
        })
        dropDown.appendChild(language);
      }
    }
  }

  getActiveLang() {
    let langId = 0;
    for (let i = 0; i < languages.length; i++) {
      for (let j = 0; j < window.location.pathname.split('/').length; j++) {
        if (languages[i].code === window.location.pathname.split('/')[j]) {
          langId = i;
        }
      }
    }
    window.dispatchEvent(new CustomEvent('active-language-received', {
      bubbles: true,
      detail: languages[langId]
    }));
    return this.activeLang = languages[langId].code;
  }

}

window.customElements.define('locale-list', LocaleList);
