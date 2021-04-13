import {languages} from "./localization/locales";

export class TranslateString extends HTMLElement{
  constructor() {
    super();
  }

  connectedCallback(){
    window.addEventListener('active-language-received', function (e) {
      this.activeLang = e.detail.code;
      this.importLanguage(this.activeLang);
    }.bind(this));
    window.addEventListener('data-attribute-added', function (e) {
      this.importLanguage(this.activeLang);
    }.bind(this));
  }

  importLanguage(language) {
    for (let i = 0; i < languages.length; i++) {
      history.replaceState('', '', `${window.location.pathname.replace(languages[i].code, language)}`);
    }
    if (language === 'en-US') {
      if (this.shadowRoot !== null) {
        this.defaultLanguage();
      }
    } else {
      import(`../../src/locales/${language}/translation.json`).then(module => {
        this.translation = module.default;
        this.translate();
      });
    }
  }

  translate() {
    let data = ['[data-translate]', '[data-placeholder]', '[data-content]'];
    for (let k = 0; k < data.length; k++) {
      this.text = this.shadowRoot.querySelectorAll(data[k]);
      for (let i = 0; i < this.text.length; i++) {
        for (let j = 0; j < Object.keys(this.translation).length; j++) {
          if (this.text[i].getAttribute('data-translate') === Object.keys(this.translation)[j]) {
            this.text[i].innerHTML = this.translation[Object.keys(this.translation)[j]];
          }
          if (this.text[i].getAttribute('data-placeholder') === Object.keys(this.translation)[j]) {
            this.text[i].setAttribute('placeholder', this.translation[Object.keys(this.translation)[j]]);
          }
          if (this.text[i].getAttribute('data-content') === Object.keys(this.translation)[j]) {
            this.text[i].setAttribute('content', this.translation[Object.keys(this.translation)[j]]);
          }
        }
      }
    }
  }

  defaultLanguage() {
    this.text = this.shadowRoot.querySelectorAll('[data-translate]');
    for (let i = 0; i < this.text.length; i++) {
      this.text[i].innerHTML = this.text[i].getAttribute('data-translate');
    }
    this.placeholder = this.shadowRoot.querySelectorAll('[data-placeholder]');
    for (let i = 0; i < this.placeholder.length; i++) {
      this.placeholder[i].setAttribute('placeholder', this.placeholder[i].getAttribute('data-placeholder'));
    }
    this.content = this.shadowRoot.querySelectorAll('[data-content]');
    for (let i = 0; i < this.content.length; i++) {
      this.content[i].setAttribute('content', this.content[i].getAttribute('data-content'));
    }
  }

}

window.customElements.define('translate-string', TranslateString);
