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
import "@polymer/paper-toast";
import "@polymer/app-route/app-route";
import "@polymer/app-route/app-location";
import "@polymer/iron-pages/iron-pages";

import "./moe-threads.js";
import './moe-form-dialog';
import './moe-reply-form';
import './moe-form';
import './moe-report-form';
import './moe-graphql';
import './pixmicat-request';
import {ReduxMixin} from './redux/redux-mixin';
import * as actions from './redux/redux-actions';
import isError from "lodash-es/isError";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {AppLocalizeBehavior} from "@polymer/app-localize-behavior";

import locales from "./locales/moe-board";

class MoeBoard extends mixinBehaviors([AppLocalizeBehavior], ReduxMixin(PolymerElement)) {
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
    z-index: 1;

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
    z-index: 3;
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
    z-index: 2;
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
    z-index: 3;
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
    max-width: 720px;
    margin: 0 auto 32px auto;
}

@media (max-width: 600px) {
    moe-threads {
        margin: 0 auto 32px auto;
    }
}

app-drawer {
    color: var(--paper-grey-900);
    --app-drawer-width: 280px;
}

app-drawer #drawerScrollable {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
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
        <moe-threads name="threads"
                    id="threads"
                    route="{{threadsRoute}}"
                    graphql-server="[[graphqlServer]]"
                    poll-server="[[pollServer]]"
                    board-id="[[boardId]]"
                    board-alias="[[boardAlias]]"
                    board-subdomain="[[boardSubdomain]]"
                    threads-per-page="5"
                    replies-per-thread="3"
                    image-servers="[[imageServers]]"
                    on-page-change="_onThreadsPageChange"
                    on-post-menu-button-delete-click="_onPostDelete"
                    on-post-menu-button-report-click="_onPostReport"></moe-threads>
        <div name="404"><h1>404</h1></div>
    </iron-pages>

    <footer>
        <div>Disclaimer: All trademarks and copyrights on this page are owned by their respective parties. Images uploaded are the responsibility of the Poster. Comments are owned by the Poster.</div>
    </footer>

    <paper-fab id="fab-create" icon="create" on-click="_onFabClick"></paper-fab>
</app-header-layout>

<app-drawer id="leftDrawer" swipe-open>
    <div id="drawerScrollable">
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
    </div>
</app-drawer>

<!-- TODO: display full thread in right drawer -->
<!--
<app-drawer id="rightDrawer" swipe-open>
</app-drawer>
-->

<!-- Reply Form -->
<moe-form-dialog id="replyDialog" hidden on-submit="_onReplyFormSubmit" on-close="_onReplyFormClose">
    <moe-reply-form id="replyForm"
                    board-id="[[boardId]]"
                    comment-max-length="[[commentMaxLength]]"
                    subject-max-length="[[subjectMaxLength]]"
                    file-max-size="[[fileMaxSize]]"
                    embed-request-server="[[embedRequestServer]]"
                    video-max-embeds="[[videoMaxEmbeds]]"></moe-reply-form>
</moe-form-dialog>
<pixmicat-request id="replyRequest" method="POST" server="[[postServer]]"></pixmicat-request>

<!-- Create Thread Form -->
<moe-form-dialog id="createThreadDialog" dialog-title="建立討論串" hidden on-submit="_onCreateThreadFormSubmit" on-close="_onCreateThreadFormClose">
    <moe-form id="createThreadForm"
              board-id="[[boardId]]"
              comment-max-length="[[commentMaxLength]]"
              has-subject
              subject-max-length="[[subjectMaxLength]]"
              file-max-size="[[fileMaxSize]]"
              embed-request-server="[[embedRequestServer]]"
              video-max-embeds="[[videoMaxEmbeds]]"
              has-poll
              poll-title-max-length="[[pollTitleMaxLength]]"
              poll-item-max-length="[[pollItemMaxLength]]"
              poll-min-items="[[pollMinItems]]"
              poll-max-items="[[pollMaxItems]]"></moe-form>
</moe-form-dialog>
<pixmicat-request id="createThreadRequest" method="POST" server="[[postServer]]"></pixmicat-request>

<pixmicat-request id="deletePostRequest" method="POST" server="[[postServer]]"></pixmicat-request>
<paper-toast id="deletePostToast" text="成功刪除文章"></paper-toast>

<!-- Report Form -->
<moe-form-dialog id="reportDialog" on-submit="_onReportSubmit" on-error="_onReportError" on-close="_onReportDialogClose" hidden>
  <moe-report-form name="form" id="reportForm"></moe-report-form>
</moe-form-dialog>

<moe-graphql id="moeGraphQL" server="[[graphqlServer]]"></moe-graphql>

<!-- Routes -->
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
            graphqlServer: String,
            embedRequestServer: String,
            postServer: String,
            pollServer: String,
            boardId: Number,
            boardAlias: String,
            boardSubdomain: String,
            boardExternalLinks: Array,
            page: String,
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
            },

            // validation criteria
            nameMaxLength: {type: Number, statePath: 'validationCriteria.nameMaxLength'},
            emailMaxLength: {type: Number, statePath: 'validationCriteria.emailMaxLength'},
            subjectMaxLength: {type: Number, statePath: 'validationCriteria.subjectMaxLength'},
            commentMaxLength: {type: Number, statePath: 'validationCriteria.commentMaxLength'},
            fileMaxSize: {type: Number, statePath: 'validationCriteria.fileMaxSize'},
            videoMaxEmbeds: {type: Number, statePath: 'validationCriteria.videoMaxEmbeds'},
            pollTitleMaxLength: {type: Number, statePath: 'validationCriteria.pollTitleMaxLength'},
            pollItemMaxLength: {type: Number, statePath: 'validationCriteria.pollItemMaxLength'},
            pollMinItems: {type: Number, statePath: 'validationCriteria.pollMinItems'},
            pollMaxItems: {type: Number, statePath: 'validationCriteria.pollMaxItems'},

            // i18n
            language: {
                type: String,
                statePath: 'language'
            }
        };
    }

    static get observers() {
        return [
            '_routePageChanged(routeData.page)'
        ]
    }

    ready() {
        super.ready();

        this.resources = locales;

        this.addEventListener('post-menu-button-reply-click', (e) => {
            this.showReplyForm(e.detail.boardId, e.detail.threadNo, e.detail.no);
        });

        this.addEventListener('post-header-no-click', (e) => {
            this.showReplyForm(e.detail.boardId, e.detail.threadNo, e.detail.no);
        });

        this.addEventListener('thread-header-no-click', (e) => {
            this.showReplyForm(e.detail.boardId, e.detail.threadNo, e.detail.no);
        });
    }

    hideAllFormDialogs() {
        this.shadowRoot.querySelectorAll('moe-form-dialog').forEach(dialog => dialog.setAttribute('hidden', 'hidden'));
    }

    /** Reply Form */
    showReplyForm(boardId, threadNo, replyTo) {
        this.hideAllFormDialogs();
        this.$.replyDialog.show();
        this.$.replyDialog.dialogTitle = `回應 - No.${replyTo}`;
        this.$.replyForm.setProperties({
            boardId: boardId,
            threadNo: threadNo,
            replyTo: replyTo,
            comment: `>>No.${replyTo}\n`
        });
        setTimeout(() => this.$.replyForm.focus(), 0);
    }

    _onReplyFormSubmit(e) {
        this.$.replyForm.setProperties({
            disabled: true,
            loading: true
        });

        this.$.replyRequest.makeReply(
            e.detail.boardId,
            e.detail.threadNo,
            e.detail.comment,
            e.detail.file,
            e.detail.videoEmbeds,
        ).then(res => {
            // hide form
            this.$.replyDialog.hide();
            this.$.replyForm.reset();
            // fetch post
            this.$.threads.dispatchEvent(new CustomEvent('reply-ack', {
                detail: {
                    boardId: e.detail.boardId,
                    threadNo: e.detail.threadNo,
                    no: res.no
                }
            }));
        }).catch(err => {
            console.error(err);

            if (err.error) {
                alert(err.error);
            } else {
                alert("Connection error");
            }

        }).finally(() => {
            // remove loading status
            this.$.replyForm.setProperties({
                disabled: false,
                loading: false
            });
        });
    }

    _onReplyFormClose(e) {
        if (this.$.replyForm.changed() && !confirm("確定要取消回應嗎？")) {
            return;
        }

        this.$.replyDialog.setAttribute('hidden', "hidden");
        this.$.replyForm.reset();
    }

    /** Create Thread Form */
    showCreateThreadForm(boardId) {
        this.hideAllFormDialogs();
        this.$.createThreadDialog.removeAttribute('hidden');
        this.$.createThreadDialog.setProperties({
            boardId: boardId
        });
        setTimeout(() => this.$.createThreadForm.focus(), 0);
    }

    _onCreateThreadFormSubmit(e) {
        this.$.createThreadForm.setProperties({
            disabled: true,
            loading: true
        });

        this.$.createThreadRequest.makeThread(
            e.detail.boardId,
            e.detail.comment,
            e.detail.file,
            e.detail.poll,
            e.detail.videoEmbeds,
            e.detail.subject
        ).then(res => {
            // hide form
            this.$.createThreadDialog.setAttribute('hidden', 'hidden');
            this.$.createThreadForm.reset();
            // fetch post
            this.$.threads.dispatchEvent(new CustomEvent('create-thread-ack', {
                detail: {
                    boardId: e.detail.boardId,
                    threadNo: res.no
                }
            }));
        }).catch(err => {
            if (isError(err)) {
                alert(`${err.message}`);
            } else {
                alert(`Unexpected error: ${err}`);
                console.error(err);
            }
        }).finally(() => {
            // remove loading status
            this.$.createThreadForm.setProperties({
                disabled: false,
                loading: false
            });
        });
    }

    _onCreateThreadFormClose(e) {
        if (this.$.createThreadForm.changed() && !confirm("確定要取消建立討論串嗎？")) {
            return;
        }

        this.$.createThreadDialog.setAttribute('hidden', "hidden");
        this.$.createThreadForm.reset();
    }

    /** Routing */

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
        this.$.leftDrawer.open();
    }

    _onRefreshButotnClicked() {
        this.goHome();
    }

    _onBoardNameClick() {
        this.goHome();
        this.$.leftDrawer.close();
    }

    _onThreadsPageChange(e) {
        this.set('subCaption', ` 第 ${e.detail.page} 頁`);
    }

    _computeShowSubCaption(subCaption) {
        return (typeof subCaption === 'string' && subCaption);
    }

    _onFabClick(e) {
        this.showCreateThreadForm(this.boardId);
    }

    _onPostDelete(e) {
        if (e.detail.threadNo !== e.detail.no) { // delete reply
            this.$.deletePostRequest.delete(e.detail.boardId, e.detail.no)
                .then(() => this.$.moeGraphQL.getDeleteReplyAck(e.detail.boardId, e.detail.threadNo))
                .then(resp => {
                    this.dispatch({
                        type: actions.UPDATE_THREAD,
                        thread: resp.data.getThreadByNo
                    });
                    this.dispatch({
                        type: actions.REMOVE_REPLY_FROM_THREAD,
                        reply: {
                            boardId: e.detail.boardId,
                            threadNo: e.detail.threadNo,
                            no: e.detail.no
                        }
                    });

                    this.$.deletePostToast.open();
                })
                .catch(err => {
                    console.error(err);
                    if (isError(err)) {
                        alert(`${err.message}`);
                    } else {
                        alert(`Unexpected error`);
                    }
                });
        } else { // delete thread
            this.$.deletePostRequest.delete(e.detail.boardId, e.detail.no)
                .then(() => {
                    this.dispatch({
                        type: actions.REMOVE_THREAD,
                        thread: {
                            boardId: e.detail.boardId,
                            threadNo: e.detail.threadNo,
                            no: e.detail.no
                        }
                    });

                    this.$.deletePostToast.open();
                })
                .catch(err => {
                    console.error(err);
                    if (isError(err)) {
                        alert(`${err.message}`);
                    } else {
                        alert(`Unexpected error`);
                    }
                });
        }
    }

    /* Report Event Handlers */

    _onReportSubmit(e) {
        // TODO: submit report to api
        console.log(e.detail);
    }

    _onReportError(e) {
        if (isError(e.detail.error)) {
            alert(e.detail.error.message);
        } else {
            alert('Unexpected error ' + e);
            console.error(e);
        }
    }

    _onPostReport(e) {
        this.$.reportForm.reset();
        this.$.reportForm.setProperties({
            boardId: e.detail.boardId,
            no: e.detail.no
        });
        this.$.reportDialog.dialogTitle = this.localize('reportDialogTitle', 'no', e.detail.no);
        this.$.reportDialog.show();
    }

    _onReportDialogClose(e) {
        this.$.reportForm.reset();
        this.$.reportDialog.hide();
    }
}

window.customElements.define('moe-board', MoeBoard);
