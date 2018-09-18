import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import "@polymer/app-layout";
import "@polymer/app-layout/app-scroll-effects/effects/parallax-background";
import "@polymer/app-layout/app-scroll-effects/effects/waterfall";
import "@polymer/app-layout/app-scroll-effects/effects/resize-title";
import "@polymer/app-layout/app-scroll-effects/effects/resize-snapped-title";
import "@polymer/app-layout/app-scroll-effects/effects/blend-background";
import "@polymer/iron-icons";
import "@polymer/iron-icons/image-icons";
import "@polymer/paper-icon-button";
import "@polymer/paper-fab";
import "@polymer/paper-item/paper-icon-item";
import "@polymer/paper-styles/paper-styles";
import "@polymer/paper-ripple";
import "@polymer/app-route/app-route";
import "@polymer/app-route/app-location";
import "@polymer/iron-pages/iron-pages";
import "./moe-threads.js";

class MoeBoard extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
    font-family: 'Roboto', 'Noto', sans-serif;
}

body {
  margin: 0;
  background-color: #eee;
}

app-header {
    position: fixed;
    top: 0;
    left: 0;
    background-color: var(--palette-500);
    color: #fff;
    height: 319px;
    z-index: 100;
    
    /* TODO: Enable background image styling */
    /**
    --app-header-background-front-layer: {
        background-image: url(https://lh3.googleusercontent.com/-zuKxhGnvLKg/W3lY1xJe7tI/AAAAAAAC40U/mSypBvScOdc6JIXP105RFH5Bcvh8qzQCgCJkCGAYYCw/w976-h549-n-rw-no/sp180819_190859.png);
        background-size: cover;
        background-position: center;
    };
    */
}

app-header paper-icon-button {
    --paper-icon-button-ink-color: white;
}

#content {
}

app-toolbar.board-toolbar {
    @apply --layout-horizontal;
    @apply --layout-end-justified;
    background-color: var(--palette-500);
    z-index: 101;
}

[main-title] {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

app-toolbar.board-title {
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    background-color: var(--palette-400);
    height: 175px;
    padding-left: 24px;
    padding-bottom: 30px;
    /* border-bottom: #CA8A44 2px solid; */
    z-index: 99;
}

[board-title-1] {
    font-size: xx-large;
    margin-bottom: 9px;
    margin-top: 30px;
}

[board-title-2] {
    margin-bottom: 6px;
    font-size: medium;
}

[board-title-3] {
    font-size: medium;
}

app-toolbar.board-top-menu {
    background-color: var(--palette-300);
    padding-left: 60px;
    height: 50px;
}

#fab-create {
    position: fixed;
    right: 28px;
    bottom: 28px;
    z-index: 999;
    --paper-fab-background: #F5B93E;
    --paper-fab-keyboard-focus-background: #F5B93E;
}

paper-icon-item:hover {
    cursor: pointer;
    background-color: var(--paper-grey-300);
}

footer {
    @apply --layout-vertical;
    @apply --layout-center;
    @apply --layout-center-justified;
    margin-top: 36px;
    font-size: smaller;
    color: var(--google-grey-500);
    text-align: center;
}

moe-threads {
    max-width: 800px;
    margin: 0 32px 32px 32px;
}

@media (max-width: 600px) {
    moe-threads {
        margin: 0 16px 32px 16px;
    }     
}

app-drawer {
    color: var(--paper-grey-900);
    --app-drawer-width: 280px;
}

app-drawer #drawerHeader {
    @apply --layout-vertical;
    @apply --layout-center-justified;
    height: 72px;
}

app-drawer h1,h2 {
    width: 100%;
    margin: 0;
    padding: 0 24px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

app-drawer h1 {
    @apply --paper-font-title;
    font-weight: bold;
}

app-drawer h1:hover {
    cursor: pointer;
}

app-drawer h2 {
    @apply --paper-font-caption;
}

app-drawer h3 {
    @apply --paper-font-common-base;
    @apply --layout-horizontal;
    @apply --layout-end;
    font-weight: 400;
    font-size: 18px;
    color: rgb(32, 33, 36);
    padding: 40px 0 12px 24px;
    margin: 0;
    line-height: 27px;
}

app-drawer hr {
    margin: 0;
    border: none;
    border-bottom: 1px solid rgba(0,0,0,0.12);
}

app-drawer a {
    @apply --layout-horizontal;
    @apply --layout-center-justified;
    text-decoration: none;
    width: 100%;
}

app-drawer a paper-button {
    @apply --layout-horizontal;
    @apply --layout-justified;
    font-size: 14px;
    font-weight: 400;
    color: rgb(95, 99, 104);
    margin: 0 0;
    width: 100%;
    padding: 12px 0 12px 24px;
}

app-drawer ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    padding-bottom: 40px;
}

app-drawer a paper-button:hover {
    background-color: var(--paper-grey-300);
}

</style>
<app-header-layout fullbleed>
    <app-header slot="header" condenses reveals shadow effects="waterfall parallax-background blend-background" style="width: 100%">
        <app-toolbar class="board-toolbar">
            <paper-icon-button icon="menu" on-click="_onMenuButtonClick"></paper-icon-button>
            <div main-title on-click="_onToolBarTitleClick">
                [[boardName]]
                <template is="dom-if" if="[[showSubCaption]]">
                    <iron-icon icon="chevron-right"></iron-icon>[[subCaption]]
                </template>                
            </div>
            <paper-icon-button icon="refresh" on-click="_onRefreshButotnClicked"></paper-icon-button>
            <paper-menu-button allow-outside-scroll horizontal-align="right">
              <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
              <paper-listbox slot="dropdown-content">
                <!-- <paper-icon-item><iron-icon icon="search" slot="item-icon"></iron-icon>搜尋<paper-ripple></paper-ripple></paper-icon-item> --> 
                <paper-icon-item><iron-icon icon="image:view-compact" slot="item-icon"></iron-icon>相簿模式<paper-ripple></paper-ripple></paper-icon-item>
                <paper-icon-item><iron-icon icon="settings" slot="item-icon"></iron-icon>管理<paper-ripple></paper-ripple></paper-icon-item>
              </paper-listbox>
            </paper-menu-button>
        </app-toolbar>
        <app-toolbar class="board-title">
            <div board-title-1 main-title>[[boardName]]</div>
            <div board-title-2>[[boardDescription]]</div>
            <div board-title-3>256個線上使用者</div>
            <div>&nbsp;</div>
        </app-toolbar>
        <app-toolbar class="board-top-menu">
            <div>[[subCaption]]</div>
        </app-toolbar>
    </app-header>
    
    <iron-pages role="main" selected="[[routeData.page]]" attr-for-selected="name" selected-attribute="visible" fallback-selection="404">
        <div name=""></div>
        <moe-threads name="threads" id="threads" route="{{threadsRoute}}" graphql-server="[[graphqlServer]]" 
                     board-id="[[boardId]]" board-alias="[[boardAlias]]" board-subdomain="[[boardSubdomain]]" 
                     threads-per-page="5" replies-per-thread="3" image-servers="[[imageServers]]"
                     on-page-change="_onThreadsPageChange"></moe-threads>
        <div name="404"><h1>404</h1></div>
    </iron-pages>
    
    <footer>
        <div>Disclaimer: All trademarks and copyrights on this page are owned by their respective parties. Images uploaded are the responsibility of the Poster. Comments are owned by the Poster.</div>
    </footer>

    <paper-fab id="fab-create" icon="create"></paper-fab>
</app-header-layout>

<app-drawer id="drawer" swipe-open>
    <div id="drawerHeader">
        <h1 on-click="_onBoardNameClick">[[boardName]]</h1>
        <h2>[[boardDescription]]</h2>
    </div>
    <template is="dom-repeat" items="[[boardExternalLinks]]" as="boardExternalLink">
        <hr />
        <h3><span>[[boardExternalLink.title]]</span></h3>
        <ul>
            <template is="dom-repeat" items="[[boardExternalLink.links]]" as="externalLink">
                <li>
                    <a href$="[[externalLink.link]]" rel="nofollow" target="_blank">
                        <paper-button>[[externalLink.text]]</paper-button>
                    </a>
                </li>
            </template>
        </ul>
    </template>
</app-drawer>

<!-- Route -->
<app-location route="{{route}}"></app-location>
<app-route
    pattern="/:page"
    route="{{route}}"
    data="{{routeData}}"
    query-params="{{queryParams}}"></app-route>
<app-route
    pattern="/threads"
    route="{{route}}"
    tail="{{threadsRoute}}"></app-route>
`;
    }

    static get properties() {
        return {
            graphqlServer: {
                type: String
            },
            boardId: {
                type: Number
            },
            boardAlias: {
                type: String
            },
            boardSubdomain: {
                type: String
            },
            boardExternalLinks: {
                type: Array
            },
            page: {
                type: String
            },
            route: {
                type: Object,
                notify: true,
            },
            routeData: {
                type: Object,
                notify: true,
            },
            queryParams: {
                type: Object
            },
            threadsRoute: {
                type: Object,
                notify: true
            },
            subCaption: {
                type: String,
                value: ''
            },
            showSubCaption: {
                type: Boolean,
                computed: '_computeShowSubCaption(subCaption)'
            },
            imageServers: {
                type: Object,
                value: {
                    'DEV_SRC': (file, subdomain, alias) => `https://dev.imgs.moe/my/${subdomain}/${alias}/src/${file}`,
                    'DEV_THUMB': (file, subdomain, alias) => `https://dev.imgs.moe/my/${subdomain}/${alias}/thumb/${file}`,
                    'BCDN_SRC': (file, subdomain, alias) => `https://mymoe.b-cdn.net/my/${subdomain}/${alias}/src/${file}`,
                    'BCDN_THUMB': (file, subdomain, alias) => `https://mymoe.b-cdn.net/my/${subdomain}/${alias}/thumb/${file}`,
                }
            }
        };
    }

    static get observers() { return [
        '_routePageChanged(routeData.page)'
    ]}

    ready() {
        super.ready();
        this.$.drawer.open();
    }

    goHome() {
        const forceReload = this.$.threads.page === 0;
        this.set('route.path', '/threads/0');
        if (forceReload) {
            this.$.threads.reload();
        }
    }

    _routePageChanged(page) {
        console.log('moe-board: routePageChanged', this.route, this.routeData);

        switch (page) {
            // redirect index to threads page
            case "":
                this.set('route.path', '/threads/0');
                return;
        }
    }

    _onToolBarTitleClick(e) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    _onMenuButtonClick(e) {
        this.$.drawer.open();
    }

    _onRefreshButotnClicked() {
        this.goHome();
    }

    _onBoardNameClick() {
        this.goHome();
        this.$.drawer.close();
    }

    _onThreadsPageChange(e) {
        this.set('subCaption', ` 第 ${e.detail.page} 頁`);
    }

    _computeShowSubCaption(subCaption) {
        return (typeof subCaption === 'string' && subCaption);
    }
}

window.customElements.define('moe-board', MoeBoard);