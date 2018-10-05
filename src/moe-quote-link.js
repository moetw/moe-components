import { html, PolymerElement } from '@polymer/polymer/polymer-element'
import './moe-styles'

class MoeQuoteLink extends PolymerElement {
  static get template () {
    return html`
<style>
:host {
    display: inline;
    color: var(--moe-post-quote-link-color);
}
:host(:hover) {
    cursor: pointer;
    color: var(--moe-post-quote-link-hover-color);
}
span:before {
    content: '>>';
}
</style>
<span on-click="_onClick"><slot></slot></span>
`
  }

  static get properties () {
    return {
      no: {
        type: Number
      }
    }
  }

  _onClick (e) {
    this.dispatchEvent(new CustomEvent('quoteLinkClick', {
      bubbles: true,
      composed: true,
      detail: {
        no: this.no
      }
    }))
  }
}

window.customElements.define('moe-quote-link', MoeQuoteLink)
