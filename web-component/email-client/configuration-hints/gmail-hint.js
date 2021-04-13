import {TranslateString} from "../../translate-string";

const templateGmailHint = document.createElement('template');
templateGmailHint.innerHTML = `
<style>

</style>
<h2 data-translate="Gmail">Gmail</h2>
<p data-translate="For setting up your gmail account, first you have to do some settings in you gmail account. Please follow mentioned steps.">For setting up your gmail account, first you have to do some settings in you gmail account. Please follow mentioned steps.</p>
<ul>
    <li> <span data-translate="Open your gmail account, On top right click">Open your gmail account, On top right click </span><b><span data-translate="settings">settings</span>
    <?xml version="1.0" encoding="utf-8"?>
<svg width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1152 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm512-109v222q0 12-8 23t-20 13l-185 28q-19 54-39 91 35 50 107 138 10 12 10 25t-9 23q-27 37-99 108t-94 71q-12 0-26-9l-138-108q-44 23-91 38-16 136-29 186-7 28-36 28h-222q-14 0-24.5-8.5t-11.5-21.5l-28-184q-49-16-90-37l-141 107q-10 9-25 9-14 0-25-11-126-114-165-168-7-10-7-23 0-12 8-23 15-21 51-66.5t54-70.5q-27-50-41-99l-183-27q-13-2-21-12.5t-8-23.5v-222q0-12 8-23t19-13l186-28q14-46 39-92-40-57-107-138-10-12-10-24 0-10 9-23 26-36 98.5-107.5t94.5-71.5q13 0 26 10l138 107q44-23 91-38 16-136 29-186 7-28 36-28h222q14 0 24.5 8.5t11.5 21.5l28 184q49 16 90 37l142-107q9-9 24-9 13 0 25 10 129 119 165 170 7 8 7 22 0 12-8 23-15 21-51 66.5t-54 70.5q26 50 41 98l183 28q13 2 21 12.5t8 23.5z"/></svg>
    </b> <span data-translate="Icon.">Icon.</span></li>
    <li><span data-translate="Click">Click </span><b data-translate="See all Settings">See all Settings</b></li>
    <li><span data-translate="In setting navbar click ">In setting navbar click </span><b data-translate="Forwarding and POP/IMAP">Forwarding and POP/IMAP</b></li>
    <li><span data-translate="Now enable ">Now enable </span><b data-translate="POP download:">POP download:</b><span data-translate="and">and</span><b data-translate="IMAP access:">IMAP access:</b></li>
    <li data-translate="Save changes">Save changes</li>
    <li><span data-translate="Now check this setting">Now check this setting </span> <a href="https://myaccount.google.com/lesssecureapps" target="_blank" data-transalte="Allow less secure apps.">Allow less secure apps.</a></li>
</ul>
  `;

export class GmailHint extends TranslateString {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateGmailHint.content.cloneNode(true));
  }
}

window.customElements.define('gmail-hint', GmailHint);
