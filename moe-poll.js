import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { MutableData } from '@polymer/polymer/lib/mixins/mutable-data.js';
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-ripple/paper-ripple';
import './moe-styles.js';

/**
 * `moe-poll`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MoePoll extends MutableData(PolymerElement) {
    static get template() {
        return html`
<style>
:host {
    min-width: 300px;
    display: table;
    padding: 10px;
    background-color: var(--moe-poll-background-color);
    color: var(--moe-poll-text-color);
    @apply --paper-font-body1; 
}

.poll_title {
    @apply --paper-font-title;
    margin-bottom: 0.5em;
    color: var(--moe-poll-title-color);
}

.progress {
    position: relative;
    font-size: 14px;
}

.progress > div {
    margin: 0 0 5px 0;
}

.progress > div > div:nth-child(1) span {
    display: block;
    max-width: 440px;
    white-space: normal;
    line-height: 20px;
}

.progress > div .barCon {
    position: relative;
    overflow: hidden;
    background-color: #ffe;
}

.progress > div .barCon .bar {
    height: 2em;
    text-align: center;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
    background-color: #f0e0d6;
    transition: width 0.8s;
}

.progress > div .barCon .barData {
    position: absolute;
    top: 5px;
    right: 10px;
}

.progress > div .barCon .barData > span:nth-child(1) {
    margin-right: 5px;
}

.progress > div .barCon .barData > span:nth-child(1):after {
    margin-left: 5px;
    content: '/';
}

.control-group {
    font-size: 13px;
}

.control-group form {
    display: inline-block;
}

.control-group .right {
    float: right;
}

.poll_total {
    font-size: small;
}

</style>

<div>
    <!-- unvoted -->
    <template is="dom-if" if="[[displayItems]]">
        <div class="poll_container">
            <div class="vote">
                <div class="poll_title">
                    <iron-icon icon="social:poll"></iron-icon>[[subject]]
                </div>						
                <div class="pool">
                    <div class="poll_list">
                        <template is="dom-repeat" items="[[itemsProcessed]]">
                            <moe-poll-item text="[[item.text]]" on-click="_onPollItemClick"></moe-poll-item>
                        </template>
                    </div>
                </div>
            </div>
            <div align="right" class="poll_total">( 目前有 <span>[[totalVotes]]</span> 名投票者 ) </div>
        </div>    
    </template>
    
    <!-- voted -->
    <template is="dom-if" if="[[displayResult]]">
        <div class="poll_container">
            <div class="vote poll_result">
                <div class="poll_title">
                    <iron-icon icon="social:poll"></iron-icon>[[subject]]
                </div>					
                <div class="progress poll_result_list">
                    <template is="dom-repeat" items="[[itemsProcessed]]">
                        <div>
                            <div><span class="poll_result_item_caption">[[item.text]]</span></div>
                            <div class="barCon poll_result_item_stats">						    		
                                <div class="bar" style="width: [[item.percentage]]%;"></div>
                                <div class="barData"><span class="percent">[[item.percentage]]%</span><span class="count">[[item.votes]]</span></div>
                            </div>						    							    	
                        </div>
                    </template>
                </div>
                <div align="right" class="poll_total">( 目前有 <span>[[totalVotes]]</span> 名投票者 ) </div>
            </div>
        </div>
    </template>
</div>
`;
    }

    static get properties() {
        return {
            boardId: Number,
            no: Number,
            subject: {
                type: String,
                value: '',
            },
            items: {
                type: Array,
                value: [],
                notify: true
            },
            itemsProcessed: {
                type: Array,
                computed: '_processItems(items)'
            },
            totalVotes: {
                type: Number,
                value: 0,
                reflectToAttribute: true,
            },
            voted: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            displayResult: {
                type: Boolean,
                computed: '_computeDisplayResult(voted)'
            },
            displayItems: {
                type: Boolean,
                computed: '_computeDisplayItems(voted)'
            }
        };
    }

    _processItems(items) {
        // count total votes
        const totalVotes = (items || []).reduce((previousValue, currentValue) => {
            if (typeof currentValue === 'object' && typeof currentValue['votes'] === 'number') {
                return previousValue + currentValue['votes'];
            } else {
                return previousValue;
            }
        }, 0);
        this.set('totalVotes', totalVotes);

        return items.map(item => Object.assign({}, item, {
            percentage: Math.round(item.votes / totalVotes * 100)
        }));
    }

    _onPollItemClick(e) {
        this.dispatchEvent(new CustomEvent("item-click", {
            composed: true,
            detail: {
                board_id: this.boardId,
                no: this.no,
                item: e.currentTarget.get('text')
            }
        }));
    }

    _computeDisplayResult(voted) {
        return voted;
    }

    _computeDisplayItems(voted) {
        return !voted;
    }
}

class MoePollItem extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
}
.poll_item {
    @apply --shadow-elevation-2dp;
    position: relative;
    background-color: var(--moe-poll-unvoted-item-background-color);
    margin: 0 0 5px 0;
    padding: 1em 1em 1em 0.5em;
    border: 1px solid #800000;
    border-width: 0 0 0 5px;
    line-height: 25px;
    cursor: pointer;
}

.poll_item:hover {
    background-color: #f0e0d6;
}

.poll_item a {
    width: 100%;
    cursor: pointer;
}
</style>
<div class="poll_item">
    <a>[[text]]</a>
    <paper-ripple></paper-ripple>
</div>
`;
    }

    static get properties() {
        return {
            text: {
                type: String
            }
        };
    }
}

window.customElements.define('moe-poll', MoePoll);
window.customElements.define('moe-poll-item', MoePollItem);
