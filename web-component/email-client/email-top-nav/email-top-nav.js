import {TranslateString} from "../../translate-string";

import ('./email-top-link');
const templateEmailTopNav = document.createElement('template');
templateEmailTopNav.innerHTML = `
    <style>
     nav {
      width: 100%;
      background: var(--secondary-base, hsla(0, 0%, 97%, 1));
      z-index: 1;
      border: 1px solid rgba(210,210,210,0.38);
    }
   
    nav ul {
      list-style-type: none;
      margin: 0;
      padding: 0 20px;
      overflow: hidden;
    }
    
    nav ul li {
      float: left;
      padding: 0 135px 0 0;
    }
    
    .toggle-side-bar {
      font-size: var(--text-label, 17px);
      display: block;
      color: black;
      text-align: center;
      padding: 9px 0 9px 6px;
      text-decoration: none;
      cursor: pointer;
    }
    </style>
<nav>
  <ul>
    <li>
      <a class="toggle-side-bar">
        &#9776;
      </a>
   </li>
   <email-top-link></email-top-link>
  </ul>
</nav>

`;

class EmailTopNav extends TranslateString {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateEmailTopNav.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.toggle-side-bar').addEventListener('click', function () {
    this.toggleSideBar();
    }.bind(this));
  }
  toggleSideBar(){
    window.dispatchEvent(new CustomEvent('toggle-side-bar-button-clicked'));
  }
}

window.customElements.define('email-top-nav', EmailTopNav);

