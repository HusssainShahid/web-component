const templateProgressBar = document.createElement('template');
templateProgressBar.innerHTML = `
 <style>
      .progress-bar{
        width: 90%;
        height: 8px;
        border-radius: 4px;
        background: var(--secondary-base, hsla(0, 0%, 97%, 1));
        margin: 0 auto;
        position:relative;
      }
      ul{
        padding: 0;
        list-style-type: none;
        text-align: center;
        z-index: inherit;
      }
      ul li{
        display: inline;
      }
      .step{
        padding: 12px 16px;
        border-radius: 5px;
        background: var(--secondary-base, hsla(0, 0%, 97%, 1));
      }
      .rounded{
        border-radius: 50%;
      }
      /*.progressed{*/
      /*  position: absolute;*/
      /*  height: 8px;*/
      /*  border-radius: 4px;*/
      /*  background: var(--primary-text, hsla(0, 0%, 0%, 1));*/
      /*  width: 0;*/
      /*  top: 0;*/
      /*}*/
      @media only screen and (max-width: 700px) {
        .label-list{
          display: none;
        }
      }
      .active-step{
        background: var(--primary-text, hsla(0, 0%, 0%, 1));
        color: var(--primary-base, hsla(0, 0%, 100%, 1));
      }
      .mobile-screen{
        font-size: var(--text-caption, 12px);
        padding: 7px 10px;
      }
 </style>
 <div class="progress-bar">
    <ul class="steps-list"></ul>
    <ul class="label-list"></ul>
<!--    <div class="progressed"></div>-->
</div>

`;

export class ProgressBar extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateProgressBar.content.cloneNode(true));
  }

  labelStatus() {
    this.appendList();
    if (this.showLabels) {
      this.showLabel();
    }
  }

  appendList() {
    this.list = this.shadowRoot.querySelector('.steps-list');
    this.width = [100 / [JSON.parse(this.labels).length - 1]];
    for (let i = 0; i < JSON.parse(this.labels).length; i++) {
      let li = document.createElement('li');
      li.classList.add('step');
      li.innerHTML = [i + 1].toString();
      if (this.rounded) {
        li.classList.add('rounded');
      }
      let x = window.matchMedia("(max-width: 700px)");
      if (x.matches) {
        li.classList.add('mobile-screen');
        li.style.marginLeft = 'calc(' + this.width + '% - 2.1rem)';
      } else {
        li.style.marginLeft = 'calc(' + this.width + '% - 4.1rem)';
      }
      if (i === 0) {
        li.style.marginLeft = '0';
      }
      this.list.appendChild(li);
    }
    this.activateStep(1);
  }

  showLabel() {
    let list = this.shadowRoot.querySelector('.label-list');
    let labels = JSON.parse(this.labels);
    for (let i = 0; i < labels.length; i++) {
      let li = document.createElement('li');
      li.innerHTML = labels[i];
      if (i > 0) {
        li.style.paddingLeft = 'calc(' + [this.width - 5] + '% - 4.1rem)';
      }
      list.appendChild(li);
    }
  }

  activateStep(id) {
    let step = this.shadowRoot.querySelectorAll('.step');
    for (let i = 0; i < step.length; i++) {
      step[i].classList.remove('active-step')
    }
    for (let i = 0; i < id; i++) {
      step[i].classList.add('active-step')
    }
  }

  static get observedAttributes() {
    return ['labels', 'active-step'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'labels') {
      setTimeout(function(){
        this.labelStatus();
      }.bind(this), 1000);
    }
    if (name === 'active-step') {
      this.activateStep(this.activeStep,);
    }
  }

  get labels() {
    return this.getAttribute('labels');
  }

  get rounded() {
    return this.getAttribute('rounded');
  }

  get activeStep() {
    return this.getAttribute('active-step');
  }

  get showLabels() {
    return this.hasAttribute('show-labels');
  }
}

window.customElements.define('progress-bar', ProgressBar);
