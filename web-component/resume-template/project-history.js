const projectHistoryTemplate = document.createElement('template');
projectHistoryTemplate.innerHTML = `
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
    <div class="title">Project History</div>
    <div id="project-list"></div>
</div>
`;

export class ProjectHistory extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(projectHistoryTemplate.content.cloneNode(true));
    }

    generateView() {
        for (let i = 0; i < this.data.length; i++) {
            let container = document.createElement('div');
            container.classList.add('container');
            container.innerHTML = `
                <div class="row">
                    <div class="title titlePreview">${this.data[i].title}</div>
                    <span class="sub estimateCompletionTimePreview" style="padding-left: 10px">( Estimate completion time: ${this.data[i].estimateCompletionTime} )</span>
                </div>
                <div class="sub">
                      <p class="descriptionPreview">${this.data[i].description}</p>
                    <span class="teamSizePreview"><b>Team Size: </b>${this.data[i].teamSize}</span>
                    <span class="rolePreview"><b>Role: </b>${this.data[i].role}</span>   <br>
                    <div class="sub linksPreview"><a href="${this.data[i].links}">${this.data[i].links}</a></div>
                    <div id="tools" class="toolsAndTechnologiesPreview"></div>
                </div>
            `;
            for (let j = 0; j < this.data[i].toolsAndTechnologies.length; j++) {
                let span = document.createElement('span')
                span.innerHTML=`${this.data[i].toolsAndTechnologies[j]}, `;
                span.classList.add('body');
                container.querySelector('#tools').appendChild(span);
            }
            this.shadowRoot.querySelector('#project-list').appendChild(container)
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
            this.fields = ['estimateCompletionTimePreview', 'teamSizePreview', 'titlePreview', 'descriptionPreview', 'rolePreview', 'linksPreview','toolsAndTechnologiesPreview'];
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

window.customElements.define('project-history', ProjectHistory);
