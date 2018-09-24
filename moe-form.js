import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-button';
import '@polymer/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/image-icons';
import '@polymer/iron-icons/social-icons';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-icon'
import '@polymer/iron-flex-layout/iron-flex-layout';

import './color';
import './moe-file-button';
import './moe-form-video-embeds';
import './moe-form-video-embed-input';
import './moe-form-embed-request';
import './moe-form-poll-title-input';
import './moe-form-poll-items';
import {Poll} from './poll';

class MoeForm extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
}
form {
    @apply --layout-vertical;
    margin: 0;
    padding: 0;
}
#inputs {
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
}

#imageUploads {
    @apply --layout-horizontal;
    @apply --layout-center;
}
#imageUploadsMessage {
    @apply --layout-auto;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
}

#embedButtons {
    @apply --layout-horizontal;
}
#embedButtons paper-button iron-icon {
    padding-right: 0.5em;
}
#embedButtons > * {
    @apply --layout-flex-auto; /* fill */
}

#actions {
    @apply --layout-horizontal;
    @apply --layout-end-justified;
    border-top: 1px solid #f5f5f5;
    margin-top: 0.5em;
    padding-top: 24px;
}
#actions paper-button {
    padding-left: 3em;
    padding-right: 3em;
    font-weight: 800;
}
#buttonSubmit paper-spinner-light:not([active]) {
    display: none;
}
#videoEmbeds {
    margin-top: 1em;
}
paper-spinner:not([active]) {
    display: none;
}
</style>
<form>
    <div id="inputs">
        <paper-textarea id="comment" label="內文" char-counter maxlength="[[commentMaxLength]]" value="{{comment}}" rows="3" max-rows="3" disabled$="[[disabled]]" spellcheck="true"></paper-textarea>
        <div id="embedButtons">
            <moe-file-button id="file" file="{{file}}" file-selected="{{fileSelected}}" file-max-size="[[fileMaxSize]]" on-change="_onFileChange" disabled$="[[disabled]]"></moe-file-button>            
            <paper-button on-click="_onVideoEmbedButtonClick" disabled$="[[disabled]]"><iron-icon icon="av:movie"></iron-icon>影片</paper-button>
            <paper-button on-click="_onPollButtonClick" disabled$="[[disabled]]" hidden$="[[pollDisabled]]"><iron-icon icon="social:poll"></iron-icon>投票</paper-button>
        </div>
        <div id="imageUploads">
            <template is="dom-if" if="[[fileSelected]]">
                <paper-icon-button icon="cancel" on-click="_onCancelImageUploadsClick" disabled$="[[disabled]]"></paper-icon-button>
            </template>
            <span id="imageUploadsMessage"></span>
        </div>
        <div id="poll" hidden$="[[pollDisabled]]">
            <moe-form-poll-title-input id="pollTitleInput" value="{{pollTitle}}" hidden on-cancel="_onPollTitleInputCancel" disabled$="[[disabled]]"></moe-form-poll-title-input>
            <moe-form-poll-items id="pollItems" items="{{pollItems}}" disabled$="[[disabled]]" hidden></moe-form-poll-items>
        </div>
        <moe-form-video-embed-input id="videoEmbedInput" hidden on-submit="_onVideoEmbedInputSubmit" on-cancel="_onVideoEmbedInputCancel" disabled$="[[disabled]]"></moe-form-video-embed-input>
        <moe-form-video-embeds embeds="{{videoEmbeds}}" id="videoEmbeds" disabled$="[[disabled]]"></moe-form-video-embeds>
    </div>
    <div id="actions">
        <paper-button id="buttonCancel" on-click="_onButtonCancelClick" disabled$="[[disabled]]">取消</paper-button>
        <paper-button raised id="buttonSubmit" on-click="_onButtonSubmitClick" disabled$="[[disabled]]">
            <div hidden$="[[loading]]">送出</div>
            <paper-spinner active$="[[loading]]"></paper-spinner>
        </paper-button>
    </div>
</form>

<moe-form-embed-request id="embedRequest" server="[[embedRequestServer]]"></moe-form-embed-request>
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
                notify: true,
                value: ""
            },
            commentMaxLength: {
                type: Number,
                reflectToAttribute: true
            },

            /** File Upload */
            file: {
                type: Object,
                notify: true
            },
            fileSelected: {
                type: Boolean
            },
            fileMaxSize: {
                type: Number,
                reflectToAttribute: true
            },

            /** Video Embed */
            videoEmbeds: {
                type: Array,
                notify: true,
                value: []
            },
            embedRequestServer: {
                type: String
            },

            /** Poll Embed */
            poll: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            pollDisabled: {
                type: Boolean,
                computed: '_computePollDisabled(poll)'
            },
            pollTitle: {
                type: String,
                value: "",
                notify: true
            },
            pollItems: {
                type: Array,
                value: [],
                notify: true
            },
            pollRequestServer: {
                type: String
            },
        };
    }

    /** Form control */

    focus() {
        this.$.comment.focus();

        const len = this.$.comment.value.length;
        this.$.comment.inputElement.textarea.setSelectionRange(len, len);
    }

    reset() {
        // reset comment and file
        this.set('comment', "");
        this.$.file.cancel();

        // reset video embeds
        this.$.videoEmbeds.reset();
        this.$.videoEmbedInput.cancel();

        // reset poll
        this.set('pollTitle', "");
        this.$.pollItems.reset();
        this.$.pollTitleInput.cancel();
    }

    changed() {
        return (this.videoEmbeds && this.videoEmbeds.length) ||
            this.pollTitle ||
            this.$.pollItems.changed() ||
            this.file ||
            (this.comment && this.comment.length > 0);
    }

    _onButtonSubmitClick() {
        this.dispatchEvent(new CustomEvent('submit', {
            bubbles: true,
            composed: true,
            detail: {
                boardId: this.boardId,
                threadNo: this.threadNo,
                replyTo: this.replyTo,
                comment: this.comment,
                file: this.file,
                videoEmbeds: this.videoEmbeds,
                poll: new Poll(this.pollTitle, this.pollItems)
            }
        }));
    }

    _onButtonCancelClick() {
        this.dispatchEvent(new CustomEvent('cancel', {
            bubbles: true,
            composed: true
        }));
    }

    /** Image Upload */

    _onCancelImageUploadsClick(e) {
        this.$.file.cancel();
    }

    _onFileChange(e) {
        if (!e.detail.file) {
            this.$.imageUploadsMessage.textContent = "";
            return;
        }

        if (e.detail.file.size > this.fileMaxSize) {
            alert(`附圖檔案大小超過 ${this.fileMaxSize / 1024 / 1024} MB`);
            this.$.file.cancel();
            return;
        }

        this.$.imageUploadsMessage.textContent = `${e.detail.file.name}`;
    }

    /** Video Embed */

    resetVideoEmbeds() {
        if (this.videoEmbeds.length === 0 || confirm("確定要刪除影片嗎？")) {
            this.$.videoEmbedInput.setAttribute('hidden', "true");
            this.$.videoEmbedInput.reset();
            this.$.videoEmbeds.setAttribute('hidden', "true");
            this.$.videoEmbeds.reset();
        }
    }

    _onVideoEmbedButtonClick(e) {
        if (this.$.videoEmbedInput.hasAttribute('hidden')) {
            this.$.videoEmbedInput.removeAttribute('hidden');
            this.$.videoEmbedInput.focus();
        } else {
            this.resetVideoEmbeds();
        }
    }

    _onVideoEmbedInputSubmit(e) {
        this.$.videoEmbedInput.disabled = true;
        this.$.embedRequest
            .query(e.detail.value)
            .then(resp => {
                this.$.videoEmbeds.add(resp.thumb, resp.title, resp);
                this.$.videoEmbedInput.reset();
            })
            .catch(e => {
                alert(e.message);
            })
            .finally(() => {
                console.log(e);
                this.$.videoEmbedInput.disabled = false
            });
    }

    _onVideoEmbedInputCancel(e) {
        this.resetVideoEmbeds();
    }

    _computeVideoEmbedButtonDisabled(videoEmbedInputDisplay) {
        return videoEmbedInputDisplay;
    }

    /** Poll */

    resetPoll() {
        if ((!this.$.pollItems.changed() && !this.pollTitle) || confirm("確定要刪除投票嗎？")) {
            this.$.pollTitleInput.setAttribute('hidden', "true");
            this.$.pollTitleInput.reset();
            this.$.pollItems.setAttribute('hidden', "true");
            this.$.pollItems.reset();
        }
    }

    _onPollButtonClick(e) {
        if (this.$.pollTitleInput.hasAttribute('hidden')) {
            this.$.pollTitleInput.removeAttribute('hidden');
            this.$.pollTitleInput.focus();
            this.$.pollItems.removeAttribute('hidden');
        } else {
            this.resetPoll();
        }
    }

    _onPollTitleInputCancel(e) {
        this.resetPoll();
    }

    _computePollDisabled(poll) {
        return !poll;
    }
}

window.customElements.define('moe-form', MoeForm);
