const templatePillBadge = document.createElement('template');
templatePillBadge.innerHTML = `
<style>
    .pill{
      border-radius: 15px;
      padding: 0 8px;      
      margin: 5px 3px;
      font-size: var(--text-caption, 14px);
      border: 1px solid #cccccc;
      white-space: nowrap;
      font-weight: bold;
    }
    .close{
        cursor: pointer;
        padding: 0 2px;
        margin-left: 5px;
    }
</style>
<span class="pill">
    <slot></slot>
    <span class="close">&#128938;</span>
</span>
`;

export class PillBadge extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templatePillBadge.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['color', 'background','border-none'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.theme();
  }

  connectedCallback() {
    this.hidePill = this.shadowRoot.querySelector('.close');
    if (!this.showCrossButton) {
      this.hidePill.style.display = 'none';
    } else {
      this.hidePill.addEventListener('click', e => {
        this.style.display = 'none';
      });
    }
    this.theme();
  }

  theme() {
    if (this.color) {
      this.shadowRoot.querySelector('.pill').style.color = this.color;
    }
    if (this.background) {
      this.shadowRoot.querySelector('.pill').style.background = this.background;
    }
    if(this.borderNone){
      this.shadowRoot.querySelector('.pill').style.border = 'none';
    }
  }

  get showCrossButton() {
    return this.hasAttribute('show-cross-button');
  }

  get background() {
    return this.getAttribute('background');
  }

  get color() {
    return this.getAttribute('color');
  }
  get borderNone() {
    return this.getAttribute('border-none');
  }
}

window.customElements.define('pill-badge', PillBadge);

