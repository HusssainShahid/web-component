const templateNoticeBoard = document.createElement('template');
templateNoticeBoard.innerHTML = `
<style>
    div{
        display:flex;
    }
</style>
<div>
    <slot name="notice"></slot>
</div>
  `;

export class NoticeBoard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateNoticeBoard.content.cloneNode(true));
    }
}

window.customElements.define('notice-board', NoticeBoard);