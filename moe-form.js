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
import '@polymer/paper-tooltip/paper-tooltip';

import './color';
import './moe-file-button';
import './moe-form-video-embeds';
import './moe-form-video-embed-input';
import './moe-form-embed-request';
import './moe-form-poll-title-input';
import './moe-form-poll-items';
import {Poll} from './poll';

export class MoeForm extends PolymerElement {
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
    clear: both; /* to prevent the char-counter of paper-textarea from affecting layout */
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
        <template is="dom-if" if="[[hasSubject]]">
            <paper-input id="subject" label="主題" char-counter maxlength="[[subjectMaxLength]]" value="{{subject}}" disabled$="[[disabled]]" spellcheck="true"></paper-input>
        </template>
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
            <moe-form-poll-title-input id="pollTitleInput" value="{{pollTitle}}" hidden on-cancel="_onPollTitleInputCancel" disabled$="[[disabled]]" max-length="[[pollTitleMaxLength]]"></moe-form-poll-title-input>
            <moe-form-poll-items id="pollItems" items="{{pollItems}}" min-items="[[pollMinItems]]" max-items="[[pollMaxItems]]" max-length="[[pollItemMaxLength]]" disabled$="[[disabled]]" hidden></moe-form-poll-items>
        </div>
        <moe-form-video-embed-input id="videoEmbedInput" hidden on-submit="_onVideoEmbedInputSubmit" on-cancel="_onVideoEmbedInputCancel" disabled$="[[disabled]]"></moe-form-video-embed-input>
        <moe-form-video-embeds embeds="{{videoEmbeds}}" id="videoEmbeds" max-embeds="[[videoMaxEmbeds]]" disabled$="[[disabled]]"></moe-form-video-embeds>
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
                reflectToAttribute: true,
                notify: true,
                observer: '_observeLoading'
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

            /** Subject */
            hasSubject: {
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true
            },
            subject: {
                type: String,
                notify: true,
                value: ""
            },
            subjectMaxLength: Number,

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
            videoMaxEmbeds: Number,
            videoEmbeds: {
                type: Array,
                notify: true,
                value: []
            },
            embedRequestServer: {
                type: String
            },

            /** Poll Embed */
            hasPoll: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            pollTitleMaxLength: Number,
            pollItemMaxLength: Number,
            pollMinItems: Number,
            pollMaxItems: Number,
            pollDisabled: {
                type: Boolean,
                computed: '_computePollDisabled(hasPoll)'
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

    validate() {
      return null;
    }

    getFormData() {
        return {
            boardId: this.boardId,
            threadNo: this.threadNo,
            replyTo: this.replyTo,
            subject: this.subject,
            comment: this.comment,
            file: this.file,
            videoEmbeds: this.videoEmbeds,
            poll: new Poll(this.pollTitle, this.pollItems)
        };
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

    _computePollDisabled(hasPoll) {
        return !hasPoll;
    }

    /** Loading State */
    _observeLoading(newValue, oldValue) {
        if (newValue && !oldValue) {
            this.dispatchEvent(new CustomEvent('loading-start', {
                bubbles: true,
                composed: true
            }));
        } else if (!newValue && oldValue) {
            this.dispatchEvent(new CustomEvent('loading-end', {
                bubbles: true,
                composed: true
            }));
        }
    }
}

window.customElements.define('moe-form', MoeForm);
