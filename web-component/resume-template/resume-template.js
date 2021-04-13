import {ResumeTemplating} from "./resume-templating.js";

import('./experience-history.js');
import('./social-links.js');
import('./skills-set.js');
import('./languages-set.js');
import('./hobbies-set.js');
import('./education-history.js');
import('./training-history.js');
import('./certificates-history.js');
import('./project-history.js');
import('./contact-information.js');
import('./email-accounts.js')
const resumeTemplateTemplate = document.createElement('template');
resumeTemplateTemplate.innerHTML = `

<style>
@import url('https://fonts.googleapis.com/css2?family=PT+Serif&display=swap');
:host([hidden]) {
    display: none
}
.wrapper{
    letter-spacing: 1.3px;
    line-height: 1.4;
    font-family: 'PT Serif', serif !important;
    }

img{
    width: 70px;
    border-radius: 50%;
    margin-right: 30px;
}
.row{
    display: flex;
    flex-wrap: nowrap;
}
.w-75{
    width: 15cm;
}
.w-25{
    width: 6cm;
}
.container{
    margin: 30px 0;
}
.header{
    font-size: 18pt;
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
}
</style>
<!--<a-4>-->
    <div class="wrapper">
        <div class="row">
            <div class="w-75">
                <div class="container row" style="margin-top: 10px">
                    <div class="picturePreview">
                        <img alt="Image">
                    </div>
                    <div>
                        <div class="header namePreview" id="name"></div>
                        <div class="title professionPreview" id="profession"></div>
                        <div class="sub emailPreview" id="email"></div>
                    </div>
                </div>
                <div class="container descriptionPreview" style="padding-top: 10px">
                    <div class="sub" id="description"></div>
                </div>
                <div class="container experiencePreview">
                    <experience-history></experience-history>
                </div>
                <div class="container educationPreview">
                    <education-history></education-history>
                </div>
                <div class="container trainingPreview">
                    <training-history></training-history>
                </div>
                <div class="container projectPreview">
                    <project-history></project-history>
                </div>
                <div class="container certificatesPreview">
                    <certificates-history></certificates-history>
                </div>
            </div>
            <div class="w-25" style="padding-left: 60px">
                <div class="container numberPreview" style="margin-top: 10px">
                    <contact-information></contact-information>
                </div>
                <div class="container emailPreview" style="margin-top: 10px">
                    <email-accounts></email-accounts>
                </div>
                <div class="container linksPreview">
                    <social-links></social-links>
                </div>
                <div class="container skillsPreview">
                    <skills-set></skills-set>
                </div>
                <div class="container languagesPreview">
                    <languages-set></languages-set>
                </div>
                <div class="container hobbiesPreview">
                    <hobbies-set></hobbies-set>
                </div>
                <div class="container addressPreview">
                    <div class="title">Address</div>
                    <p id="address" class="sub"></p>
                </div>
            </div>
        </div>
    </div>
<!--</a-4>-->
`;

export class ResumeTemplate extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(resumeTemplateTemplate.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.data = JSON.parse(this.src);
        this.templating = new ResumeTemplating(this.data);
        this.ids = ['name', 'profession', 'description', 'address'];
        this.fields = ['namePreview', 'professionPreview', 'descriptionPreview', 'addressPreview', 'emailPreview', 'numberPreview', 'picturePreview', 'linksPreview', 'hobbiesPreview', 'skillsPreview', 'languagesPreview', 'experiencePreview', 'educationPreview', 'certificatesPreview', 'trainingPreview', 'projectPreview'];
        this.generateView();
        this.previewStatus();
    }

    generateView() {
        for (let i = 0; i < this.ids.length; i++) {
            this.shadowRoot.querySelector(`#${this.ids[i]}`).innerHTML = this.templating.resumeData[this.ids[i]];
        }
        this.shadowRoot.querySelector('#email').innerHTML = this.templating.resumeData.email[0];
        this.shadowRoot.querySelector('experience-history').setAttribute('src', JSON.stringify(this.templating.resumeData.experience))
        this.shadowRoot.querySelector('experience-history').setAttribute('preview', JSON.stringify(this.templating.resumeData.experienceFieldPreview))
        this.shadowRoot.querySelector('education-history').setAttribute('src', JSON.stringify(this.templating.resumeData.education))
        this.shadowRoot.querySelector('education-history').setAttribute('preview', JSON.stringify(this.templating.resumeData.educationFieldPreview))
        this.shadowRoot.querySelector('training-history').setAttribute('src', JSON.stringify(this.templating.resumeData.training))
        this.shadowRoot.querySelector('training-history').setAttribute('preview', JSON.stringify(this.templating.resumeData.trainingFieldPreview))
        this.shadowRoot.querySelector('project-history').setAttribute('src', JSON.stringify(this.templating.resumeData.project))
        this.shadowRoot.querySelector('project-history').setAttribute('preview', JSON.stringify(this.templating.resumeData.projectFieldPreview))
        this.shadowRoot.querySelector('certificates-history').setAttribute('src', JSON.stringify(this.templating.resumeData.certificates))
        this.shadowRoot.querySelector('certificates-history').setAttribute('preview', JSON.stringify(this.templating.resumeData.certificatesFieldPreview))
        this.shadowRoot.querySelector('contact-information').setAttribute('src', JSON.stringify(this.templating.resumeData.number))
        this.shadowRoot.querySelector('email-accounts').setAttribute('src', JSON.stringify(this.templating.resumeData.email))
        this.shadowRoot.querySelector('social-links').setAttribute('src', JSON.stringify(this.templating.resumeData.links))
        this.shadowRoot.querySelector('skills-set').setAttribute('src', JSON.stringify(this.templating.resumeData.skills))
        this.shadowRoot.querySelector('skills-set').setAttribute('preview', JSON.stringify(this.templating.resumeData.skillsFieldPreview))
        this.shadowRoot.querySelector('languages-set').setAttribute('src', JSON.stringify(this.templating.resumeData.languages))
        this.shadowRoot.querySelector('languages-set').setAttribute('preview', JSON.stringify(this.templating.resumeData.languagesFieldPreview))
        this.shadowRoot.querySelector('hobbies-set').setAttribute('src', JSON.stringify(this.templating.resumeData.hobbies))
        this.shadowRoot.querySelector('img').setAttribute('src', this.templating.resumeData.picture)
    }

    previewStatus() {
        for (let i = 0; i < this.fields.length; i++) {
            if(this.templating.resumeData[this.fields[i]]===false){
                for (let j = 0; j < this.shadowRoot.querySelectorAll('.'+this.fields[i]).length; j++) {
                    this.shadowRoot.querySelectorAll('.'+this.fields[i])[j].style.display='none';
                }
            }
        }
    }

    get src() {
        return this.getAttribute('src')
    }

}

window.customElements.define('resume-template', ResumeTemplate);
