import {html, PolymerElement} from "@polymer/polymer/polymer-element";

class MoePixmicatPushpost extends PolymerElement {
  static get template() {
    return html`
<style>
:host {
    display: block;
    background: white;
    padding: 1em;
    font-size: small;
    clear: left;
}
#content {
    display: block;
    line-height: 1.5em;
    max-height: 7.5em;
    overflow-y: scroll;
}
::slotted(._h) {
    color: var(--moe-post-header-id-text-color);
}
</style>
<div id="pushpost">
    <div id="content"><slot></slot></div>
</div>
`;
  }

  static get properties() {
    return {};
  }
}

window.customElements.define('moe-pixmicat-pushpost', MoePixmicatPushpost);
