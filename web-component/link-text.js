const templateLinkText = document.createElement('template');
templateLinkText.innerHTML = `
<a style="cursor:pointer; color: var(--links-color, hsla(240, 40.2%, 50.2%, 1))">
<slot></slot>
</a>
`;

export class LinkText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateLinkText.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('a').target= this.target;
    this.shadowRoot.querySelector('a').addEventListener('click', function () {
      this.userSignIn();
      if(this.userSignIn()){
        window.dispatchEvent(new CustomEvent('dashboard-link-clicked', { bubbles: true, detail: this.route }));
      }else {
        window.dispatchEvent(new CustomEvent('app-link-clicked', { bubbles: true, detail: this.route }));
      }
    }.bind(this))
  }
  userSignIn(){
    return !!(this.getCookie('id') && this.getCookie('token'));
  }

  getCookie(cname){
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      while (ca[i].charAt(0) === ' ') {
        ca[i] = ca[i].substring(1);
      }
      if (ca[i].indexOf(name) === 0) {
        return ca[i].substring(name.length, ca[i].length);
      }
    }
    return "";
  }

  get route() {
    return this.getAttribute('route');
  }

  get target() {
    return this.getAttribute('target');
  }
}

window.customElements.define('link-text', LinkText);
