import ('./responsive-img');
const TemplateFileUpload = document.createElement('template');
TemplateFileUpload.innerHTML = `
<style>    
    input{
        display: none;
    }
    .image-section{
        display: flex;
        flex-wrap: wrap;
        position: absolute;
        top: -180px;
    }
    .file-selection{
        position: absolute;
        top: -230px;
        display: flex;
        flex-wrap: wrap;
    }
    .file{
        background: #EDEDED;
        color: #635FCD;
        position: relative;
        font-weight: bold;
        display: inline;
        margin: 5px;
        border-radius: 4px;
        padding: 5px 10px;
    }
    .cursor-pointer{
        cursor: pointer;
    }
    .close{
        position: absolute;
        right: 0;
        top: 8px;
    }
</style>
<div style="position: relative">
    <div class="image-section"></div>
    <div class="file-section"></div>
    <input type="file">
    <slot name="upload-button"></slot>
</div>
`;

class FileUpload extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(TemplateFileUpload.content.cloneNode(true));
  }

  connectedCallback() {
    this.input = this.shadowRoot.querySelector('input');
    if (this.multiple) {
      this.input.setAttribute('multiple', 'true');
    }
    this.maximumTextCharacters = 30;
    this.choosefiles = [];
    this.events();
  }

  events() {
    this.shadowRoot.querySelector('slot[name=upload-button]').addEventListener('click', e => {
      this.input.click();
    });
    this.input.addEventListener('change', e => {
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
      ctx.viewFiles();
    };
    if (type === 'image') {
      reader.readAsDataURL(file);
    } else if (type === 'text') {
      reader.readAsText(file);
    }
  }

  viewFiles() {
    this.shadowRoot.querySelector('.file-section').innerHTML = ``;
    this.shadowRoot.querySelector('.image-section').innerHTML = ``;
      for (let i = 0; i < this.choosefiles.length; i++) {
        if (!this.choosefiles[i].text) {
          this.showFile(this.choosefiles[i], i);
        } else {
          this.showFile(this.choosefiles[i], i);
        }
      }
    window.dispatchEvent(new CustomEvent('compose-email-selected-files', {
      bubbles: true,
      composed: true,
      detail: this.choosefiles
    }));
  }

  showImage(file, i) {
    let div = document.createElement('div');
    div.innerHTML = `
      <responsive-img src="${file.src}" width="100px" height="auto" style="margin:5px"></responsive-img>
    `;
    div.style.position = "relative"
    this.addCloseEvent(div, i)
    div.querySelector('span').classList.add('close');
    this.shadowRoot.querySelector('.image-section').appendChild(div);
  }

  showFile(file, i) {
    let div = document.createElement('div');
    div.classList.add('file');
    div.innerHTML =  file.detail.name.substring(0, 10);
    this.addCloseEvent(div, i);
    this.shadowRoot.querySelector('.file-section').appendChild(div);
  }

  addCloseEvent(div, i) {
    let close = document.createElement('span');
    close.classList.add('cursor-pointer');
    close.innerHTML = `
    <?xml version="1.0" encoding="utf-8"?>
    <svg width="15" height="15" fill="hsla(354, 70.3%, 44.9%, 1)" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg>
    `;
    close.addEventListener('click', e => {
      this.removeFile(i);
    })
    div.appendChild(close);
  }

  getTextPreview(text) {
    if (text.trim().length === 0) {
      return "Empty File";
    }
    let characters = this.maximumTextCharacters;
    if (text.length <= characters) {
      characters = 10;
    }
    return text.substr(0, characters);
  }

  removeFile(index) {
    this.shadowRoot.querySelector('input').value='';
    this.choosefiles.splice(index, 1);
    this.viewFiles();
  }

  formatBytes(a, b = 2) {
    if (0 === a) return "0 Bytes";
    const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));
    return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
  }

  get multiple() {
    return this.hasAttribute('multiple')
  }

  get event() {
    return this.getAttribute('event');
  }

  get preview() {
    return this.getAttribute('preview');
  }
}

window.customElements.define('file-upload', FileUpload);
