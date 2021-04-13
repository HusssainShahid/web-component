export class ResumeTemplating {

    constructor(data) {
        this.data = data;
        this.resumeData = [];
        this.resumeData.skills = [];
        this.resumeData.education = [];
        this.resumeData.experience = [];
        this.resumeData.languages = [];
        this.resumeData.hobbies = [];
        this.resumeData.training = [];
        this.resumeData.project = [];
        this.resumeData.certificates = [];
        this.getData();
    }

    getData() {
        this.resumeData.name = `${this.data.candidatePersonalInformation.data.first_name} ${this.data.candidatePersonalInformation.data.middle_name} ${this.data.candidatePersonalInformation.data.last_name}`;
        this.resumeData.namePreview = this.data.preview.personalInformationData[0].checked === true || this.data.preview.personalInformationData[1].checked === true || this.data.preview.personalInformationData[2].checked === true;
        this.resumeData.profession = '';
        this.resumeData.professionPreview = false;
        this.resumeData.description = '';
        this.resumeData.descriptionPreview = false;
        this.resumeData.address = this.data.candidateGeographicInformation.data.address;
        this.resumeData.addressPreview = this.data.preview.geographicData[2].checked;
        this.resumeData.email = this.data.candidateContactEmail.data.map(value => value.email);
        this.resumeData.emailPreview = this.data.preview.showEmailInformation;
        this.resumeData.number = this.data.candidateContactPhone.data.map(value => value.contact_number);
        this.resumeData.numberPreview = this.data.preview.showPhoneNumberInformation;
        this.resumeData.picture = ' ';
        this.resumeData.picturePreview = false
        this.resumeData.links = this.data.candidateSocialMediaInformation.data.socialLinks.map(value => value.url);
        this.resumeData.links.push(this.data.candidateSocialMediaInformation.data.github_url);
        this.resumeData.links.push(this.data.candidateSocialMediaInformation.data.stack_overflow_url);
        this.resumeData.linksPreview = this.data.preview.showSocialInformation;
        this.resumeData.hobbies = [];
        this.resumeData.hobbiesPreview = false;
        this.getSkills();
        this.getLanguages();
        this.getExperience();
        this.getEducation();
        this.getTraining();
        this.getProjects();
        this.getCertificates();
    }

    getSkills() {
        this.resumeData.skillsFieldPreview={}
        this.resumeData.skillsPreview = true;
        this.resumeData.skillsFieldPreview.namePreview = true;
        this.resumeData.skillsFieldPreview.levelPreview = true;
        for (let i = 0; i < this.data.candidateSkillsInformation.data.length; i++) {
            this.resumeData.skills.push({
                name: this.data.candidateSkillsInformation.data[i].skill,
                level: this.data.candidateSkillsInformation.data[i].skill_level
            })
        }
    }

    getLanguages() {
        //Languages missing in Candidate module
        this.data.languages = []
        this.resumeData.languagesFieldPreview={};
        this.resumeData.languagesPreview = false;
        this.resumeData.languagesFieldPreview.namePreview = false;
        this.resumeData.languagesFieldPreview.levelPreview = false;
        for (let i = 0; i < this.data.languages.length; i++) {
            this.resumeData.languages.push({name: this.data.languages[i].name, level: this.data.languages[i].level})
        }
    }

    getExperience() {
        this.resumeData.experienceFieldPreview={};
        this.resumeData.experiencePreview = this.data.preview.showExperienceInformation;
        this.resumeData.experienceFieldPreview.fromPreview = this.data.preview.experienceDetailsData[1].checked;
        this.resumeData.experienceFieldPreview.toPreview = this.data.preview.experienceDetailsData[2].checked;
        this.resumeData.experienceFieldPreview.postPreview = this.data.preview.experienceDetailsData[3].checked;
        this.resumeData.experienceFieldPreview.companyPreview = this.data.preview.experienceDetailsData[0].checked;
        for (let i = 0; i < this.data.candidateExperienceInformation.data.length; i++) {
            this.resumeData.experience.push({
                from: this.data.candidateExperienceInformation.data[i].start_date,
                to: this.data.candidateExperienceInformation.data[i].end_date,
                post: this.data.candidateExperienceInformation.data[i].positions[0].position,
                company: this.data.candidateExperienceInformation.data[i].company_name,
            })
        }
    }

    getEducation() {
        this.resumeData.educationFieldPreview={}
        this.resumeData.educationPreview = this.data.preview.showEducationInformation;
        this.resumeData.educationFieldPreview.completion_datePreview = this.data.preview.educationDetailsData[2].checked;
        this.resumeData.educationFieldPreview.degree_namePreview = this.data.preview.educationDetailsData[0].checked;
        this.resumeData.educationFieldPreview.institutePreview = this.data.preview.educationDetailsData[4].checked;
        this.resumeData.educationFieldPreview.resultPreview = this.data.preview.educationDetailsData[3].checked;
        this.resumeData.educationFieldPreview.degree_levelPreview = this.data.preview.educationDetailsData[1].checked;
        this.resumeData.educationFieldPreview.subjectsPreview = this.data.preview.educationDetailsData[5].checked;
        for (let i = 0; i < this.data.candidateEducationInformation.data.length; i++) {
            this.resumeData.education.push({
                completion_date: this.data.candidateEducationInformation.data[i].year_of_completion,
                degree_name: this.data.candidateEducationInformation.data[i].degree_title,
                institute: this.data.candidateEducationInformation.data[i].institute_name,
                result: this.data.candidateEducationInformation.data[i].result,
                degree_level: this.data.candidateEducationInformation.data[i].degree_level,
                subjects: this.data.candidateEducationInformation.data[i].majorSubjects.map(value => value.major_subject),
            })
        }
    }

    getCertificates() {
        this.resumeData.certificatesFieldPreview={};
        this.resumeData.certificatesPreview = this.data.preview.showCertificationInformation;
        this.resumeData.certificatesFieldPreview.titlePreview = this.data.preview.certificationData[0].checked;
        this.resumeData.certificatesFieldPreview.institutePreview = this.data.preview.certificationData[2].checked;
        this.resumeData.certificatesFieldPreview.courseGradePreview = this.data.preview.certificationData[1].checked;
        this.resumeData.certificatesFieldPreview.completionDatePreview = this.data.preview.certificationData[3].checked;
        for (let i = 0; i < this.data.candidateCertificationInformation.data.length; i++) {
            this.resumeData.certificates.push({
                title: this.data.candidateCertificationInformation.data[i].course_name,
                institute: this.data.candidateCertificationInformation.data[i].institute_name,
                courseGrade: this.data.candidateCertificationInformation.data[i].course_grade,
                completionDate: this.data.candidateCertificationInformation.data[i].completion_date,
            })
        }
    }

    getTraining() {
        this.resumeData.trainingFieldPreview={};
        this.resumeData.trainingPreview = this.data.preview.showTrainingInformation;
        this.resumeData.trainingFieldPreview.fromPreview = this.data.preview.trainingData[4].checked;
        this.resumeData.trainingFieldPreview.toPreview = this.data.preview.trainingData[5].checked;
        this.resumeData.trainingFieldPreview.titlePreview = this.data.preview.trainingData[1].checked;
        this.resumeData.trainingFieldPreview.institutePreview = this.data.preview.trainingData[3].checked;
        this.resumeData.trainingFieldPreview.descriptionPreview = this.data.preview.trainingData[2].checked;
        for (let i = 0; i < this.data.candidateTrainingInformation.data.length; i++) {
            this.resumeData.training.push({
                from: this.data.candidateTrainingInformation.data[i].start_date,
                to: this.data.candidateTrainingInformation.data[i].end_date,
                title: this.data.candidateTrainingInformation.data[i].title,
                institute: this.data.candidateTrainingInformation.data[i].center,
                description: this.data.candidateTrainingInformation.data[i].description,
            })
        }
    }

    getProjects() {
        this.resumeData.projectFieldPreview={};
        this.resumeData.projectPreview = this.data.preview.showProjectInformation;
        this.resumeData.projectFieldPreview.estimateCompletionTimePreview = this.data.preview.projectData[2].checked;
        this.resumeData.projectFieldPreview.teamSizePreview = this.data.preview.projectData[3].checked;
        this.resumeData.projectFieldPreview.titlePreview = this.data.preview.projectData[0].checked;
        this.resumeData.projectFieldPreview.descriptionPreview = this.data.preview.projectData[1].checked;
        this.resumeData.projectFieldPreview.rolePreview = this.data.preview.projectData[4].checked;
        this.resumeData.projectFieldPreview.linksPreview = this.data.preview.projectData[6].checked;
        this.resumeData.projectFieldPreview.toolsAndTechnologiesPreview = this.data.preview.projectData[5].checked;
        for (let i = 0; i < this.data.candidateProjectInformation.data.length; i++) {
            this.resumeData.project.push({
                estimateCompletionTime: this.data.candidateProjectInformation.data[i].duration,
                teamSize: this.data.candidateProjectInformation.data[i].team_size,
                title: this.data.candidateProjectInformation.data[i].name,
                description: this.data.candidateProjectInformation.data[i].description,
                role: this.data.candidateProjectInformation.data[i].team_role,
                links: this.data.candidateProjectInformation.data[i].url,
                toolsAndTechnologies: this.data.candidateProjectInformation.data[i].technologies.map(value => value.name)
            })
        }
    }
}
