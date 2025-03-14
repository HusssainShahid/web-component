const TemplateFileInput = document.createElement('template');
TemplateFileInput.innerHTML = `
<style>
*,
*::before,
*::after {
  box-sizing: border-box; 
}
.input-container{
    margin: 0 20px;
}
.file{
    position: relative;
    display: inline-block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    margin-bottom: 0;
}
.file-input{
    position: relative;
    z-index: 2;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    margin: 0;
    opacity: 0;
}
.file-label{
    transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
.file-label {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: .25rem;
}
.file-label::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    display: block;
    height: calc(1.5em + .75rem);
    padding: .375rem .75rem;
    line-height: 1.5;
    color: #495057;
    content: "Browse";
    background-color: #e9ecef;
    border-left: inherit;
    border-radius: 0 .25rem .25rem 0;
}

</style>
<div class="input-container">
    <div class="file">
      <input type="file" class="file-input" id="customFile" name="filename">
      <label class="file-label" for="customFile">Choose file</label>
    </div>
</div> 
`;

export class FileInput extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateFileInput.content.cloneNode(true));
    }

    connectedCallback() {
        if (this.image) {
            this.shadowRoot.querySelector('input').accept = "image/*";
        }
        if (this.multiple) {
            this.shadowRoot.querySelector('input').multiple = true;
        }
        this.shadowRoot.querySelector('.file-input').addEventListener('change', this.fileName.bind(this));
    }

    fileName() {
        if(!this.noname){
            let selectedFile = [];
            let files = this.shadowRoot.querySelector('input').files;
            for (let i = 0; i < files.length; i++) {
                let name = files[i].name;
                selectedFile.push(name);
            }
            this.shadowRoot.querySelector('label').innerHTML = selectedFile.toString();
        }else{
            this.shadowRoot.querySelector('label').innerHTML = 'selected'
        }

    }

    get multiple() {
        return this.hasAttribute('multiple');
    }

    get image() {
        return this.hasAttribute('image');
    }
    get noname(){
        return this.hasAttribute('noname')
    }
}

window.customElements.define('file-input', FileInput);
