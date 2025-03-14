const TemplateLocalTime = document.createElement('template');
TemplateLocalTime.innerHTML = `
<style>
    .container{
        position:relative;
    }
    .time{
        padding: 0 10px;
        transition: 0.1s;
        border-radius: 2px;
        cursor:pointer;
    }
    .time:hover{
        border: 1px dashed rgba(0,0,255,0.43);
    }
    form{
        display: flex;
    }
    input[type=text] {
      width: 90%;
      padding: 15px 25px;
      box-sizing: border-box;
    }
    .submit-form, .cancel{
        font-weight: bold;
        cursor: pointer;
        text-shadow: 2px 2px rgba(0,0,0,0.21);
        background: white;
        border: none;
    }
    .submit-form{
        font-size: 23px;    
    }  
    .cancel{
        color: red;
        position: absolute;
        top: 5px;
        left: -15px;
        background: white;
    }
</style>
<div class="container">
    <div class="time"></div>
    <div class="editor">
        <form>
            <input type="text" placeholder="Time here">
             <button type="submit" class="submit-form">&#x1f4be;</button>
        </form>
        <button class="cancel">&#10060;</button>
    </div>
</div>
  `;

export class LocalTime extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateLocalTime.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.time').innerHTML = this.content;
        this.shadowRoot.querySelector('.editor').style.display = 'none';
        this.shadowRoot.querySelector('.submit-form').style.display = 'none';
        this.events();
    }

    events() {
        this.shadowRoot.querySelector('.time').addEventListener('click', this.editTime.bind(this), false);
        this.shadowRoot.querySelector('.cancel').addEventListener('click', this.closeEditor.bind(this), false);
        this.shadowRoot.querySelector('input').addEventListener('keyup', this.showSaveButton.bind(this), false);
        this.shadowRoot.querySelector('form').addEventListener('submit', this.submit.bind(this), false);
        this.addEventListener('timeUpdated', e => console.log(e.detail));
    }

    submit(e) {
        e.preventDefault();
        let value = this.shadowRoot.querySelector('input').value;
        if (value !== '') {
            this.shadowRoot.querySelector('.time').innerHTML = value;
            this.shadowRoot.querySelector('.editor').style.display = 'none';
            this.shadowRoot.querySelector('.time').style.display = 'inline';
            this.shadowRoot.querySelector('.submit-form').style.display = 'none';
            this.shadowRoot.querySelector('input').value = null;
            this.dispatchEvent(new CustomEvent('timeUpdated', { bubbles: true, detail: 'Updated Successfully' }))
        }

    }

    closeEditor() {
        this.shadowRoot.querySelector('.time').innerHTML = this.content;
        this.shadowRoot.querySelector('input').value = null;
        this.shadowRoot.querySelector('.submit-form').style.display = 'none';
        this.shadowRoot.querySelector('.editor').style.display = 'none';
        this.shadowRoot.querySelector('.time').style.display = 'inline';
    }

    showSaveButton(e) {
        if (e.key !== 'Enter') {
            this.shadowRoot.querySelector('.submit-form').style.display = 'inline'
        }
        let value=this.shadowRoot.querySelector('input').value;
        if (value===''){
            this.shadowRoot.querySelector('.submit-form').style.display = 'none'
        }
    }


    editTime() {
        this.shadowRoot.querySelector('.time').style.display = 'none';
        this.shadowRoot.querySelector('.editor').style.display = 'inline';
    }

    get content() {
        return this.getAttribute("content")
    }
}

window.customElements.define('local-time', LocalTime);
