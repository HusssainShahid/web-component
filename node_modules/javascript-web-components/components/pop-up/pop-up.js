const TemplatePopUp = document.createElement('template');
TemplatePopUp.innerHTML = `
<style>
.modal {
  position: fixed; 
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid rgba(180,180,180,0.11);
  width: 80%;
  border-radius: 4px;
  transition: 0.2s;
}
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
<slot name="open-modal" id="myBtn"></slot>
<div id="myModal" class="modal">
  <div class="modal-content fade">
    <span class="close">&times;</span>
    <div>
        <slot name="modal-body"></slot>
    </div>
  </div>
</div>
  `;

export class PopUp extends HTMLElement {

    static get observedAttributes() {
        return ['close'];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplatePopUp.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.close) {
            this.modal.style.display = 'none';
        }
    }

    connectedCallback() {
        this.modal = this.shadowRoot.querySelector('#myModal');
        this.btn = this.shadowRoot.querySelector('#myBtn');
        this.span = this.shadowRoot.querySelector('.close');
        this.modal.style.display = 'none';
        this.modal.querySelector('.modal-content').style.opacity='1';
        this.btn.addEventListener('click', function () {
            this.modal.style.display = 'block';
        }.bind(this));
        this.span.addEventListener('click', function () {
            this.modal.style.display = 'none';
        }.bind(this));
        this.modalStyling();
        this.modal.addEventListener('click', function () {
            this.modal.style.display = 'none';
        }.bind(this));
    }

    modalStyling() {
        if (this.size === 'small') {
            this.shadowRoot.querySelector('.modal-content').style.width = '35%'
        } else if (this.size === 'medium') {
            this.shadowRoot.querySelector('.modal-content').style.width = '55%'
        } else {
            this.shadowRoot.querySelector('.modal-content').style.width = '80%'
        }
        if(this.fade){
            let that= this;
            this.modal.querySelector('.modal-content').style.opacity='0.5';
            setTimeout(function(){
                     that.shadowRoot.querySelector('.modal-content').style.opacity= '1';
                }, 1460);
        }
    }

    get close() {
        return this.hasAttribute('close');
    }

    get fade() {
        return this.hasAttribute('fade');
    }

    get size() {
        return this.getAttribute('size');
    }
}

window.customElements.define('pop-up', PopUp);
