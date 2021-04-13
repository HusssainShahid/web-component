import {TranslateString} from "../../translate-string";

const templateEmailPages = document.createElement('template');
templateEmailPages.innerHTML = `
<style>
.container{
  position: absolute;
  top: 9px;
  display: flex;
}
span{
   padding: 0 5px; 
}
#previous, #next{
    cursor:pointer;
}
#previous{
      transform: rotate(180deg);
}
.disable{
    display: none;
}
</style>
<div class="container">
  <span id="from"></span>-
  <span id="to"></span> <span data-translate="of">of</span>
  <span id="total"></span>
  <div id="previous" title="Previous Page"><span id="previous-icon">&#10148;</span></div>
  <span id="next" title="Next Page">&#10148;</span>
</div>
`;

class EmailPages extends TranslateString {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateEmailPages.content.cloneNode(true));
  }

  connectedCallback() {
    this.next = this.shadowRoot.querySelector('#next');
    this.previous = this.shadowRoot.querySelector('#previous-icon');
    this.next.addEventListener('click', function (e) {
      this.fireEvent(e.path[0].getAttribute('id'));
    }.bind(this));
    this.previous.addEventListener('click', function (e) {
      this.fireEvent(e.path[0].getAttribute('id'));
    }.bind(this));
  }

  fireEvent(id) {
    window.dispatchEvent(new CustomEvent('email-change-page-button-clicked', {
      bubbles: true, detail: id
    }));
  }

  initialize() {
    if (parseInt(this.total) < parseInt(this.perPage)) {
      this.shadowRoot.querySelector('.container').style.display = 'none';
    } else {
      this.shadowRoot.querySelector('.container').style.display = '';
    }
    this.shadowRoot.querySelector('#from').innerText = this.from;
    this.shadowRoot.querySelector('#to').innerText = this.to;
    this.shadowRoot.querySelector('#total').innerText = this.total;
    this.buttonStatus();
  }

  buttonStatus() {
    if (this.currentPage === '1') {
      this.previous.classList.add('disable')
    } else {
      this.previous.classList.remove('disable')
    }
    if (this.currentPage === this.lastPage) {
      this.next.classList.add('disable')
    } else {
      this.next.classList.remove('disable')
    }
  }

  static get observedAttributes() {
    return ['to', 'from', 'total', 'current-page', 'last-page'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.initialize();
  }

  get to() {
    return this.getAttribute('to');
  }

  get from() {
    return this.getAttribute('from');
  }

  get total() {
    return this.getAttribute('total');
  }

  get currentPage() {
    return this.getAttribute('current-page');
  }

  get lastPage() {
    return this.getAttribute('last-page');
  }

  get perPage() {
    return this.getAttribute('per-page');
  }
}

window.customElements.define('email-pages', EmailPages);

