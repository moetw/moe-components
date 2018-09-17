import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import DOMPurify from "dompurify";

class MoePostComment extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
    height: auto;
    word-break: break-all;
}

#content {
    line-height: 1.5em;
}

.highlight-quote {
    color: var(--moe-post-quote-text-color);
}

</style>
<span id="content"></span>
<moe-pixmicat-pushpost id="pushpost" style="display:none"></moe-pixmicat-pushpost>
`;
    }

    static get properties() {
        return {
            comment: {
                type: String
            }
        };
    }

    ready() {
        super.ready();

        let processed = this.comment;

        // highlight quotes
        processed = this._highlightQuotes(processed);

        // link quotes
        processed = this._linkQuotes(processed);

        // mod_pushpost
        processed = this._modPushpost(processed);

        this.$.content.innerHTML = DOMPurify.sanitize(processed);

        this.$.content.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => {
                this.dispatchEvent(new CustomEvent("processed"));
            });
        });

        setTimeout(() => this.dispatchEvent(new CustomEvent("processed")), 0);
    }

    _highlightQuotes(text) {
        const regex = /(^|<br(?: \/)?>)((?:&gt;|＞).*?)(?=<br(?: \/)?>|$)/gm;
        const subst = '$1<span class="highlight-quote">$2</span>';
        return text.replace(regex, subst);
    }

    _linkQuotes(text) {
        const regex = /((?:&gt;|＞)+)(?:No\.)?(\d+)/i;
        const subst = '<moe-quote-link no="$2">&gt;No.$2</moe-quote-link>';
        return text.replace(regex, subst);
    }

    _modPushpost(text) {
        const regex = /\[MOD_PUSHPOST_USE\]<br(?: \/)?>([\w\W]+$)/gm;
        const matches = regex.exec(text);
        if (matches) {
            this.$.pushpost.innerHTML = matches[1];
            this.$.pushpost.style.display = 'block';
        }
        return text.replace(regex, '');
    }
}


window.customElements.define('moe-post-comment', MoePostComment);