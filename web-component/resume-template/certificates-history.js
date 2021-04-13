const certificatesHistoryTemplate = document.createElement('template');
certificatesHistoryTemplate.innerHTML = `
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
    <div class="title">Certificates History</div>
    <div id="certificates-list"></div>
</div>
`;

export class CertificatesHistory extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(certificatesHistoryTemplate.content.cloneNode(true));
    }

    generateView() {
        for (let i = 0; i < this.data.length; i++) {
            let container = document.createElement('div');
            container.classList.add('container');
            container.innerHTML = `
                <div class="row">
                    <div class="title titlePreview">${this.data[i].title}</div>
                    <span class="sub completionDatePreview" style="padding-left: 10px">(${this.data[i].completionDate})</span>
                </div>
                <div class="sub institutePreview">Institute: ${this.data[i].institute}</div>
                <div class="sub courseGradePreview">Grade: ${this.data[i].courseGrade}</div>
            `;
            this.shadowRoot.querySelector('#certificates-list').appendChild(container)
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
            this.fields = ['titlePreview', 'completionDatePreview', 'institutePreview', 'courseGradePreview'];
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

window.customElements.define('certificates-history', CertificatesHistory);
