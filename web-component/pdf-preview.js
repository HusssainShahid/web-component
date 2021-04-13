const templatePdfPreview = document.createElement('template');
templatePdfPreview.innerHTML = `
<div id="pdf"></div>
`;

export class PdfPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templatePdfPreview.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['pdf'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRoot.querySelector('#pdf').innerHTML = this.pdf;
  }

  get pdf() {
    return this.getAttribute('pdf');
  }
}

window.customElements.define('pdf-preview', PdfPreview);
