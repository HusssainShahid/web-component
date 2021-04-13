const educationHistoryTemplate = document.createElement('template');
educationHistoryTemplate.innerHTML = `
<style>
:host([hidden]) {
    display: none
}
.wrapper{
    letter-spacing: 1.3px;
    line-height: 1.4;
    font-family: "Times New Roman", Times, serif;
}
.row{
    display: flex;
    flex-wrap: nowrap;
}
.w-75{
    width: 13.125cm;
}
.w-25{
    width: 7.95cm;
}
.container{
    margin: 30px 0;
}
.title{
    font-size: 14pt;
}
.body{
    font-size: 13pt;
}
.sub{
    font-size: 9pt;
    color: #6C757D;
}
.p-bottom{
    padding-bottom: 15px;
}</style>
<div class="wrapper">
    <div class="title">Education History</div>
    <div id="education-list"></div>
</div>
`;

export class EducationHistory extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(educationHistoryTemplate.content.cloneNode(true));
  }

  generateView() {
    for (let i = 0; i < this.data.length; i++) {
      let container = document.createElement('div');
      container.classList.add('container');
      container.innerHTML = `
                <div class="row">
                    <div class="body degree_namePreview">${this.data[i].degree_name}</div>
                    <div class="sub completion_datePreview" style="padding-left: 10px">(${this.data[i].completion_date})</div>
                </div>
                <div class="sub">
                    <p class="institutePreview">${this.data[i].institute}</p>
                    <p><span class="resultPreview">Result: ${this.data[i].result}</span> <span class="degree_levelPreview">- Degree level: ${this.data[i].degree_level}</span></p>
                </div>
            `;
      this.shadowRoot.querySelector('#education-list').appendChild(container)
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
            this.fields = ['completion_datePreview', 'degree_namePreview', 'institutePreview', 'resultPreview','degree_levelPreview', 'subjectsPreview'];
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

window.customElements.define('education-history', EducationHistory);
