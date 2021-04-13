const trainingHistoryTemplate = document.createElement('template');
trainingHistoryTemplate.innerHTML = `
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
    <div class="title">Training History</div>
    <div id="training-list"></div>
</div>
`;

export class TrainingHistory extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(trainingHistoryTemplate.content.cloneNode(true));
    }

    generateView() {
        for (let i = 0; i < this.data.length; i++) {
            let container = document.createElement('div');
            container.classList.add('container');
            container.innerHTML = `
                <div class="row">
                    <div class="title titlePreview">${this.data[i].title}</div>
                    <div class="sub" style="padding-left: 10px">
                        <span class="fromPreview">(${this.data[i].from}</span> - <span class="toPreview">${this.data[i].to})</span>
                    </div>
                </div>
                <div class="sub descriptionPreview">${this.data[i].description}</div>
            `;
            this.shadowRoot.querySelector('#training-list').appendChild(container)
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
            this.fields = ['fromPreview', 'toPreview', 'titlePreview', 'institutePreview', 'descriptionPreview'];
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

window.customElements.define('training-history', TrainingHistory);
