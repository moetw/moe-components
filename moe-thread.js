import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {MutableData} from '@polymer/polymer/lib/mixins/mutable-data';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-tooltip/paper-tooltip';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-icons/communication-icons';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-list/iron-list'

import './moe-icons';
import './moe-pixmicat-pushpost';
import './moe-poll';
import './moe-poll-request';
import './moe-post-comment';
import './moe-post-header';
import './moe-post-image';
import './moe-post-menu';
import './moe-quote-link';
import './moe-rate';
import './moe-reply';
import './moe-styles';
import './moe-video';
import './moe-graphql';
import {MoeGraphQL} from "./moe-graphql";
import {ReduxMixin} from './redux/redux-mixin';
import * as selectors from './redux/redux-selectors';
import * as actions from "./redux/redux-actions";
import get from "lodash/get";

/**
 * `moe-thread`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MoeThread extends MutableData(ReduxMixin(PolymerElement)) {
    static get template() {
        return html`
<style>
    :host {
        display: block;
    }
    
    #thread-card {
        @apply --shadow-elevation-6dp;
        @apply --shadow-transition;
        width: 100%;
    }
    
    /** TODO: focus on reply */
    :host([focus]) {
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
    
    moe-post-menu-action-button {
        float: right;
        color: var(--moe-post-menu-action-button-color);
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
        max-height: 50vh;
        overflow: hidden;
        transition: max-height 0.5s;
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
    
    @media only screen and (max-width: 600px) {
        .firstpost .thumb {
            display: block;
            float: none;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .more-replies {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
        @apply --layout-self-center;
        background-color: var(--moe-thread-more-replies-button-background-color);
        margin: 0;
        position: sticky;
        top: 0px;
        z-index: 1;
        height: 3em;
    }
    .more-replies .more-replies-text {
        @apply --layout-self-center;
        color: var(--moe-thread-more-replies-button-text-color);
    }
    .more-replies:hover {
        cursor: pointer;
        background-color: var(--moe-thread-more-replies-button-hover-background-color);
    }
    .more-replies-loading:hover {
        cursor: none;
        background-color: var(--moe-thread-more-replies-button-background-color);
    }
    .more-replies iron-icon {
        --iron-icon-height: 1.5em;
        --iron-icon-width: 1.5em;
        padding: 0 0.2em;
    }
    .more-replies paper-spinner-lite {
        @apply --layout-self-center;
        --paper-spinner-color: var(--moe-thread-more-replies-button-text-color);
        position: absolute;
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
    .show-more-radient-effect {
        position: relative;
    }
    .show-more-radient-effect-background {
        position: absolute;
        bottom: 0;
        height: 50px;
        width: 100%;
        background-image: linear-gradient(to bottom, rgba(255, 253, 229, 0), rgba(255, 253, 229, 1));
    }
    
    .replies moe-reply:nth-child(even) {
        background-color: var(--moe-thread-reply-even-background-color);        
    }
    .replies moe-reply:nth-child(odd) {
        background-color: var(--moe-thread-reply-odd-background-color);        
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
                <moe-poll board-id="[[firstpost.boardId]]" no="[[firstpost.no]]" subject="[[firstpost.poll.subject]]" items="[[firstpost.poll.items]]" voted="[[firstpost.poll.voted]]" on-item-click="_onMoePollItemClick"></moe-poll>
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
            <moe-post-menu-action-button board-id="[[firstpost.boardId]]" thread-no="[[firstpost.no]]" no="[[firstpost.no]]" is-first-post="true" is-admin="[[isAdmin]]" flag-admin-thread-stop="[[flagAdminThreadStop]]"></moe-post-menu-action-button>
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
                    <a target="_blank" href="[[image.imageSrc]]">
                        <moe-post-image 
                            image-src="[[image.imageSrc]]" image-width="[[image.imageWidth]]" image-height="[[image.imageHeight]]"
                            thumb-src="[[image.thumbSrc]]" thumb-width="[[image.thumbWidth]]" thumb-height="[[image.thumbHeight]]" 
                            class="thumb" />
                    </a>
                </template>
                <moe-post-comment comment="[[firstpost.com]]" on-processed="_onMoePostCommentProcessed" />
            </div>
            
            <!-- show more contents --> 
            <template is="dom-if" if="[[displayShowMore]]">
                <div class="show-more-radient-effect">
                    <div class="show-more-radient-effect-background">&nbsp;</div>
                </div>
                <paper-button id="showMore" on-click="_onShowMoreClick"><iron-icon icon="expand-more"></iron-icon>顯示更多</paper-button>                            
            </template>
            
            <div style="clear: both"></div>
            <moe-post-header board-id="[[firstpost.boardId]]" no="[[firstpost.no]]" trip-id="[[firstpost.tripId]]" created-at="[[firstpost.createdAt]]" flag-admin-thread-stop="[[flagAdminThreadStop]]"></moe-post-header>
        </div>
        
        <!-- show more replies -->
        <template is="dom-if" if="[[showMoreReplies]]">
            <template is="dom-if" if="[[loadingMoreReplies]]">
                <div class="more-replies more-replies-loading">
                    <paper-spinner-lite active></paper-spinner-lite>
                </div>                                    
            </template>
            
            <template is="dom-if" if="[[notLoadingMoreReplies]]">
                <div class="more-replies" on-click="_onMoreRepliesClick">
                    <div class="more-replies-text">
                        <iron-icon icon="expand-more"></iron-icon>展開 [[omittedReplyCount]] 篇被省略的回應
                    </div>            
                </div>
            </template>
        </template>
        
        <!-- replies -->
        <div class="replies">
            <template id="repliesDomRepeat" is="dom-repeat" mutable-data items="[[replies]]" as="reply" index-as="reply_i" initial-count="[[initialReplyCount]]" sort="_sortReplies">
                <moe-reply board-id="[[reply.boardId]]" thread-no="[[no]]" no="[[reply.no]]" embeds="[[reply.embeds]]"
                           images="[[reply.images]]" com="[[reply.com]]" trip-id="[[reply.tripId]]"
                           created-at="[[reply.createdAt]]" flag-admin-thread-stop="[[flagAdminThreadStop]]">
                </moe-reply>
            </template>
        </div>
    </div>
</paper-card>
<moe-graphql id="moeGraphQL" server="[[graphqlServer]]"></moe-graphql>
<moe-poll-request id="moePollRequest" server="[[pollServer]]"></moe-poll-request>`;
    }

    static get properties() {
        return {
            isAdmin: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            boardId: Number,
            boardAlias: String,
            boardSubdomain: String,
            no: Number,
            replyCount: Number,
            initialReplyCount: Number,
            omittedReplyCount: {
                type: Number,
                computed: '_computeOmittedReplyCount(replyCount, replies.length)',
                reflectToAttribute: true
            },
            showMoreReplies: {
                type: Boolean,
                computed: '_computeShowMoreReplies(omittedReplyCount)',
                reflectToAttribute: true
            },
            loadingMoreReplies: {
                type: Boolean,
                value: false
            },
            notLoadingMoreReplies: {
                type: Boolean,
                computed: '_computeNotLoadingMoreReplies(loadingMoreReplies)'
            },
            flagAdminSticky: {
                type: Boolean,
                value: false
            },
            flagAdminThreadStop: {
                type: Boolean,
                value: false
            },
            flagAdminSage: {
                type: Boolean,
                value: false
            },
            firstpost: {
                type: Object,
                reflectToAttribute: true
            },
            replies: {
                type: Array,
                statePath: function (state) {
                    console.log(state, this.boardId, this.no);
                    return get(state.threadMap, `${this.boardId}:${this.no}.replies`, [])
                        .map(replyKey => state.replyMap[replyKey]);
                }
            },
            showFirstPostPoll: {
                type: Boolean,
                computed: '_computeShowFirstPostPoll(firstpost)'
            },
            showFirstPostEmebeds: {
                type: Boolean,
                computed: '_computeShowFirstPostEmbeds(firstpost)'
            },
            graphqlServer: String,
            pollServer: String,
            imageServers: Object
        };
    }

    _onMoePostCommentProcessed() {
        this.set('displayShowMore', this.$.firstpostPostBody.scrollHeight > this.$.firstpostPostBody.clientHeight);
    }

    _onShowMoreClick() {
        this.$.firstpostPostBody.style.maxHeight = this.$.firstpostPostBody.scrollHeight + 'px';
        this.set('displayShowMore', false);
    }

    _computeShowFirstPostEmbeds(firstpost) {
        return firstpost.embeds && firstpost.embeds.length > 0;
    }

    _computeShowFirstPostPoll(firstpost) {
        return firstpost.poll && firstpost.poll.items && firstpost.poll.items.length > 0;
    }

    _computeOmittedReplyCount(replyCount, repliesLength) {
        return replyCount - repliesLength;
    }

    _computeShowMoreReplies(omittedReplyCount) {
        return omittedReplyCount > 0;
    }

    _computeNotLoadingMoreReplies(loadingMoreReplies) {
        return !loadingMoreReplies;
    }

    _onThreadHeaderNoClick() {
        if (this.flagAdminThreadStop) {
            return false;
        }

        this.dispatchEvent(new CustomEvent('thread-header-no-click', {
            composed: true,
            bubbles: true,
            detail: {
                boardId: this.get('boardId'),
                threadNo: this.get('no'),
                no: this.get('no')
            }
        }));
    }

    _onThreadHeaderReplyCountClick() {
    }

    _onMoreRepliesClick() {
        if (this.loadingMoreReplies) return;

        this.set('loadingMoreReplies', true);

        this.$.moeGraphQL
            .getMoreReplies(this.boardId, this.no, this.replies[0] ? this.replies[0].no : 0, 100)
            .then(resp => {
                this.dispatch({
                    type: actions.PREPEND_REPLIES_TO_THREAD,
                    replies: resp.data.getMoreReplies.map(p => this._postTransformer(p))
                });

                this.notifyPath('replies.length');
            })
            .finally(() => this.set('loadingMoreReplies', false));
    }

    _onReplyAck(e) {
        if (e.detail.threadNo === this.no) {
            this.$.moeGraphQL
                .getReplyAck(e.detail.boardId, e.detail.threadNo, e.detail.no)
                .then(resp => {
                    this.set('replyCount', resp.data.getThreadByNo.replyCount);
                    if (resp.data.getPostByNo) {
                        this.push('replies', this._postTransformer(resp.data.getPostByNo));
                    }
                });
        }
    }

    _postTransformer(post) {
        return MoeGraphQL.postTransformer(this.boardSubdomain, this.boardAlias, this.imageServers, post);
    }

    _sortReplies(a, b) {
        if (a.no < b.no) {
            return -1;
        } else if (a.no > b.no) {
            return 1;
        } else {
            return 0;
        }
    }

    _onMoePollItemClick(e) {
         this.$.moePollRequest.vote(e.detail.no, e.detail.item)
             .then(items => {
                 this.shadowRoot.querySelector('moe-poll').setProperties({
                     items,
                     voted: true
                 });
             })
             .catch(err => {
                 console.error(err);
                 alert(err.message);
             });
    }
}

window.customElements.define('moe-thread', MoeThread);