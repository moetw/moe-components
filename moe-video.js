import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-ripple/paper-ripple';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-selector/iron-selector';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-image/iron-image';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/av-icons';
import '@polymer/google-youtube/google-youtube';
import 'lodash/lodash';

class MoeVideo extends PolymerElement {

    static get template() {
        return html`
<style>
    :host {
        font-family: Helvetica, Arial, 'LiHei Pro', 'Meiryo','微軟正黑體', '新細明體', sans-serif;
        display: inline-block;
        box-sizing: border-box;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-touch-callout: none;
    }
    
    .flex {
        @apply --layout-flex;
    }
    .block {
        @apply --layout-block;
    }
    .invisible {
        @apply --layout-invisible;
    }
    .relative {
        @apply --layout-relative;
    }
    .fit {
        @apply --layout-fit;
    }
    .vertical {
        @apply --layout-vertical;
    }
    .horizontal {
        @apply --layout-horizontal;
    }
    .center {
        @apply --layout-center; 
    }
    .scroll {
        @apply --layout-scroll;
    }

    #container {
        margin: 0;
        width: 640px;
        height: 360px;
        @apply(--layout-horizontal);
    }
    :host[list-toggle] #container{
        width: 730px;
        height: 360px;
    }
    #video {
        background-color: black;
    }
    #video google-youtube {
        --google-youtube-container: {
            height: 100%;
            width: 100%;
        }
    }
    #videoLink {
        position: absolute;
        font-size: 18px;
        color: rgb(200, 200, 200);
        left: 0;
        top: 0;
        right: 0;
        padding: 10px 10px 0 10px;
        line-height: 1.5;
        text-decoration: none;
    }

    #videoLink:hover {
        text-decoration: underline;
    }

    #placeholder {
        position: absolute;
        cursor: pointer;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 1);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center center;
        overflow: hidden;
    }
    #placeholder::before {
        content: '';
        display: block;
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;

        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+100&0.29+0,0+31,0+31 */
        background: -moz-linear-gradient(top,  rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 31%, rgba(0,0,0,0) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(top,  rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 31%,rgba(0,0,0,0) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to bottom,  rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 31%,rgba(0,0,0,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    }
    #placeholder:hover #playIcon {
        width: 7em;
        height: 7em;
        transition: 0.1s ease-out;
    }
    #playIcon {
        position: absolute;
        color: rgba(255, 255, 255, 1);
        width: 6em;
        height: 6em;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: 0.5s ease-out;
        transition-property: height, width;
    }
    #playIcon[icon*="refresh"] {
        width: 2em;
        height: 2em;
        -webkit-animation: loadRotate 1.5294s 20 linear;
        -moz-animation: loadRotate 1.5294s 20 linear;
        animation: loadRotate 1.5294s 20 linear;
        margin-left: -1em;
        margin-top: -1em;
    }

    @-webkit-keyframes loadRotate {
        from { -webkit-transform: rotate(0deg); }
        to { -webkit-transform: rotate(360deg); }
    }
    @-moz-keyframes loadRotate {
        from { -moz-transform: rotate(0deg); }
        to { -moz-transform: rotate(360deg); }
    }
    @keyframes loadRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    #list {
        width: 250px;
        min-height: 250px;
        background: rgba(50, 50, 50, 1);
        color: rgb(200, 200, 200);
    }

    #listToolbar {
        --paper-toolbar-background: none;
        --paper-toolbar-color: rgb(200, 200, 200);
        height: 30px;
    }
    #listToolbar > {
        display: inline-block;
    }
    #listToolbar paper-icon-button[icon='icons:close'] {
        margin-left: auto;
        display: block;
    }
    #listLength::before {
        content: '/';
        padding: 0 4px;
    }

    .chip {
        position: relative;
        box-sizing: border-box;
        padding: 0 5px 0 5px;
        cursor: pointer;
        height: 60px;
        overflow: hidden;
    }

    .chip + .chip {
        margin-top: 3px;
    }

    .chip.iron-selected {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        border: 3px solid gray;
        border-width: 0 0 0 5px;
        padding-left: 0;
        transition: background 0.4s linear;
    }

    .chip:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    .chip.iron-selected:hover {
        background: rgba(255, 255, 255, 0.1);
    ;
    }

    .chip-title {
        box-sizing: border-box;
        font-size: 12px;
        line-height: 18px;
        margin: 0 !important;
        padding: 4px 5px;
        max-height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /**
    *   Mobile Style
    */

    #container.layout.vertical {
        @apply(--layout-vertical);
    }
    :host[mobile] {
        width: 100%;
        height: 75vw;
    }
    :host[mobile][list-toggle] {
        width: 100%;
        height: 150vw;
    }
    :host[mobile] #container {
        width: 100%;
        height: 100%;
    }
    :host[mobile] #video {
        width: 100%;
        height: 10vw;
    }
    :host[mobile] #list {
        width: 100%;
    }
    
    /* Scrollbar */
    ::-webkit-scrollbar{
    height:16px;
    overflow:visible;
    width:16px;
}

::-webkit-scrollbar-button{
    height:0;
    width:0;
}

::-webkit-scrollbar-track{
    background-clip:padding-box;
    border:solid transparent;
    border-width:0 0 0 4px;
}

::-webkit-scrollbar-track:horizontal{
    border-width:4px 0 0;
}

::-webkit-scrollbar-track:hover{
    background-color:rgba(0,0,0,.05);
    box-shadow:inset 1px 0 0 rgba(0,0,0,.1);
}

::-webkit-scrollbar-track:horizontal:hover{
    box-shadow:inset 0 1px 0 rgba(0,0,0,.1);
}

::-webkit-scrollbar-track:active{
    background-color:rgba(0,0,0,.05);
    box-shadow:inset 1px 0 0 rgba(0,0,0,.14),inset -1px 0 0 rgba(0,0,0,.07);
}

::-webkit-scrollbar-track:horizontal:active{
    box-shadow:inset 0 1px 0 rgba(0,0,0,.14),inset 0 -1px 0 rgba(0,0,0,.07);
}

::-webkit-scrollbar-thumb{
    background-color: rgba(255,255,255,.25);
    background-clip:padding-box;
    border:solid transparent;
    border-width:1px 1px 1px 6px;
    min-height:28px;
    padding:100px 0 0;
    box-shadow:inset 1px 1px 0 rgba(0,0,0,.1),inset 0 -1px 0 rgba(0,0,0,.07);
}

::-webkit-scrollbar-thumb:horizontal{
    border-width:6px 1px 1px;
    padding:0 0 0 100px;
    box-shadow:inset 1px 1px 0 rgba(0,0,0,.1),inset -1px 0 0 rgba(0,0,0,.07);
}

::-webkit-scrollbar-thumb:hover{
    background-color:rgba(255,255,255,.35);
    box-shadow:inset 1px 1px 1px rgba(255,255,255,.25);
}

::-webkit-scrollbar-thumb:active{
    background-color:rgba(255,255,255,.6);
    box-shadow:inset 1px 1px 3px rgba(0,0,0,0.35);
}
::-webkit-scrollbar-corner{
    background:transparent;
}

body::-webkit-scrollbar-track-piece{
    background-clip:padding-box;
    background-color:#f5f5f5;
    border:solid #fff;
    border-width:0 0 0 3px;
    box-shadow:inset 1px 0 0 rgba(0,0,0,.14),inset -1px 0 0 rgba(0,0,0,.07);
}

body::-webkit-scrollbar-track-piece:horizontal{
    border-width:3px 0 0;
    box-shadow:inset 0 1px 0 rgba(0,0,0,.14),inset 0 -1px 0 rgba(0,0,0,.07);
}

body::-webkit-scrollbar-thumb{
    border-width:1px 1px 1px 5px;
}

body::-webkit-scrollbar-thumb:horizontal{
    border-width:5px 1px 1px;
}

body::-webkit-scrollbar-corner{
    background-clip:padding-box;
    background-color:#f5f5f5;
    border:solid #fff;
    border-width:3px 0 0 3px;
    box-shadow:inset 1px 1px 0 rgba(0,0,0,.14);
}

</style>

<!--<iron-media-query query="(max-width: 600px)" query-matches="{{mobile}}"></iron-media-query>-->

<div id="container" class="layout horizontal">
    <div id="video" class="flex relative">
        <template is="dom-if" if="{{showPlaceHolder}}">
            <div id="placeholder" class="fit" on-click="_handleHolderTap" style="[[placeHolderStyle]]">
                <a id="videoLink" href="[[holderHref]]" target="_blank">[[holderTitle]]</a>
                <iron-icon id="playIcon" icon="[[playIcon]]"></iron-icon>
                <paper-ripple style="pointer-events: none;"></paper-ripple>
            </div>
        </template>
        <template is="dom-if" if="{{playing}}">
            <google-youtube
                    id="youtube"
                    height="100%"
                    width="100%"
                    class="fit"
                    video-id="{{playingVideoId}}"
                    autoplay="1"
                    on-google-youtube-state-change="_handleStateChanged">
            </google-youtube>
        </template>
    </div>
    <template is="dom-if" if="{{showList}}">
        <div id="list" class="layout vertical">
            <div id="listToolbar" class="layout horizontal center">
                <paper-icon-button icon="av:skip-previous" action-type="prev" on-tap="_handlePlayControl"> </paper-icon-button>
                <div>
                    <span>[[selectedVideoIndexDisplay]]</span><span id="listLength">{{data.length}}</span>
                </div>
                <paper-icon-button icon="av:skip-next" action-type="next" on-tap="_handlePlayControl"> </paper-icon-button>
                
                <template is="dom-if" if="[[playing]]">
                    <paper-icon-button icon="icons:close" action-type="stop" on-tap="_handlePlayControl"></paper-icon-button>
                </template>
            </div>
            <div id="videoSelectorScroller" class="layout flex vertical scroll">
                <iron-selector id="videoSelector" selected="{{selectedVideoIndex}}">
                    <template is="dom-repeat" id="videoList" items="[[data]]" as="item">
                        <div class="chip layout horizontal video-selector-item" on-tap="_handleChipTap" data-index="[[index]]">
                            <iron-image  src="[[item.thumb]]" style="width: 80px; height: 60px;" sizing="cover"></iron-image>
                            <div class="chip-title flex">[[item.title]]</div>
                            <paper-ripple recenters style="pointer-events: none;"></paper-ripple>
                        </div>
                    </template>
                </iron-selector>
            </div>
        </div>
    </template>
    
    <!--close button -->
    <template is="dom-if" if="[[playing]]">
        <paper-icon-button icon="icons:close" action-type="stop" on-tap="_handlePlayControl" hidden="{{showList}}" style="color: maroon;"></paper-icon-button>
    </template>
</div>
`;
    }

    static get properties() {
        return {
            data: {
                type: Array,
                value() { return [];},
                observer: '_dataChanged'
            },
            width: {
                type: String
            },
            height: {
                type: String
            },
            showList: {
                type: Boolean,
                computed: '_computeShowList(data)'
            },
            listLength: {
                type: Number,
                value: 0
            },
            /**
             *  Video Playing state
             * */
            playing: {
                // true 有影片被選擇
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true
            },
            playingVideoId: {
                type: String,
                reflectToAttribute: true,
                notify: true
            },
            prevPlayedVideo: {
                type: String
            },
            showPlaceHolder: {
                // true 沒有影片被選擇
                type: Boolean,
                computed: '_computeShowPlaceHolder(playing)'
            },
            placeHolderStyle: {
                type: String,
                computed: "_computePlaceHolderStyle(selectedVideoIndex)"
            },
            startVideoIndex: {
                type: Number,
                /** BUG: not initialize in firefox , ie **/
                value: 0
            },
            selectedVideoIndex: {
                type: Number,
                reflectToAttribute: true
            },
            selectedVideoIndexDisplay: {
                type: Number,
                computed: '_computeSelectedVideoIndexDisplay(selectedVideoIndex)'
            },
            holderHref: {
                type: String,
                reflectToAttribute: true,
                computed: '_computeHolderHref(selectedVideoIndex)'
            },
            holderTitle: {
                type: String,
                reflectToAttribute: true,
                computed: '_computeHolderTitle(selectedVideoIndex)'
            },
            playSupported: {
                type: Boolean
            },
            playIcon: {
                type: String,
                computed: '_computePlayIcon(data)'
            },
            /**
             *  Media Query
             *  */
            mobile: {
                type: Boolean,
                reflectToAttribute: true
            }
        };
    }

    /**
     * Public Method
     * */
    play(id) {
        // if undeinfed
        // play 0
        if( id === undefined || id === '') {
            if (!this.data || !_.get(this.data, '0.res_id')) {
                return;
            }
            this.play(this.data[0].res_id);
            return; // End
        }

        if ( this.mobile ) {
            this._checkPlaySupport();
            if(this.playSupported) {
                // console.log( 'Play() Supported:' + this.playSupported);
                this.set( 'playing', true );
                this.set('playingVideoId', id);
                this.listen( document.querySelector('#youtube') , 'google-youtube-ready', '_mobilePlay' );
            }
        }
        this.set( 'playing', true );
        this.set('playingVideoId', id);
    }

    stop(id) {
        this.set('prevPlayedVideo', this.playingVideoId);
        this.set('playingVideoId', '');
        this.set('playing', false);
    }

    /**
     * Private Method
     * */
    _dataChanged() {
        /**  Initialize Moe-video **/
        if( this.data === undefined || this.data[0] === undefined ) return;
        this.selectedVideoIndex = this.startVideoIndex ? this.startVideoIndex : 0;
        this.listLength = this.data.length;
        if (this.listLength > 1) {
            this.set('list-toggle', true);
        }
    }

    _computePlaceHolderStyle(selectedVideoIndex) {
        return "background-image: url(" + this.data[selectedVideoIndex].thumb + ");";
    }

    _handleStateChanged(ev) {
        // ended
        if(_.get(ev, 'detail.data') === 0) {
            this._nextVideo();
        }
    }

    _handleHolderTap(e){
        this.play(_.get(this.data, `${this.selectedVideoIndex}.res_id`));
    }

    _handleChipTap(e) {
        this.play( e.model.item.res_id );
    }

    _handlePlayControl(e) {
        var action = e.currentTarget.getAttribute('action-type');
        switch(action) {
            case 'next':
                this._nextVideo();
                break;
            case 'prev':
                this._prevVideo();
                break;
            case 'stop':
                this.stop();
                break;
        }
    }

    _nextVideo() {
        if( this.selectedVideoIndex < this.data.length - 1) {
            this.selectedVideoIndex++;
        } else {
            this.selectedVideoIndex = 0;
        }

        var videoId = _.get(this.data, this.selectedVideoIndex + ".res_id");
        if (videoId) {
            this.play(videoId);
        } else {
            console.warn("videoId not found at data[selectedVideoIndex]: " + this.selectedVideoIndex);
        }
    }

    _prevVideo() {
        if( this.selectedVideoIndex > 0) {
            this.selectedVideoIndex--;
        } else {
            this.selectedVideoIndex = this.data.length - 1;
        }
        this.play(this.data[this.selectedVideoIndex].res_id);
    }

    _computeShowList(data) {
        return (data || []).length > 1;
    }

    _computePlayIcon(data) {
        if( !data[0] || data === undefined ){
            return 'refresh';
        } else {
            return 'av:play-arrow';
        }
    }

    _computeContainerClass(mobile) {
        if( mobile ) {
            return 'layout vertical'
        } else {
            return 'layout horizontal'
        }
    }

    _computeSelectedVideoIndexDisplay(selectedVideoIndex) {
        return selectedVideoIndex + 1
    }

    _computeShowPlaceHolder(playing) {
        return playing ? false : true;
    }

    _computeHolderHref(index) {
        return "https://www.youtube.com/watch?v=" + this.data[index].res_id;
    }

    _computeHolderTitle(index) {
        return this.data[index].title;
    }

    _computeStartIndex(index) {
        return index;
    }

    _checkPlaySupport() {
        this.async( function() {
            this.playSupported = document.querySelector('#youtube').playsupported;
        } ,1);
    }

    _mobilePlay(e) {
        /** Failed to execute 'play' on 'HTMLMediaElement': API can only be initiated by a user gesture. **/
        // e.target.play();
    }
}

window.customElements.define('moe-video', MoeVideo);