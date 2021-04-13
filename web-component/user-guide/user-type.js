const userTypeTemplate = document.createElement('template');
userTypeTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
.heading{
    font-size: var(--text-heading, 28px);
    margin-bottom: 40px;
}
.container{
display: flex;
flex-wrap: wrap;
}
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 7px;
  left: 3px;
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 50%;
}

.container:hover input ~ .checkmark {
  background-color: #ccc;
}

.container input:checked ~ .checkmark {
  background-color: #2196F3;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark:after {
  display: block;
}

.container .checkmark:after {
    top: 3px;
    left: 4px;
    width: 10px;
    height: 11px;
  border-radius: 50%;
  background: white;
}
.d-flex{
    display: flex;
    flex-wrap: nowrap;
}
.user-type, .user-type-details{
    width: 50%;
}
@media only screen and (max-width: 600px) {
.user-type, .user-type-details{
    width: 100%;
}
}
.user-detail-section img{
    width: 200px;
    height: 160px;
}
.user-detail-section p{
    line-height: 1.5rem;
}
</style>
<div class="heading" data-translate="What best describes you">What best describes you</div>
<div class="d-flex">
    <div class="user-type" style="margin-top: 30px">
    <div class="card" type="Freelancer">
        <label class="container"><div data-translate="A freelancer">A freelancer</div>
          <input type="radio" name="radio">
          <span class="checkmark"></span>
        </label>
        </div>
    <div class="card" type="Freelancer team">
        <label class="container"><div data-translate="Freelancer team">Freelancer team</div>
          <input type="radio" name="radio">
          <span class="checkmark"></span>
        </label>
        </div>
    <div class="card" type="Legal organization">
        <label class="container"><div data-translate="Single Organization/ company">Single Organization/ company</div>
          <input type="radio" name="radio">
          <span class="checkmark"></span>
        </label>
        </div>
    <div class="card" type="Group of organization">
        <label class="container"><div data-translate="Multiple organizations/ company">Multiple organizations/ company</div>
          <input type="radio" name="radio">
          <span class="checkmark"></span>
        </label>
        </div>
    <div class="card" type="Holding company">
        <label class="container"><div data-translate="Holding company">Holding company</div>
          <input type="radio" name="radio">
          <span class="checkmark"></span>
        </label>
    </div>
    </div>
    <div class="user-type-details">
        <div class="user-detail-section" show="Freelancer">
            <img src="../../img/freelancer.svg" alt="Freelancer">
            <p data-translate="Select this category if you an individual worker working independently and managing all of your business processes by yourself.">Select this category if you an individual worker working independently and managing all of your business processes by yourself.</p>
        </div>
        <div class="user-detail-section" show="Freelancer team">
            <img src="../../img/freelancer-group.svg" alt="Freelancer team">
            <p data-translate="Select this category if you are working as independent team of freelancers where multiple people are working together with a shared common goal.">Select this category if you are working as independent team of freelancers where multiple people are working together with a shared common goal.</p>
        </div>
        <div class="user-detail-section" show="Legal organization">
             <img src="../../img/organization.svg" alt="organization">
             <p data-translate="Select this category if you would like to manage a single company that is legaly registered in your local business community">Select this category if you would like to manage a single company that is legaly registered in your local business community</p>
        </div>
        <div class="user-detail-section" show="Group of organization">
             <img src="../../img/multiple-organizations.svg" alt="multiple organizations">
              <p data-translate="Select this category if you are owner of multiple companies and you would like to manage all of these in parallel with simplicity and ease.">Select this category if you are owner of multiple companies and you would like to manage all of these in parallel with simplicity and ease.</p>
        </div>
        <div class="user-detail-section" show="Holding company">
            <img src="../../img/holding-company.svg" alt="holding organization">
            <p data-translate="If you would like to manage a holding company and all the companies that are manage by this holding company then select this category.">If you would like to manage a holding company and all the companies that are manage by this holding company then select this category.</p>
        </div>
    </div>
</div>
`;

export default class UserType extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(userTypeTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelectorAll('.user-detail-section').forEach(function (detail) {
      detail.style.display = 'none';
    })
    this.userTypeSelection();
  }

  userTypeSelection() {
    let cards = this.shadowRoot.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', e => {
        for (let j = 0; j < cards.length; j++) {
          this.shadowRoot.querySelectorAll('.user-detail-section')[j].style.display = 'none';
          if (cards[i].getAttribute('type') === this.shadowRoot.querySelectorAll('.user-detail-section')[j].getAttribute('show')) {
            this.shadowRoot.querySelectorAll('.user-detail-section')[j].style.display = 'inline';
          }
        }
        window.dispatchEvent(new CustomEvent('user-type-selected', {
          bubbles: true,
          detail: cards[i].getAttribute('type')
        }));
      })
    }
  }

  static get observedAttributes() {
    return ['active'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.active === 'true') {
      this.style.display = 'inline';
    } else {
      this.style.display = 'none';
    }
  }

  get active() {
    return this.getAttribute('active');
  }

}

window.customElements.define('user-type', UserType);
