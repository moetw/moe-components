import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-tooltip/paper-tooltip';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-icons/communication-icons';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-list/iron-list'
import moment from './moment';
import DOMPurify from 'dompurify';
import 'resize-observer/dist/resize-observer';

import './moe-styles.js';
import './moe-rate.js';
import './moe-poll.js';
import './moe-post-image.js';
import './moe-video.js';
import './moe-icons.js';

/**
 * `moe-thread`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MoeThread extends PolymerElement {
    static get template() {
        return html`
<style>
    :host {
        display: block;
    }
    
    #thread-card {
        @apply --shadow-elevation-8dp;
        @apply --shadow-transition;
        width: 100%;
    }
    #thread-card:hover, #thread-card:focus, #thread-card:active {
        @apply --shadow-elevation-16dp;
        @apply --shadow-transition;
    }
    
    .cover {
        background-color: var(--moe-thread-cover-background-color);
    }
    .header {
        @apply --layout-horizontal;
        margin: 0;
    }
    .header-no {
        @apply --layout-flex;
        position: relative;
        color: var(--moe-thread-no-text-color);
        background-color: var(--moe-thread-no-background-color);
    }
    .header-no:hover {
        cursor: pointer;
        background-color: var(--moe-thread-no-hover-background-color);
    }
    .header-reply-count {
        @apply --layout-flex;
        position: relative;
        color: var(--moe-thread-reply-count-text-color);
        background-color: var(--moe-thread-reply-count-background-color);    
    }
    .header-reply-count:hover {
        cursor: pointer;
        background-color: var(--moe-thread-reply-count-hover-background-color);
    }
    .header-item {
        @apply --layout-horizontal;
        @apply --layout-center-justified;    
        padding: 16px;
    }
    .header-item iron-icon {
        --iron-icon-height: 1.5em;
        --iron-icon-width: 1.5em;
        padding: 0 0.5em;
    }
    
    .post-action-button {
        float: right;
        color: var(--moe-post-action-menu-button-color);
        margin: -1em;
    }
    
    .body {
        color: var(--moe-post-body-text-color);
    }
    .post-subject { 
        @apply --paper-font-title;
    }
    .post-body { 
        @apply --paper-font-body1;
        max-height: 30em;
        overflow: hidden;
    }
    .post-body.expanded {
        max-height: none;
    }
    
    .firstpost {
        display: block;
        background-color: var(--moe-thread-firstpost-background-color);
        padding: 1em;
    }
    .firstpost-poll-container {
        @apply --layout-horizontal;
    }
    .firstpost-poll-container moe-poll {
        @apply --layout-flex-auto;
    }
    .firstpost .post-body {
        margin-top: 1em; 
    }
    .replies {
        margin: 0;
        padding: 0;
        display: block;
    }
    .reply {
        @apply --layout-vertical;
        @apply --layout-start-aligned;
        @apply --layout-self-stretch;
        justify-content: space-between;
        height: auto;
        min-height: 5em;
    }
    .reply .post-body {
        @apply --layout-self-stretch;
        padding: 1em 1em 0 1em;
    }
    .replies .reply:nth-child(even) {
        background-color: var(--moe-thread-reply-even-background-color);        
    }
    .replies .reply:nth-child(odd) {
        background-color: var(--moe-thread-reply-odd-background-color);        
    }
    .reply moe-post-header {
        padding: 0 1em 1em 1em;
    }
    
    moe-post-image {
        position: relative;
    }
    .thumb {
        float: left;
        max-width: 250px;
        max-height: 250px;
        margin-right: 0.5em;
        margin-bottom: 0.5em;
    }
    
    .more-replies {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
        @apply --layout-self-center;
        background-color: var(--moe-thread-more-replies-button-background-color);
        margin: 0;
        padding: 1em;
        position: sticky;
        top: 0px;
        z-index: 100;
    }
    .more-replies .more-replies-text {
        color: var(--moe-thread-more-replies-button-text-color);
    }
    .more-replies:hover {
        cursor: pointer;
        background-color: var(--moe-thread-more-replies-button-hover-background-color);
    }
    .more-replies iron-icon {
        --iron-icon-height: 1.5em;
        --iron-icon-width: 1.5em;
        padding: 0 0.2em;
    }
    
    paper-tooltip {
        --paper-tooltip-delay-out: 0s;
        --paper-tooltip-delay-in: 0s;
        --paper-tooltip-duration-out: 0s;
        --paper-tooltip-duration-in: 0s;
    }
    
    #showMore {
        display: block;
        text-align: center;
        margin: auto;
    }
    #showMore:hover {
        cursor: pointer;
    }
</style>

<paper-card id="thread-card">
    <!-- thread cover -->
    <div class="cover">
        <template is="dom-if" if="[[showFirstPostEmebeds]]">
            <moe-embeds embeds="[[firstpost.embeds]]"></moe-embeds>
        </template>
        <template is="dom-if" if="[[showFirstPostPoll]]">
            <div class="firstpost-poll-container">
                <moe-poll board-id="[[firstpost.board_id]]" no="[[firstpost.no]]" subject="[[firstpost.poll.subject]]" items="[[firstpost.poll.items]]" voted="[[firstpost.poll.voted]]"></moe-poll>
            </div>
        </template>
    </div>

    <!-- thread header -->
    <div class="header">
        <div class="header-no" on-click="_onThreadHeaderNoClick">
            <div class="header-item">No. [[no]]</div>
            <paper-ripple></paper-ripple>
        </div>
        <div class="header-reply-count" on-click="_onThreadHeaderReplyCountClick">
            <div class="header-item"><iron-icon icon="communication:comment"></iron-icon>[[replyCount]] 篇回應</div>
            <paper-ripple></paper-ripple>        
        </div>
    </div>
       
    <div class="body">
        <!-- firstpost -->
        <div class="firstpost">
            <moe-post-action-menu-button class="post-action-button" board-id="[[firstpost.board_id]]" no="[[firstpost.no]]" is-first-post="true" is-admin="[[isAdmin]]"></moe-post-action-menu-button>
            <div class="post-subject">
                <template is="dom-if" if="[[flagAdminSticky]]">
                    <iron-icon id="icon-thread-pin" icon="moe:thread-pin"></iron-icon>
                    <paper-tooltip for="icon-thread-pin">本討論串已置頂</paper-tooltip>
                </template>
                <template is="dom-if" if="[[flagAdminSage]]">
                    <iron-icon id="icon-thread-sage" icon="moe:thread-sage"></iron-icon>
                    <paper-tooltip for="icon-thread-sage">本討論串已強制下沉</paper-tooltip>                
                </template>
                <template is="dom-if" if="[[flagAdminThreadStop]]">
                    <iron-icon id="icon-thread-stop" icon="moe:thread-stop"></iron-icon>
                    <paper-tooltip for="icon-thread-stop">本討論串已禁止回應</paper-tooltip>
                </template>
                [[firstpost.sub]]
            </div>
            <div id="firstpostPostBody" class="post-body">
                <template is="dom-repeat" items="[[firstpost.images]]" as="image">
                    <a target="_blank" href="[[image.image_src]]">
                        <moe-post-image 
                            image-src="[[image.image_src]]" image-width="[[image.image_width]]" image-height="[[image.image_height]]"
                            thumb-src="[[image.thumb_src]]" thumb-width="[[image.thumb_width]]" thumb-height="[[image.thumb_height]]" 
                            class="thumb" />
                    </a>
                </template>
                <moe-post-comment comment="[[firstpost.com]]" />
            </div>
            <template is="dom-if" if="[[displayShowMore]]">
                <a id="showMore" on-click="_onShowMoreClick"><iron-icon icon="expand-more"></iron-icon>顯示更多</a>                            
            </template>
            <div style="clear: both"></div>
            <moe-post-header post="[[firstpost]]"></moe-post-header>
        </div>
        
        <template is="dom-if" if="[[showMoreReplies]]">
            <div class="more-replies" on-click="_onMoreRepliesClick">
                <div class="more-replies-text"><iron-icon icon="expand-more"></iron-icon>展開 [[omittedReplyCount]] 篇被省略的回應</div>            
                <paper-ripple></paper-ripple>
            </div>
        </template>
        
        <!-- replies -->
        <div class="replies">
            <template is="dom-repeat" items="[[replies]]" as="reply" index-as="reply_i">
                <div class="reply">
                    <moe-embeds embeds="[[reply.embeds]]"></moe-embeds>
                    <div class="post-body">
                        <moe-post-action-menu-button class="post-action-button" board-id="[[firstpost.board_id]]" no="[[reply.no]]"></moe-post-action-menu-button>
                        
                        <template is="dom-repeat" items="[[reply.images]]" as="image">
                            <a target="_blank" href="[[image.image_src]]">
                                <moe-post-image 
                                    image-src="[[image.image_src]]" image-width="[[image.image_width]]" image-height="[[image.image_height]]"
                                    thumb-src="[[image.thumb_src]]" thumb-width="[[image.thumb_width]]" thumb-height="[[image.thumb_height]]" 
                                    class="thumb" />
                            </a>
                        </template>
                        <!-- TODO: show reply embeds -->
                        <moe-post-comment comment="[[reply.com]]" />
                    </div>
                    <moe-post-header post="[[reply]]"></moe-post-header>
                </div>                
            </template>
        </div>
    </div>
</paper-card>
    `;
    }

    static get properties() {
        return {
            isAdmin: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            no: {
                type: Number
            },
            replyCount: {
                type: Number
            },
            omittedReplyCount: {
                type: Number,
                computed: '_computeOmittedReplyCount(replyCount, replies)',
                reflectToAttribute: true
            },
            showMoreReplies: {
                type: Boolean,
                computed: '_computeShowMoreReplies(omittedReplyCount)',
                reflectToAttribute: true
            },
            flagAdminSticky: {
                type: Boolean
            },
            flagAdminThreadStop: {
                type: Boolean
            },
            flagAdminSage: {
                type: Boolean
            },
            firstpost: {
                type: Object,
                reflectToAttribute: true
            },
            replies: {
                type: Array
            },
            showFirstPostPoll: {
                type: Boolean,
                computed: '_computeShowFirstPostPoll(firstpost)'
            },
            showFirstPostEmebeds: {
                type: Boolean,
                computed: '_computeShowFirstPostEmbeds(firstpost)'
            }
        };
    }

    ready() {
        super.ready();
        const observer = new ResizeObserver(() => {
            this.set('displayShowMore', this.$.firstpostPostBody.scrollHeight > this.$.firstpostPostBody.clientHeight);
        });
        observer.observe(this.$.firstpostPostBody);
    }

    _onShowMoreClick() {
        this.$.firstpostPostBody.classList.add('expanded');
    }

    _computeShowFirstPostEmbeds(firstpost) {
        return firstpost.embeds && firstpost.embeds.length > 0;
    }

    _computeShowFirstPostPoll(firstpost) {
        return firstpost.poll && firstpost.poll.items && firstpost.poll.items.length > 0;
    }

    _computeOmittedReplyCount(replyCount, replies) {
        return replyCount - replies.length;
    }

    _computeShowMoreReplies(omittedReplyCount) {
        return omittedReplyCount > 0;
    }

    _onThreadHeaderNoClick() {
        this.dispatchEvent(new CustomEvent('threadHeaderNoClick', {
            composed: true,
            bubbles: true,
            detail: {
                no: this.get('no')
            }
        }));
    }

    _onThreadHeaderReplyCountClick() {
        this.dispatchEvent(new CustomEvent('threadHeaderReplyCountClick', {
            composed: true,
            bubbles: true,
            detail: {
                no: this.get('no')
            }
        }));
    }

    _onMoreRepliesClick() {
        this.dispatchEvent(new CustomEvent('threadMoreRepliesClick', {
            composed: true,
            bubbles: true,
            detail: {
                no: this.get('no')
            }
        }));
    }
}

class MoePostHeader extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
}
.post-header { 
    @apply --layout-horizontal;
    @apply --layout-end-justified;
    margin-top: 1em;
}
.post-header-no {
    @apply --layout-flex-auto;
    color: var(--moe-post-header-no-text-color);
}
.post-header-no-chip {
    position: relative;
    display: inline-block;
    padding-left: 0.5em;
    padding-right: 0.5em;
    border-radius: 1em;
    background-color: var(--moe-post-header-no-background-color);
}
.post-header-no-chip:hover {
    cursor: pointer;
    background-color: var(--moe-post-header-no-hover-background-color);
}
.post-header-id, .post-header-date {
    flex: 0 1 auto;
    flex-basis: auto;
    text-align: right;
    padding-left: 1em;
}
.post-header-no {
}
.post-header-id {
    color: var(--moe-post-header-id-text-color);
}
.post-header-date {
    color: var(--moe-post-header-date-text-color);    
}
</style>
<div class="post-header">
    <div class="post-header-no" on-click="_onPostHeaderNoClick">
        <template is="dom-if" if="{{!hideNo}}">
            <div class="post-header-no-chip">No.[[post.no]]<paper-ripple></paper-ripple></div>
        </template>
    </div>
    <div class="post-header-id">ID:[[post.trip_id]]</div>
    <div class="post-header-date">[[formatCreatedAt(post.created_at)]]</div>
</div>
`;
    }

    static get properties() {
        return {
            hideNo: {
                type: Boolean,
                value: false
            },
            post: {
                type: Object
            }
        };
    }

    formatCreatedAt(created_at) {
        return moment(created_at).fromNow();
    }

    _onPostHeaderNoClick(e) {
        if (this.hideNo) {
            return;
        }

        this.dispatchEvent(new CustomEvent('postHeaderNoClick', {
            composed: true,
            bubbles: true,
            detail: {
                no: this.get('post.no')
            }
        }));
    }
}

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
                type: String,
                observer: '_refreshHtml'
            }
        };
    }

    _refreshHtml(newValue) {
        let processed = DOMPurify.sanitize(newValue);

        // highlight quotes
        processed = this._highlightQuotes(processed);

        // link quotes
        processed = this._linkQuotes(processed);

        // mod_pushpost
        processed = this._modPushpost(processed);

        this.$.content.innerHTML = processed;
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
        const regex = /\[MOD_PUSHPOST_USE\]<br>([\w\W]+$)/gm;
        const matches = regex.exec(text);
        if (matches) {
            this.$.pushpost.innerHTML = matches[1];
            this.$.pushpost.style.display = 'block';
        }
        return text.replace(regex, '');
    }
}

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
    overflow: hidden;
}
#content.expanded {
    max-height: none;
}
::slotted(._h) {
    color: var(--moe-post-header-id-text-color);
}
#showMore {
    display: block;
    text-align: center;
    margin: auto;
}
#showMore:hover {
    cursor: pointer;
}
</style>
<div id="pushpost">
    <div id="content"><slot></slot></div>
    <template is="dom-if" if="[[displayShowMore]]">
        <a id="showMore" on-click="_onShowMoreClick"><iron-icon icon="expand-more"></iron-icon>顯示更多</a>
    </template>
</div>
`;
    }

    static get properties() {
        return {
            displayShowMore: {
                type: Boolean,
                value: false
            }
        };
    }

    ready() {
        super.ready();
        const ob = new ResizeObserver(() => {
            this.set('displayShowMore', this.$.content.scrollHeight > this.$.content.clientHeight);
        });
        ob.observe(this.$.content);
    }

    _onShowMoreClick() {
        this.$.content.classList.toggle('expanded');
    }
}

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

class MoePostActionMenuButton extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
}
paper-listbox {
    min-width: 5em;
    z-index: 100;
}
</style>
<paper-menu-button class="post-action-button" horizontal-align="right" >
    <paper-icon-button icon="more-vert" slot="dropdown-trigger" alt="more-vert" ></paper-icon-button>
    <paper-listbox slot="dropdown-content">
        <template is="dom-repeat" items="{{items}}">
            <moe-post-action-menu-item board-id="[[boardId]]" no="[[no]]" action="[[item.action]]" text="[[item.text]]"></moe-post-action-menu-item>
        </template>
    </paper-listbox>
</paper-menu-button>
`;
    }

    static get properties() {
        return {
            items: {
                type: Array,
                computed: '_computeItems(isAdmin, isFirstPost)'
            },
            isAdmin: {
                type: Boolean,
                value: false
            },
            isFirstPost: {
                type: Boolean,
                value: false
            },
            boardId: {
                type: Number,
            },
            no: {
                type: Number,
            },
        };
    }

    _computeItems(isAdmin, isFirstPost) {
        const items = [
            {text: '回應', action: 'reply', icon: 'reply'},
            {text: '舉報', action: 'report', icon: 'report'},
            {text: '刪除', action: 'delete', icon: 'delete'},
        ];

        if (isAdmin && isFirstPost) {
            items.push({text: '禁止回應', action: 'stopThread', icon: 'moe:thread-stop'});
            items.push({text: '強制sage', action: 'forceSage', icon: 'moe:thread-sage'});
            items.push({text: '置頂', action: 'pinThread', icon: 'moe:thread-pin'});
        }

        return items;
    }

    _onItemClick(e) {
        console.log(e.currentTarget);
    }
}

class MoePostActionMenuItem extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
}
paper-item:hover {
    cursor: pointer;
    background-color: var(--paper-grey-300);
}
</style>
<paper-item on-click="_onClick">[[text]]</paper-item>
`;
    }

    static get properties() {
        return {
            boardId: {
                type: Number
            },
            no: {
                type: Number
            },
            action: {
                type: String
            },
            text: {
                type: String
            }
        };
    }

    _onClick(e) {
        this.dispatchEvent(new CustomEvent('postActionMenuItemClick', {
            composed: true,
            bubbles: true,
            detail: {
                board_id: this.boardId,
                no: this.no,
                action: this.action
            }
        }));
    }
}

class MoeEmbeds extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
    width: 100%;
    min-height: 360px;
    max-height: 360px;
}
:host([mobile]) {
    min-height: 200px;
    max-height: 400px;
}
moe-video {
    --moe-video-width: 100%;
    --moe-video-height: 360px;
    --moe-video-mobile-height: 200px;
    --moe-video-mobile-with-list-height: 400px;
}
</style>
<moe-video id="video"></moe-video>
`;
    }

    static get properties() {
        return {
            embeds: {
                type: Array,
                observer: '_onEmbedsChange'
            },
            mobile: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    ready() {
        super.ready();
        this._mediaQuery();
        window.addEventListener('resize', () => this._mediaQuery());
    }

    _mediaQuery() {
        this.set('mobile', window.matchMedia('(max-width: 600px)').matches);
    }

    _onEmbedsChange(newValue) {
        const embeds = newValue || [];
        if (embeds.length) {
            this.style.display = 'block';
            this.$.video.data = embeds.map(embed => JSON.parse(embed.data));
        } else {
            this.style.display = 'none';
        }
    }
}

window.customElements.define('moe-thread', MoeThread);
window.customElements.define('moe-post-comment', MoePostComment);
window.customElements.define('moe-post-header', MoePostHeader);
window.customElements.define('moe-post-action-menu-button', MoePostActionMenuButton);
window.customElements.define('moe-post-action-menu-item', MoePostActionMenuItem);
window.customElements.define('moe-pixmicat-pushpost', MoePixmicatPushpost);
window.customElements.define('moe-quote-link', MoeQuoteLink);
window.customElements.define('moe-embeds', MoeEmbeds);