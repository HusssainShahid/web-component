const skillsSetTemplate = document.createElement('template');
skillsSetTemplate.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=PT+Serif&display=swap');
:host([hidden]) {
    display: none
}
.wrapper{
    letter-spacing: 1.3px;
    line-height: 1.4;
    font-family: 'PT Serif', serif;
}
.container{
    margin: 30px 0;
}
.title{
    font-size: 14pt;
}
.sub{
    font-size: 9pt;
    color: #6C757D;
}
.p-bottom{
    padding-bottom: 15px;
}</style>
<div class="wrapper">
    <div class="title p-bottom">Skills</div>
    <div id="skills-set"></div>
</div>
`;

export class SkillsSet extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(skillsSetTemplate.content.cloneNode(true));
  }

  generateView() {
    let circle='&#x25CB;'
    let fill='&#9679;'
    for (let i = 0; i < this.data.length; i++) {
      let container = document.createElement('div');
      container.innerHTML = `
                <div class="sub namePreview">${this.data[i].name}</div>
                <span class="levelPreview">${fill.repeat(this.data[i].level)}${circle.repeat((10-this.data[i].level))}</span>
            `;
      this.shadowRoot.querySelector('#skills-set').appendChild(container)
    }
  }
    get src() {
        return this.getAttribute('src');
    }

    get preview() {
        return this.getAttribute('preview');
    }

    static get observedAttributes() {
        return ['src', 'preview'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name==='src'){
            this.data = JSON.parse(this.src);
            this.generateView();
        }if(name==='preview'){
            this.fields = ['namePreview', 'levelPreview'];
            this.previewStatus(JSON.parse(this.preview));
        }
    }

    previewStatus(data) {
        for (let i = 0; i < this.fields.length; i++) {
            if (data[this.fields[i]] === false) {
                for (let j = 0; j < this.shadowRoot.querySelectorAll('.' + this.fields[i]).length; j++) {
                    this.shadowRoot.querySelectorAll('.' + this.fields[i])[j].style.display = 'none';
                }
            }
        }
    }
}

window.customElements.define('skills-set', SkillsSet);
