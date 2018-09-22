import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-button';
import '@polymer/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/image-icons';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-icon'
import '@polymer/iron-flex-layout/iron-flex-layout';

import './color';
import './moe-file-button';
import './moe-form-video-embeds';
import './moe-form-video-embed-input';
import './moe-form-embed-request';

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

#imageUploads {
    @apply --layout-horizontal;
    @apply --layout-center;
}
#imageUploadsMessage {
    @apply --layout-auto;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
}

#embedButtons {
    @apply --layout-horizontal;
}
#embedButtons paper-button iron-icon {
    padding-right: 0.5em;
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
    <paper-textarea id="comment" label="內文" char-counter maxlength="[[commentMaxLength]]" value="{{comment}}" rows="3" max-rows="3" disabled$="[[disabled]]"></paper-textarea>
    <div id="embedButtons">
        <moe-file-button id="file" file="{{file}}" file-selected="{{fileSelected}}" file-max-size="[[fileMaxSize]]" on-change="_onFileChange" disabled$="[[disabled]]"></moe-file-button>            
        <paper-button on-click="_onVideoEmbedButtonClick" disabled$="[[disabled]]"><iron-icon icon="av:movie"></iron-icon>附加影片</paper-button>
    </div>
    <div id="imageUploads">
        <template is="dom-if" if="[[fileSelected]]">
            <paper-icon-button icon="cancel" on-click="_onCancelImageUploadsClick" disabled$="[[disabled]]"></paper-icon-button>
        </template>
        <span id="imageUploadsMessage"></span>
    </div>
    <moe-form-video-embed-input id="videoEmbedInput" hidden on-submit="_onVideoEmbedInputSubmit" on-cancel="_onVideoEmbedInputCancel" disabled$="[[disabled]]"></moe-form-video-embed-input>
    <moe-form-video-embeds embeds="{{videoEmbeds}}" id="videoEmbeds" disabled$="[[disabled]]"></moe-form-video-embeds>
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
                notify: true
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
                notify: true
            },
            embedRequestServer: {
                type: String
            },

            /** Poll Embed */
            poll: {
                type: Object
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
        this.$.comment.value = "";
        this.$.file.cancel();
        this.videoEmbeds = [];
        this.$.videoEmbedInput.cancel();
    }

    changed() {
        return (this.videoEmbeds && this.videoEmbeds.length) || (this.file) || (this.comment && this.comment.length > 0);
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
                videoEmbeds: this.videoEmbeds
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

    _onVideoEmbedButtonClick(e) {
        if (this.$.videoEmbedInput.hasAttribute('hidden')) {
            this.$.videoEmbedInput.removeAttribute('hidden');
            this.$.videoEmbedInput.focus();
        } else {
            this.$.videoEmbedInput.setAttribute('hidden', "true");
            this.$.videoEmbedInput.reset();
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
        this.$.videoEmbedInput.setAttribute('hidden', "true");
    }

    _computeVideoEmbedButtonDisabled(videoEmbedInputDisplay) {
        return videoEmbedInputDisplay;
    }
}

window.customElements.define('moe-form', MoeForm);