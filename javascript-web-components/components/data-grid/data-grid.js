const templateDataGrid = document.createElement('template');
templateDataGrid.innerHTML = `
<style>
     table, td, th {
         border: 1px solid black;
         text-align: left;
         padding: 10px;
    }
    table {
         border-collapse: collapse;
         width: 100%;
    }
    .ascending-descending{
        cursor: pointer;
    }
    .ascending-descending:hover, .ascending-descending-active{
        color: rgba(35,27,204,0.6);
    }
    .loader,
    .loader:after {
      border-radius: 50%;
      width: 10em;
      height: 10em;
    }
    .loader {
      margin: 60px auto;
      font-size: 10px;
      position: relative;
      text-indent: -9999em;
      border-top: 1.1em solid rgba(0,0,0, 0.2);
      border-right: 1.1em solid rgba(0,0,0, 0.2);
      border-bottom: 1.1em solid rgba(0,0,0, 0.2);
      border-left: 1.1em solid #000000;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: load8 1.1s infinite linear;
      animation: load8 1.1s infinite linear;
    }
    @-webkit-keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    .search{
      float:right;
      width: 30%;
      box-sizing: border-box;
      border:1px solid #ccc;
      border-bottom:  2px solid black ;
      border-radius: 4px;
      font-size: 16px;
      background-color: white;
      padding: 12px 20px 12px 40px;
      outline:none;
      margin-bottom: 10px;
    }
    @media only screen and (max-width: 600px) {
      .search {
        width: 50%;
      }
    }
    .search-form{
        position: relative;
    }
    .search-form button{
        background: white;
        border: none;
        padding: 5px 15px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius:5px;
        transition: 0.5s;
        outline: none;
    }
    .search-form .submit-button{
        position: absolute;
        right: 0;
        top: 2px;
    }
    .search-form .submit-button:hover{
        background: rgba(204,204,204,0.04);
    }
    .empty-data{
        margin: 150px 0;
        text-align: center;
    }
    .empty-data span{
        font-size: 80px;
    }
    .empty-data p{
        font-size: 50px;
    }
    ::slotted([slot="caption"]){
        font-size: 40px;
        text-align: center;
    }
    .select-field-for-pagination{
        font-size: 20px;
    }
    .select-field-for-pagination select{
      width: 60px;
      padding: 12px 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: vertical;
    }
    .pagination-bar{
        margin:40px;
        float: right;
        display: inline-block;
    }
    
    .pagination-bar a {
        color: black;
        float: left;
        padding: 8px 16px;
        text-decoration: none;
        border: 1px solid #ddd;
        cursor: pointer;
    }
    
    .pagination-bar a.active {
        background-color: black;
        color: white;
        border: 1px solid black;
    }
    
    .pagination-bar a:hover:not(.active) {background-color: #ddd;}
    
    .pagination-bar a:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    
    .pagination-bar a:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
   

</style>

<div class="data-grid">
    <slot class="caption" name="caption"></slot>
    <div class="select-field-for-pagination">
      No. of entries showing by pagination
       <select id="pagination-select" name="pagination-select">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
      </select>     
    </div>
    <div class="search-form">
        <form>
            <input type="text" class="search" placeholder="search here">
            <button type="submit" class="submit-button">&#128269;</button>
        </form>
    </div>
    <div class="loader">Loading...</div>
    <table>
        <thead></thead>
    </table>
    <div class="empty-data">
        <span>&#128557;</span>
        <p>Sorry, Did not find any thing.</p>
    </div>
        <div class="pagination-bar">
         <a class="previous">&laquo;</a>
         <span class="pagination-link">
          </span>
          <a class="next">&raquo;</a>
    </div>
</div>
  `;

export class DataGrid extends HTMLElement {

    static get observedAttributes() {
        return ['header', 'key'];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateDataGrid.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.header != null && this.key != null) {
            this.fetchTableData();
        }
    }

    connectedCallback() {
        this.reverseStatus = false;
        this.searched = false;
        this.searchResultData = [];
        this.activeButton = 0;
        this.entriesOnPage = '10';
        this.activePageNo = 0;
        this.pageData = [];
        this.initializingBasicVariables();
        this.initializingBasicStyling();
        this.addEventListeners();
    }

    //pagination functions
    pageLength() {
        this.activeButton = 0;
        this.activePageNo = 0;
        let value = this.selectPagination.selectedIndex;
        this.entriesOnPage = this.selectPagination.options[value].text;
        this.noOfPages = this.tableData.length / this.entriesOnPage;
        this.paginationButtons();
        this.paginating();
    }

    paginating() {
        this.searchInput.value = '';
        let data = [];
        let k = 0;
        for (let i = 0; i < this.tableData.length; i += parseInt(this.entriesOnPage)) {
            let j = parseInt(this.entriesOnPage) + i;
            data[k] = this.tableData.slice(i, j);
            k++;
        }
        this.tableBody.remove();
        this.pageData = data[this.activePageNo];
        this.generateData(this.pageData);
    }

    paginationButtons() {
        this.paginationSpan.innerHTML = '';
        if (this.noOfPages < 5 && this.noOfPages >= 1) {
            for (let i = 0; i < this.noOfPages; i++) {
                let button = document.createElement('a');
                button.innerText = i + 1;
                this.paginationSpan.appendChild(button);
                this.activePage();
            }
        } else if (this.noOfPages < 1) {
            alert('There are only ' + this.tableData.length + ' entities');
        } else {
            for (let i = 0; i < 5; i++) {
                let button = document.createElement('a');
                button.innerText = i + 1;
                this.paginationSpan.appendChild(button);
                this.activePage();
            }
        }
        let paginationButton = this.paginationSpan.querySelectorAll('a').length;
        for (let i = 0; i < paginationButton; i++) {
            this.paginationSpan.querySelectorAll('a')[i].addEventListener('click', function () {
                let activeButton = this.paginationSpan.querySelectorAll("a")[i].innerHTML;
                this.activePageNo = activeButton - 1;
                this.paginating();
                this.activeButton = i;
                this.activePage();
            }.bind(this));
        }
        this.paginationBar.querySelector('.previous').addEventListener('click', this.previousPage.bind(this));
        this.paginationBar.querySelector('.next').addEventListener('click', this.nextPage.bind(this));
    }

    previousPage() {
        let buttons = this.paginationSpan.querySelectorAll('a');
        console.log(buttons[0].innerHTML);
        if (this.activePageNo > 0 && buttons[0].innerHTML > 1) {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].innerHTML--;
            }
            this.activePageNo--;
            this.paginating();
        } else {
            this.paginationBar.querySelector('.previous').style.background = ' #d9d9d9';
        }

    }

    nextPage() {
        let buttons = this.paginationSpan.querySelectorAll('a');
        if (buttons[buttons.length - 1].innerHTML < this.noOfPages) {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].innerHTML++;
            }
            this.activePageNo++;
            this.paginating();
        } else {
            this.paginationBar.querySelector('.next').style.background = ' #d9d9d9';
        }
    }

    activePage() {
        let paginationButton = this.paginationSpan.querySelectorAll('a');
        for (let i = 0; i < paginationButton.length; i++) {
            paginationButton[i].classList.remove('active');
        }
        paginationButton[this.activeButton].classList.add('active');
    }

    //searching data functions
    searchData(e, searchData) {
        e.preventDefault();
        let value = this.searchInput.value.toUpperCase();
        let upperCaseData;
        this.searched = false;
        this.searchResultData = [];
        for (let i = 0; i < searchData.length; i++) {
            for (let k = 0; k < this.keyValues.length; k++) {
                let data = searchData[i][this.keyValues[k]];
                if (typeof data === "string") {
                    upperCaseData = data.toUpperCase();
                } else {
                    upperCaseData = data.toString().toUpperCase();
                }
                if (upperCaseData === value) {
                    this.searchResultData.push(searchData[i]);
                    this.tableBody.remove();
                    this.generateData(this.searchResultData);
                    this.searched = true;
                }
            }
        }
        if (!this.searched) {
            this.table.style.display = 'none';
            this.emptyData.style.display = '';
        }
    }

    //sorting functions
    headerForSorting(i, serialno) {
        let ascending = "\u25B2";
        let descending = "\u25BC";
        let span = document.createElement('span');
        span.style.cssFloat = 'right';
        let ascendingSpan = document.createElement('span');
        let descendingSpan = document.createElement('span');
        ascendingSpan.innerText = ascending;
        descendingSpan.innerText = descending;
        ascendingSpan.classList.add('ascending-descending');
        descendingSpan.classList.add('ascending-descending');
        span.appendChild(ascendingSpan);
        span.appendChild(descendingSpan);
        ascendingSpan.addEventListener('click', function () {
            if (this.searched) {
                this.sorting('ascending', i, serialno, this.searchResultData);
            } else if (this.pagination) {
                this.sorting('ascending', i, serialno, this.pageData);
            } else {
                this.sorting('ascending', i, serialno, this.tableData);
            }
        }.bind(this), false);
        descendingSpan.addEventListener('click', function () {
            if (this.searched) {
                this.sorting('descending', i, serialno, this.searchResultData);
            } else if (this.pagination) {
                this.sorting('descending', i, serialno, this.pageData);
            } else {
                this.sorting('descending', i, serialno, this.tableData);
            }
        }.bind(this), false);
        return span;
    }

    sorting(x, i, serialno, data) {
        let sortId = i;
        if (serialno) {
            sortId = i - 1;
        }
        let key = this.keyValues[sortId];
        if (x === 'ascending') {
            if (i === 0 && this.serialno) {
                if (this.reverseStatus) {
                    this.reverseStatus = false;
                    data.reverse();
                    this.tableBody.remove();
                    this.generateData(data);
                }
            } else {
                this.arrangeData = [...data].sort(this.arrangedOrder(key));
                this.tableBody.remove();
                this.generateData(this.arrangeData)
            }
        } else if (x === 'descending') {
            if (i === 0 && this.serialno) {
                this.reverseStatus = true;
                data.reverse();
                this.tableBody.remove();
                this.generateData(data);
            } else {
                this.arrangeData = [...data].sort(this.arrangedOrder(key, 'desc'));
                this.tableBody.remove();
                this.generateData(this.arrangeData)
            }

        }
    }

    arrangedOrder(key, order = 'asc') {
        return function (a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                return 0;
            }

            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order == 'desc') ? (comparison * -1) : comparison
            );
        };
    }

    //generating table and its data
    generateTable() {
        this.generateHeading();
        this.generateData(this.tableData);
    }

    generateData(x) {
        this.keyValues = this.key.split(',');
        this.tableBody = this.table.createTBody();
        for (let i = 0; i < x.length; i++) {
            let row = this.table.insertRow(i);
            let keys = Object.keys(x[i]);
            for (let j = 0; j < keys.length; j++) {
                for (let k = 0; k < this.keyValues.length; k++) {
                    if (this.keyValues[k] === keys[j] && k === 0 && this.serialno) {
                        let td = document.createElement('td');
                        let data = row.appendChild(td);
                        data.innerText = i + 1;
                    }
                    if (this.keyValues[k] === keys[j]) {
                        let td = document.createElement('td');
                        let data = row.appendChild(td);
                        data.innerText = x[i][this.keyValues[k]]
                    }
                }
            }
        }
    }

    generateHeading() {
        this.heading = this.header.split(',');
        if (this.serialno) {
            this.heading.unshift("Sr No");
        }
        for (let i = 0; i < this.heading.length; i++) {
            let th = document.createElement('th');
            let p = document.createElement('p');
            p.style.display = 'inline';
            let paragraph = th.appendChild(p);
            paragraph.innerText = this.heading[i];
            if (this.sortable) {
                let sort = this.headerForSorting(i, this.serialno);
                th.appendChild(sort);
            }
            this.table.createTHead().appendChild(th);
        }
    }

    //fetching data function
    fetchTableData() {
        let api = this.api;
        fetch(api)
            .then(response => response.json())
            .then(json => {
                this.tableData = json;
                this.generateTable();
                this.loader.style.display = "none";
                this.searchBar.style.display = 'inline';
                this.submitButton.style.display = '';
                if (this.pagination) {
                    this.shadowRoot.querySelector('.select-field-for-pagination').style.display = '';
                    this.paginationBar.style.display = '';
                    this.noOfPages = this.tableData.length / this.entriesOnPage;
                    this.paginationButtons();
                    this.paginating();
                }
            });
    }

    //constructor functions
    initializingBasicVariables() {
        this.table = this.shadowRoot.querySelector('table');
        this.loader = this.shadowRoot.querySelector('.loader');
        this.searchBar = this.shadowRoot.querySelector('.search');
        this.submitButton = this.shadowRoot.querySelector('.submit-button');
        this.searchForm = this.shadowRoot.querySelector('form');
        this.searchInput = this.shadowRoot.querySelector('input');
        this.emptyData = this.shadowRoot.querySelector('.empty-data');
        this.selectPagination = this.shadowRoot.querySelector('select');
        this.paginationSelectField = this.shadowRoot.querySelector('.select-field-for-pagination');
        this.paginationBar = this.shadowRoot.querySelector('.pagination-bar');
        this.paginationSpan = this.shadowRoot.querySelector('.pagination-link');
    }

    initializingBasicStyling() {
        this.searchBar.style.display = 'none';
        this.emptyData.style.display = 'none';
        this.submitButton.style.display = 'none';
        this.paginationSelectField.style.display = 'none';
        this.paginationBar.style.display = 'none';
    }

    addEventListeners() {
        this.searchForm.addEventListener('submit', function (e) {
            if (this.pagination) {
                this.searchData(e, this.pageData)
            } else {
                this.searchData(e, this.tableData)
            }
        }.bind(this));
        this.selectPagination.addEventListener('change', this.pageLength.bind(this));
        this.searchInput.addEventListener('keyup', function () {
            if (this.searchInput.value === '') {
                this.table.style.display = '';
                this.emptyData.style.display = 'none';
                let thead = this.shadowRoot.querySelector('thead');
                thead.remove();
                this.tableBody.remove();
                this.generateTable(this.tableData);
            }
        }.bind(this), false);
    }

    get api() {
        return this.getAttribute("api")
    }

    get header() {
        return this.getAttribute("header")
    }

    get key() {
        return this.getAttribute("key")
    }

    get serialno() {
        return this.hasAttribute("serialno")
    }

    get sortable() {
        return this.hasAttribute("sortable")
    }

    get search() {
        return this.hasAttribute("search")
    }

    get pagination() {
        return this.hasAttribute("pagination")
    }

}

window.customElements.define('data-grid', DataGrid);
