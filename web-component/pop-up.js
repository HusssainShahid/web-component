const templatePopUp = document.createElement('template');
templatePopUp.innerHTML = `
<style>
.modal {
  display: none; 
  position: absolute;
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
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0 20px;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  animation-name: animatetop;
  animation-duration: 0.4s;
  border-radius: 5px; 

}
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

.close {
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

.modal-body {padding: 12px 16px;}
    </style>
<div>
  <slot name="open-modal"></slot>
  <div id="modal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div class="modal-body">
     <slot name="modal-body"></slot>
    </div>
  </div>
</div>
</div>
`;

class PopUp extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templatePopUp.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.width != null) {
      this.shadowRoot.querySelector('.modal-content').style.width = this.width;
    }
    this.querySelector('[slot="open-modal"]').onclick = function () {
      this.shadowRoot.querySelector("#modal").style.display = 'inline';
    }.bind(this);
    this.shadowRoot.querySelector(".close").onclick = function () {
      this.shadowRoot.querySelector("#modal").style.display = 'none'
    }.bind(this);
  }

  modalStatus() {
    if (this.show==='true') {
      this.shadowRoot.querySelector("#modal").style.display = 'inline';
    } else {
      this.shadowRoot.querySelector("#modal").style.display = 'none'
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.modalStatus();
  }

  static get observedAttributes() {
    return ['show'];
  }

  get show() {
    return this.getAttribute('show');
  }

  get width() {
    return this.getAttribute('width');
  }
}

window.customElements.define('pop-up', PopUp);

