import {html, PolymerElement} from "@polymer/polymer/polymer-element";

class MoeQuoteLink extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: inline-block;
}
span {
    color: var(--moe-post-quote-link-color);
}
span:hover {
    cursor: pointer;
    color: var(--moe-post-quote-link-hover-color);
}
</style>
<span on-click="_onClick"><slot></slot></span>
`;
    }

    static get properties() {
        return {
            no: {
                type: Number
            }
        };
    }

    _onClick() {
        this.dispatchEvent(new CustomEvent('quoteLinkClick', {
            bubbles: true,
            composed: true,
            detail: {
                no: this.no
            }
        }))
    }
}

window.customElements.define('moe-quote-link', MoeQuoteLink);