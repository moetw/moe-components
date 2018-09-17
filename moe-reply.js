import {html, PolymerElement} from "@polymer/polymer/polymer-element";

import '@polymer/paper-button';
import './moe-embeds';
import './moe-post-menu';
import './moe-post-image';
import './moe-post-comment';
import './moe-post-header';

class MoeReply extends PolymerElement {

    static get template() {
        return html`
<style>
:host {
    @apply --layout-vertical;
    @apply --layout-start-aligned;
    @apply --layout-self-stretch;
    justify-content: space-between;
    height: auto;
}

.post-body {
    @apply --layout-self-stretch; 
    @apply --paper-font-body1;
    padding: 1em 1em 0 1em;
}

#comment { 
    min-height: 5em;
    max-height: 50vh;
    overflow: hidden;
    transition: max-height 0.5s;
}

moe-post-header {
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

moe-post-menu-action-button {
    float: right;
    color: var(--moe-post-menu-action-button-color);
    margin: -1em;
}

</style>

<moe-embeds embeds="[[embeds]]"></moe-embeds>
<div class="post-body" id="postBody">
    <!-- TODO: Optimize performance of moe-post-menu-action-button -->
    <moe-post-menu-action-button board-id="[[boardId]]" no="[[no]]"></moe-post-menu-action-button> 
    
    <template is="dom-repeat" items="[[images]]" as="image">
        <a target="_blank" href="[[image.imageSrc]]">
            <moe-post-image 
                image-src="[[image.imageSrc]]" image-width="[[image.imageWidth]]" image-height="[[image.imageHeight]]"
                thumb-src="[[image.thumbSrc]]" thumb-width="[[image.thumbWidth]]" thumb-height="[[image.thumbHeight]]" 
                class="thumb" />
        </a>
    </template>
    
    <moe-post-comment id="comment" comment="[[com]]" on-processed="_onMoePostCommentProcessed" />
</div>

<!-- show more contents --> 
<template is="dom-if" if="[[displayShowMore]]">
    <paper-button id="showMore" on-click="_onShowMoreClick"><iron-icon icon="expand-more"></iron-icon>顯示更多</paper-button>                            
</template>

<moe-post-header board-id="[[boardId]]" no="[[no]]" trip-id="[[tripId]]" created-at="[[createdAt]]"></moe-post-header>
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
            embeds: {
                type: Array
            },
            images: {
                type: Array
            },
            com: {
                type: String
            },
            tripId: {
                type: String
            },
            createdAt: {
                type: String
            },
            displayShowMore: {
                type: Boolean,
                value: false
            }
        };
    }

    _onMoePostCommentProcessed() {
        this.set('displayShowMore', this.$.comment.scrollHeight > this.$.comment.clientHeight);
    }

    _onShowMoreClick() {
        this.$.comment.style.maxHeight = this.$.comment.scrollHeight + 'px';
        this.set('displayShowMore', false);
    }
}

window.customElements.define('moe-reply', MoeReply);