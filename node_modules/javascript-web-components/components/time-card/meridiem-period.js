const TemplatePeriod = document.createElement('template');
TemplatePeriod.innerHTML = `
<style>
    .container{
        position:relative;
    }
    .meridiem{
        padding: 0 10px;
        transition: 0.1s;
        border-radius: 2px;
        cursor:pointer;
    }
    .meridiem:hover{
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
    <div class="meridiem"></div>
    <div class="editor">
        <form>
            <input type="text" placeholder="AM or PM"> 
             <button type="submit" class="submit-form">&#x1f4be;</button>
        </form>
        <button class="cancel">&#10060;</button>
    </div>
</div> 
`;

export class MeridiemPeriod extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplatePeriod.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.meridiem').innerHTML = this.content;
        this.shadowRoot.querySelector('.editor').style.display = 'none';
        this.shadowRoot.querySelector('.submit-form').style.display = 'none';
        this.events();
    }

    events() {
        this.shadowRoot.querySelector('.meridiem').addEventListener('click', this.editMeridiem.bind(this), false);
        this.shadowRoot.querySelector('.cancel').addEventListener('click', this.closeEditor.bind(this), false);
        this.shadowRoot.querySelector('input').addEventListener('keyup', this.showSaveButton.bind(this), false);
        this.shadowRoot.querySelector('form').addEventListener('submit', this.submit.bind(this), false);
        this.addEventListener('meridiemUpdated', e => console.log(e.detail));
    }
    submit(e){
        e.preventDefault();
        let value=this.shadowRoot.querySelector('input').value;
        if(value!==''){
            this.shadowRoot.querySelector('.meridiem').innerHTML=value;
            this.shadowRoot.querySelector('.editor').style.display = 'none';
            this.shadowRoot.querySelector('.meridiem').style.display = 'inline';
            this.shadowRoot.querySelector('.submit-form').style.display='none';
            this.shadowRoot.querySelector('input').value=null;
            this.dispatchEvent(new CustomEvent('meridiemUpdated', { bubbles: true, detail: 'Updated Successfully' }))
        }
    }

    closeEditor() {
        this.shadowRoot.querySelector('.meridiem').innerHTML=this.content;
        this.shadowRoot.querySelector('input').value=null;
        this.shadowRoot.querySelector('.submit-form').style.display='none';
        this.shadowRoot.querySelector('.editor').style.display = 'none';
        this.shadowRoot.querySelector('.meridiem').style.display = 'inline';
    }

    closeEditor() {
        this.shadowRoot.querySelector('.editor').style.display = 'none';
        this.shadowRoot.querySelector('.meridiem').style.display = 'inline';
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

    editMeridiem() {
        this.shadowRoot.querySelector('.meridiem').style.display = 'none';
        this.shadowRoot.querySelector('.editor').style.display = 'inline';
    }

    get content() {
        return this.getAttribute("content")
    }
}

window.customElements.define('meridiem-period', MeridiemPeriod);
