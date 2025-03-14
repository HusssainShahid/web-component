const templateLineCard = document.createElement('template');
templateLineCard.innerHTML = `
<style>
    .container{
       padding: 0;
       width: 96%;
       border: 1px solid rgba(0,0,0,0.22)!important;
    }
    .text{
        margin:1px 2%;
        display: flex;
    }
    .text p{
        display: inline-block;
        margin:5px;
        padding: 10px;
        transition: 0.1s all;
        width:80%
    }
    .text span{
       text-align: center;
       width: 8%;
       opacity: 0.5;
       cursor: pointer;
       font-size: 20px;
       margin:5px;
       padding: 5px;
       border-radius: 4px;
       display: none;
       transition: 0.1s all;
    }
    .text span:hover{
        background: rgba(0,0,0,0.22);
    }
    .edit-form{
        display: flex;
        padding:5px 2% ;
        position: relative;
    }
    .processing{
        padding:2px 2%;
        text-align: center;
    }
    .loading {
        display: inline-block;
        width: 40px;
        height: 40px;
    }
    .loading:after {
        content: " ";
        display: block;
        width: 27px;
        height: 27px;
        margin: 1px;
        border-radius: 50%;
        border-width: 5px;
        border-style: solid;
        border-color: #fff black #fff black;
        animation: loading 1.2s linear infinite;
    }
    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    form {
        display: inline;
    }
    input[type=text] {
        padding: 12px 20px;
        box-sizing: border-box;
        width: 90%;
        border: 1px solid rgba(0,0,255,0.68);
        display: inline-block;
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
        right: -15px;
    }
    .error{
        color:rgba(233,22,14,0.82);
        font-size: 20px;
        padding-left: 17px;
    }
    .error span{
        padding-left:10px ;
    }
    .actions{
        display: flex;
    }
    .actions div{
        padding:5px 10px;
        margin:0 5px;
        cursor: pointer;
    }
    .saved{
        color:green;
        padding-left: 10px;
    }
 </style>
<div class="container">
    <div class="text">
        <p></p>
        <span>&#9998;</span>
    </div>
    <div class="edit-form">
        <form id="input-form">
          <input type="text">
          <button type="submit" class="submit-form">&#x1f4be;</button>
        </form>
        <div class="processing">
            <span class="loading"></span>
        </div>
        <button class="cancel">&#10060;</button>
        <div class="error-messages">
            <div class="error">
                 &#x26a0;<span class="error-status"></span>
            </div>
            <div class="actions">
                <div class="abort">&#10060; abort</div>
                <div class="retry" type="submit">&#x1f4be; Retry</div>
                <div class="edit">&#9998; Edit</div>
            </div>
        </div>
    </div>
</div>
<p class="saved">Saved Successfully</p>

  `;

export class LineCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateLineCard.content.cloneNode(true));
    }

    connectedCallback() {
        this.initialization();
        this.text.querySelector('p').innerHTML = this.message;
        this.inputForm.method = this.method;
        this.inputForm.setAttribute('api', this.api);
        this.editForm.style.display = "none";
        this.submitForm.style.display = "none";
        this.processing.style.display = "none";
        this.errorMessage.style.display = "none";
        this.shadowRoot.querySelector(".saved").style.display = "none";
        this.setEvents();
    }

    initialization() {
        this.inputForm = this.shadowRoot.querySelector("form");
        this.editForm = this.shadowRoot.querySelector('.edit-form');
        this.text = this.shadowRoot.querySelector('.text');
        this.submitForm = this.shadowRoot.querySelector('.submit-form');
        this.processing = this.shadowRoot.querySelector('.processing');
        this.cancel = this.shadowRoot.querySelector('.cancel');
        this.errorMessage = this.shadowRoot.querySelector('.error-messages');
        this.error = this.shadowRoot.querySelector('.error');
        this.action = this.shadowRoot.querySelector('.action');
        this.inputField = this.shadowRoot.querySelector('input');
    }

    setEvents() {
        this.inputForm.addEventListener('submit', this.submit.bind(this), false);
        this.cancel.addEventListener("click", this.hide.bind(this), false);
        this.addEventListener("mouseover", this.showEditor);
        this.addEventListener("mouseout", this.hideEditor);
        this.shadowRoot.querySelector("span").addEventListener("mouseover", this.editHover.bind(this), false);
        this.shadowRoot.querySelector("span").addEventListener("mouseout", this.editHoverOut.bind(this), false);
        this.shadowRoot.querySelector("span").addEventListener("click", this.editCard.bind(this), false);
        this.shadowRoot.querySelector('input').addEventListener('keyup', this.showSaveButton.bind(this), false);
    }


    submit(e) {
        e.preventDefault();
        let data = this.inputField.value;
        let api = this.inputForm.getAttribute('api');
        let method = this.inputForm.getAttribute('method');
        let message = this.text.querySelector('p').innerHTML;
        let that = this;
        if (message != data) {
            this.processing.style.display = "block";
            this.inputForm.style.display = 'none';
            fetch(api, {
                method: method,
                body: data
            }).then(response => {
                    that.response(response);
                }
            );
        }
    }

    response(response) {
        this.processing.style.display = 'none';
        if (response.status === 200) {
            this.shadowRoot.querySelector('.saved').style.display = 'inline';
            this.shadowRoot.querySelector('.loading').style.display = 'none';
            this.cancel.style.display = 'none';
            this.text.style.display = 'flex';
            this.editForm.style.display = 'none';
            this.text.querySelector('p').innerHTML = this.inputField.value;
            let that = this;
            setTimeout(function () {
                that.shadowRoot.querySelector('.saved').style.display = 'none'
            }, 2000);
        } else {
            this.inputForm.style.display = 'inline';
            this.submitForm.style.display = 'none';
            this.cancel.style.display = 'none';
            this.errorMessage.style.display = 'inline';
            let error = response.statusText;
            this.shadowRoot.querySelector('.error-status').innerHTML = error;
            let actions = this.shadowRoot.querySelector('.actions');
            actions.querySelector('.abort').addEventListener('click', this.abort.bind(this), false);
            actions.querySelector('.retry').addEventListener('click', this.retry.bind(this), false);
            actions.querySelector('.edit').addEventListener('click', this.edit.bind(this), false);
        }
    }

    abort() {
        this.text.style.display = 'flex';
        this.editForm.style.display = 'none';
        this.errorMessage.style.display = 'none';
        this.cancel.style.display = 'inline'
    }

    retry(e) {
        this.errorMessage.style.display = "none";
        this.inputForm.style.display = "none";
        this.processing.style.display = "block";
        this.submit(e);
    }

    edit() {
        this.errorMessage.style.display = 'none';
        this.submitForm.style.display = 'inline';
        this.cancel.style.display = 'inline';

    }

    hide() {
        this.text.style.display = 'flex';
        this.editForm.style.display = 'none';
        this.submitForm.style.display = 'none';
    }

    editCard() {
        this.editForm.style.display='block';
        this.inputForm.style.display = "block";
        this.text.style.display = "none";
        this.submitForm.style.display = "none";
        this.cancel.style.display = "inline";
        this.inputField.value = this.text.querySelector('p').innerHTML;
    }

    editHover() {
        this.text.querySelector('p').style.border = "1px dotted blue"
    }

    editHoverOut() {
        this.text.querySelector('p').style.border = "none"
    }

    showEditor() {
        this.shadowRoot.querySelector("span").style.display = "block"
    }

    hideEditor() {
        this.shadowRoot.querySelector("span").style.display = "none"
    }

    showSaveButton(e) {
        if (e.key !== 'Enter') {
            this.submitForm.style.display = 'inline';
        }
    }

    get method() {
        return this.getAttribute("method");
    }

    get api() {
        return this.getAttribute("api");
    }

    get message() {
        return this.getAttribute("message");
    }

}

window.customElements.define('line-card', LineCard);
