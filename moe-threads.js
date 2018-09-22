import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {MutableData} from '@polymer/polymer/lib/mixins/mutable-data';
import '@polymer/paper-spinner/paper-spinner-lite'
import '@polymer/paper-styles/paper-styles';
import '@polymer/paper-button/paper-button';
import '@polymer/iron-icons/image-icons';
import './moe-styles.js';
import './moe-thread.js';
import {MoeGraphQL} from './moe-graphql';
import {ReduxMixin} from './redux/redux-mixin';
import * as actions from './redux/redux-actions';
import * as selectors from './redux/redux-selectors';

class MoeThreads extends MutableData(ReduxMixin(PolymerElement)) {
    static get template() {
        return html`
<style>
:host {
    display: block;
}
moe-thread {
    margin-top: 32px;
    width: 100%;
}
.loading {
   	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: center;
	margin-top: 32px;
}
.loading .loading-text {
    margin-left: 0.5em;
}
.loading paper-spinner-lite {
    --paper-spinner-color: var(--futaba-red-color);
} 

#paginator {
    @apply --layout-horizontal;
    align-content: stretch;
    margin-top: 36px;
    color: var(--futaba-red-color)
}

#paginator > * {
    flex: 1 1 auto;
}
</style>
<template is="dom-if" if="[[loading]]">
    <div class="loading">
        <paper-spinner-lite active></paper-spinner-lite>
    </div>
</template>
<template is="dom-repeat" mutable-data items="[[threads]]" as="thread">
    <moe-thread 
        is-admin="[[isAdmin]]"
        board-id="[[boardId]]" board-alias="[[boardAlias]]" board-subdomain="[[boardSubdomain]]"
        no="[[thread.no]]" 
        reply-count="[[thread.replyCount]]" 
        flag-admin-sticky="[[thread.flagAdminSticky]]"
        flag-admin-thread-stop="[[thread.flagAdminThreadStop]]"
        flag-admin-sage="[[thread.flagAdminSage]]"
        firstpost="[[thread.firstPost]]"
        replies="[[thread.replies]]"
        graphql-server="[[graphqlServer]]"
        image-servers="[[imageServers]]"
        initial-reply-count="[[repliesPerThread]]">
    </moe-thread>
</template>
<div id="paginator">
    <template is="dom-if" if="[[hasPrevPage]]">
        <paper-button rel="prev" id="prevPageButton" on-click="loadPrevPage" disabled$="[[loading]]"><iron-icon icon="image:navigate-before"></iron-icon>上一頁</paper-button>
    </template>
    <template is="dom-if" if="[[hasNextPage]]">
        <paper-button rel="next" id="nextPageButton" on-click="loadNextPage" disabled$="[[loading]]">下一頁<iron-icon icon="image:navigate-next"></iron-icon></paper-button>
    </template>
</div>

<!-- GraphQL -->
<moe-graphql id="moeGraphQL" server="[[graphqlServer]]"></moe-graphql>

<!-- Route -->
<app-route pattern="/" route="{{route}}" data="{{routeData}}" active="{{active}}"></app-route>
<app-route pattern="/:page" route="{{route}}" data="{{routeData}}" active="{{active}}"></app-route>
`;
    }

    static get properties() {
        return {
            boardId: {
                type: Number
            },
            boardAlias: {
                type: String
            },
            boardSubdomain: {
                type: String
            },

            route: {
                type: Object,
                notify: true
            },
            routeData: {
                type: Object,
                notify: true
            },
            graphqlServer: {
                type: String,
            },
            imageServers: {
                type: Object
            },
            isAdmin: {
                type: Boolean,
                value: false,
                reflectToAttribute: true,
                notify: true
            },
            threads: {
                type: Array,
                statePath: selectors.threadsSelector
            },
            page: {
                type: Number,
                reflectToAttribute: true,
                observer: '_observePage'
            },
            threadsPerPage: {
                type: Number
            },
            repliesPerThread: {
                type: Number
            },
            loading: {
                type: Boolean,
                value: true
            },
            hasPrevPage: {
                type: Boolean,
                computed: '_computeHasPrevPage(page)'
            },
            hasNextPage: {
                type: Boolean,
                computed: '_computeHasNextPage(threads)'
            }
        };
    }

    static get observers() {
        return [
            '_observeRoutePage(route.path)'
        ];
    }

    ready() {
        super.ready();

        this.addEventListener('reply-ack', (e) => {
            this.$.moeGraphQL.getReplyAck(e.detail.boardId, e.detail.threadNo, e.detail.no)
                .then(resp => {
                    this.dispatch({
                        type: actions.UPDATE_THREAD,
                        thread: resp.data.getThreadByNo
                    });
                    this.dispatch({
                        type: actions.APPEND_REPLY_TO_THREAD,
                        reply: this._postTransformer(resp.data.getPostByNo)
                    });
                })
                .catch(err => console.error(err));
        });
    }

    load() {
        window.scrollTo(0, 0);

        this.set('loading', true);
        this.$.moeGraphQL
            .getThreads(this.boardId, this.page * this.threadsPerPage, this.threadsPerPage, 0, this.repliesPerThread)
            .then(resp => {
                this.dispatch({
                    type: actions.UPDATE_THREADS,
                    threads: resp.data.getThreads.map(t => Object.assign({}, t, {
                        firstPost: this._postTransformer(t.firstPost),
                        replies: (t.replies || []).reverse().map(reply => this._postTransformer(reply))
                    }))
                });
            })
            .catch(err => console.log(err)) // TODO: error reporting
            .finally(() => this.set('loading', false));
    }

    _postTransformer(post) {
        return MoeGraphQL.postTransformer(this.boardSubdomain, this.boardAlias, this.imageServers, post);
    }

    reload() {
        this.set('threads', []);
        this.load();
    }

    loadPrevPage() {
        if (this.hasPrevPage) {
            this.set('routeData.page', this.page - 1);
        }
    }

    loadNextPage() {
        if (this.hasNextPage) {
            this.set('routeData.page', this.page + 1);
        }
    }

    _computeHasPrevPage(page) {
        return page > 0;
    }

    _computeHasNextPage(threads) {
        return threads.length > 0;
    }

    _observePage(newValue) {
        this.set('threads', []);
        this.load();
        this.dispatchEvent(new CustomEvent('page-change', {
            detail: {
                page: newValue
            }
        }));
    }

    _observeRoutePage() {
        console.log('moe-threads: _observeRoutePage', this.route, this.routeData);

        const page = parseInt(this.routeData.page);
        if (typeof page === 'number' && page >= 0) {
            this.set('page', page);
        } else {
            this.set('route.path', '/0');
        }
    }
}

window.customElements.define('moe-threads', MoeThreads);