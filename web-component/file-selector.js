const TemplateFileSelector = document.createElement('template');
TemplateFileSelector.innerHTML = `
<style>
      input{
        display: none;
    }
</style>
<div class="container">
<input type="file">
<slot name="upload-button"></slot>
</div>
`;

export class FileSelector extends HTMLElement {


  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(TemplateFileSelector.content.cloneNode(true));
  }

  connectedCallback() {
    this.input = this.shadowRoot.querySelector('input');
    this.choosefiles = [];
    if (this.type === 'img') {
      this.input.setAttribute('accept', "image/*")
    }
    this.events();
  }

  events() {
    this.shadowRoot.querySelector('slot[name=upload-button]').addEventListener('click', e => {
      this.input.click();
    });
    this.input.addEventListener('change', e => {
      this.choosefiles = [];
      this.setFiles(e);
    })
  }

  setFiles(e) {
    this.file = '';
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.indexOf('image') !== -1) {
        this.addFile(files[i], 'image');
      } else {
        this.addFile(files[i], 'text');
      }
    }
  }

  addFile(file, type) {
    let ctx = this;
    let reader = new FileReader();
    reader.onloadend = function (res) {
      if (type === 'image') {
        ctx.choosefiles.push({src: res.target['result'], detail: file, text: false})
      } else if (type === 'text') {
        ctx.choosefiles.push({preview: ctx.getTextPreview(res.target['result']), detail: file, text: true})
      }
      window.dispatchEvent(new CustomEvent(ctx.event, {
        bubbles: true,
        composed: true,
        detail: ctx.choosefiles
      }));
    };
    if (type === 'image') {
      reader.readAsDataURL(file);
    } else if (type === 'text') {
      reader.readAsText(file);
    }
  }

  get event() {
    return this.getAttribute('event');
  }

  get type() {
    return this.getAttribute('type');
  }
}

window.customElements.define('file-selector', FileSelector);
