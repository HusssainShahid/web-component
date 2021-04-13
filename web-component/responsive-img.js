const TemplateResponsiveImage = document.createElement('template');
TemplateResponsiveImage.innerHTML = `
<style>    
    img {
      width: 100%;
      height: 85%;
    }
</style>
<div><img></div>
`;

class ResponsiveImg extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(TemplateResponsiveImage.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('img').src = this.src;
    this.shadowRoot.querySelector('img').alt = this.alt;
    this.shadowRoot.querySelector('div').style.height = this.height;
    this.shadowRoot.querySelector('div').style.width = this.width;
  }

  get src() {
    return this.getAttribute('src');
  }

  get alt() {
    return this.getAttribute('alt');
  }

  get width() {
    return this.getAttribute('width');
  }

  get height() {
    return this.getAttribute('height');
  }
}

window.customElements.define('responsive-img', ResponsiveImg);
