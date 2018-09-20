import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-button';
import '@polymer/paper-icon-button';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/image-icons';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-icon'
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable';

import './color';
import './moe-file-button';
import './moe-form-video-embeds';
import './moe-form-video-embed-input';
import './moe-form-embed-request';

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
form {
    @apply --layout-vertical;
    margin: 0;
    padding: 0;
}

paper-dialog-scrollable {
    --paper-dialog-scrollable: {
        padding: 0;
        overflow-x: hidden;
        max-height: 500px;
    }
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
#buttonSubmit {
    padding-left: 3em;
    padding-right: 3em;
    font-weight: 800;
}

#videoEmbeds {
    margin-top: 1em;
}
</style>
<form>
    <h2>回應</h2>
    <paper-textarea label="內文" char-counter maxlength="[[commentMaxLength]]" value="{{comment}}" rows="3" max-rows="3"></paper-textarea>
    <div id="embedButtons">
        <moe-file-button id="file" file="{{file}}" file-selected="{{fileSelected}}" file-max-size="[[fileMaxSize]]" on-change="_onFileChange"></moe-file-button>            
        <paper-button on-click="_onVideoEmbedButtonClick"><iron-icon icon="av:movie"></iron-icon>附加影片</paper-button>
    </div>
    <div id="imageUploads">
        <template is="dom-if" if="[[fileSelected]]">
            <paper-icon-button icon="cancel" on-click="_onCancelImageUploadsClick"></paper-icon-button>
        </template>
        <span id="imageUploadsMessage"></span>
    </div>
    <moe-form-video-embed-input id="videoEmbedInput" hidden on-submit="_onVideoEmbedInputSubmit" on-cancel="_onVideoEmbedInputCancel"></moe-form-video-embed-input>
    <moe-form-video-embeds embeds="{{videoEmbeds}}" id="videoEmbeds"></moe-form-video-embeds>
    <div id="actions">
        <paper-button raised id="buttonSubmit">送出</paper-button>
    </div>
</form>

<moe-form-embed-request id="embedRequest" server="[[embedRequestServer]]"></moe-form-embed-request>
`;
    }

    static get properties() {
        return {
            boardId: {
                type: Number,
            },
            replyTo: {
                type: Number,
                observer: '_observeReplyTo'
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
                type: Object
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
            }
        };
    }

    _observeReplyTo(newValue) {
        if (newValue) {
            this.set('comment', `>>No.${newValue}`);
        }
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

window.customElements.define('moe-reply-form', MoeReplyForm);