const TemplateFullDate = document.createElement('template');
TemplateFullDate.innerHTML = `
<style>
    .container{
        position:relative;
    }
    .date{
        padding: 10px;
        opacity: 0.6;
        transition: 0.1s;
        border-radius: 2px;
        cursor:pointer;
    }   
    .date:hover{
        border: 1px dashed rgba(0,0,255,0.43);
    }
    form{
    display: flex;
    }
    input[type=date] {
      width: 100%;
      margin: 10px 0;
      padding: 8px 15px;
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
    <div class="date"></div>
    <div class="editor">
    <form>
        <input type="date">
        <button type="submit" class="submit-form">&#x1f4be;</button>
    </form>
    <button class="cancel">&#10060;</button>
    </div>
</div>
  `;

export class FullDate extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateFullDate.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.date').innerHTML = this.content;
        this.shadowRoot.querySelector('.editor').style.display = 'none';
        this.shadowRoot.querySelector('.submit-form').style.display = 'none';
        this.events();
        this.addEventListener('dateUpdated', e => console.log(e.detail));

    }

    events() {
        this.shadowRoot.querySelector('.date').addEventListener('click', this.editDate.bind(this), false);
        this.shadowRoot.querySelector('.cancel').addEventListener('click', this.closeEditor.bind(this), false);
        this.shadowRoot.querySelector('input').addEventListener('change', this.showSaveButton.bind(this), false);
        this.shadowRoot.querySelector('form').addEventListener('submit', this.submit.bind(this), false);
    }

    submit(e) {
        e.preventDefault();
        let value = this.shadowRoot.querySelector('input').value;
        if (value !== '') {
            this.shadowRoot.querySelector('.date').innerHTML = value;
            this.shadowRoot.querySelector('.editor').style.display = 'none';
            this.shadowRoot.querySelector('.date').style.display = 'inline';
            this.shadowRoot.querySelector('.submit-form').style.display = 'none';
            this.shadowRoot.querySelector('input').value = null;
            this.dispatchEvent(new CustomEvent('dateUpdated', { bubbles: true, detail: 'Updated Successfully' }))
        }
    }


    closeEditor() {
        this.shadowRoot.querySelector('.date').innerHTML = this.content;
        this.shadowRoot.querySelector('input').value = null;
        this.shadowRoot.querySelector('.submit-form').style.display = 'none';
        this.shadowRoot.querySelector('.editor').style.display = 'none';
        this.shadowRoot.querySelector('.date').style.display = 'inline';
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

    editDate() {
        this.shadowRoot.querySelector('.editor').style.display = 'inline';
        this.shadowRoot.querySelector('.date').style.display = 'none';
    }

    get content() {
        return this.getAttribute("content")
    }

}

window.customElements.define('full-date', FullDate);
