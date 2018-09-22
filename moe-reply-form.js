import {html, PolymerElement} from "@polymer/polymer/polymer-element";

import './moe-form';

class MoeReplyForm extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
}
</style>
<moe-form
    id="form"
    disabled$="[[disabled]]"
    loading$="[[loading]]"
    board-id="[[boardId]]"
    thread-no="[[threadNo]]"
    reply-to="[[replyTo]]"
    comment="{{comment}}"
    comment-max-length="[[commentMaxLength]]"
    video-embeds="{{videoEmbeds}}"
    embed-request-server="[[embedRequestServer]]"></moe-form>
`;
    }

    static get properties() {
        return {
            disabled: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            loading: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /** Post properties */
            boardId: {
                type: Number,
            },
            threadNo: {
                type: Number
            },
            replyTo: {
                type: Number
            },

            /** Comment */
            comment: {
                type: String,
                notify: true
            },
            commentMaxLength: {
                type: Number,
                reflectToAttribute: true
            },

            /** Video Embed */
            videoEmbeds: {
                type: Array,
                notify: true
            },
            embedRequestServer: {
                type: String
            }
        };
    }

    /** Form control */

    focus() {
        return this.$.form.focus();
    }

    reset() {
        return this.$.form.reset();
    }

    changed() {
        return this.$.form.changed();
    }

}


window.customElements.define('moe-reply-form', MoeReplyForm);