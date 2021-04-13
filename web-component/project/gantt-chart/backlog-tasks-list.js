import environment from "../../../../../src/environment.ts";

const backlogTasksListTemplate = document.createElement('template');
backlogTasksListTemplate.innerHTML = `

<style>
:host {
    display: block;
}
:host([hidden]) {
    display: none 
}
table, td, th {
    border: 1px solid #d0d0d0;
    text-align: center;
    padding: 15px;
}
table {
    border-collapse: collapse;
    width: 100%;
}
th {
    height: 20px;
}
table thead
{
    background: #e6e6e6;
}
</style>

<div>
<table></table>
</div>
`;

class BacklogTasksList extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(backlogTasksListTemplate.content.cloneNode(true));
    this.projectId = '';
    this.taskId = '';
  }

  connectedCallback() {
    this.generateTableHead(this.shadowRoot.querySelector('table'), ['Name', 'Planned Start Date', 'Planned End Date', 'Actual Start Date', 'Actual End Date', 'Assigne', 'Completion']);
    (this.shadowRoot.querySelector('tbody')) ? this.shadowRoot.querySelector('tbody').remove() : '';
    // this.addEventListener('click', this.thisFunction);
    // window.addEventListener('componentSelected', this.windowFunction);
  }

  disconnectedCallback() {
    // this.removeEventListener('click', this.thisFunction);
    // window.removeEventListener('componentSelected', this.windowFunction);
  }

  static get observedAttributes() {
    return ['projectid'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'projectid':
        this.projectId = newValue;
        this.getBacklogTasks();
        break;
    }
  }

  getBacklogTasks() {
    (this.shadowRoot.querySelector('tbody')) ? this.shadowRoot.querySelector('tbody').remove() : '';
    fetch(`${Environment.endpoint}/api/project/${this.projectId}/backlogs`, {
      method: 'GET',
    }).then(response => response.json())
      .then(jsonData => {
        if (jsonData.length > 0) {
          let data = [];
          jsonData.forEach(function (value, i) {
            data.push({
              id: value.id,
              name: value.name,
              plannedStartDate: (value.planned_start_date == null) ? '' : value.planned_start_date,
              plannedEndDate: (value.planned_end_date == null) ? '' : value.planned_end_date,
              actualStartDate: (value.actual_start_date == null) ? '' : value.actual_start_date,
              actualEndDate: (value.actual_end_date == null) ? '' : value.actual_end_date,
              assigne: (value.assigne == null) ? '' : value.assigne,
              completion: (value.completion == null) ? '' : value.completion,
            });
          });
          this.generateTable(this.shadowRoot.querySelector('table'), data);
        }
      })
  }

  generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }

  generateTable(table, data) {
    let tbody = table.createTBody();
    for (let element of data) {
      let row = tbody.insertRow();
      let editRow = tbody.insertRow();
      editRow.style.display = 'none';
      for (const key in element) {
        let append = true;
        if (key == 'id') {
          row.setAttribute('id', `task-${element[key]}`);
          editRow.setAttribute('id', `edit-task-${element[key]}`);
          append = false;
        }
        if (append) {
          var cell = row.insertCell();
          var editCell = editRow.insertCell();
        }
        let text = document.createTextNode(element[key]);
        let editText = document.createTextNode(element[key]);
        if (append) {
          cell.appendChild(text);
        }
        if (key == 'edit') {
          text = document.createElement('edit-font-icon');
          text.setAttribute('dispatcher', 'issueEditIconClicked');
          text.setAttribute('value', element[key]);
          cell.appendChild(text);
          text = document.createElement('trash-font-icon');
          text.setAttribute('dispatcher', 'issueDeleteIconClicked');
          text.setAttribute('value', element[key]);
          editText = document.createElement('check-font-icon');
          editText.setAttribute('title', 'Update Issue?');
          editText.setAttribute('dispatcher', 'issueUpdateIconClicked');
          editText.setAttribute('value', element[key]);
          editCell.appendChild(editText);
          editText = document.createElement('times-font-icon');
          editText.setAttribute('title', 'Cancel?');
          editText.setAttribute('dispatcher', 'issueCancelIconClicked');
          editText.setAttribute('value', element[key]);
        }
        if (append) {
          cell.appendChild(text);
          editCell.appendChild(editText);
        }
      }
    }
  }
}

window.customElements.define('backlog-tasks-list', BacklogTasksList);
export default BacklogTasksList;
