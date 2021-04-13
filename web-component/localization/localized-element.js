import('./locale-list');
import {languages} from './locales';
const templateLocalizeElement = document.createElement('template');
templateLocalizeElement.innerHTML = `
<style>
.text-center{
    text-align: center;
}
.dropdown {
  position: relative;
  display: inline;
  font-size: var(--text-caption, 14px);
}
.cursorPointer{
    cursor: pointer;
}
.dropdown-content-right {
  right: 0;
}

.dropdown-content-left {
  left: 0;
}

.dropdown:hover .dropdown-content {
  display: block;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: var(--primary-base);
  min-width: 160px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 4px;
  padding: 5px 0;
  left: -22px;
  top: 15px;
}

</style>
<div class="dropdown">
      <span class="cursorPointer">Language: <span id="selected-language"></span></span>
          <div class="dropdown-content">
          <locale-list></locale-list>
      </div>&#9660;
    </div>
  `;

export class LocalizedElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateLocalizeElement.content.cloneNode(true));
  }

  connectedCallback() {
    window.addEventListener('active-language-received', function (e) {
      this.shadowRoot.querySelector('#selected-language').innerHTML = e.detail.language;
    }.bind(this));
  }
}

window.customElements.define('locale-selector', LocalizedElement);
