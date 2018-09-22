import {html, PolymerElement} from "@polymer/polymer/polymer-element";

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-styles/shadow';
import '@polymer/iron-image/iron-image';

import './moe-icons';

class MoeFormVideoEmbed extends PolymerElement {
    static get template() {
        return html`
<style>
:host: {
    display: inline-block;
}
#container {
    position: relative;
    width: 210px;
    height: 160px;
}
#title {
    height: 3em;
    text-overflow: ellipsis;
    overflow: hidden;
}
paper-icon-button[icon="cancel"] {
    width: 24px;
    height: 24px;
    position: absolute;
    left: 5px;
    top: 5px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: white;
    border: 1px solid #ededed;
    border-radius: 50%;
    @apply --shadow-elevation-2dp;
}
</style>
<div id="container">
    <iron-image width="210" height="118" src="[[image]]" sizing="cover"></iron-image>
    <div id="title">[[title]]</div>
    <paper-icon-button icon="cancel" on-click="_onRemoveButtonClick" disabled$="[[disabled]]"></paper-icon-button>
</div>
`;
    }

    static get properties() {
        return {
            index: {
                type: Number
            },
            image: {
                type: String
            },
            title: {
                type: String
            },
            disabled: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    _onRemoveButtonClick() {
        this.dispatchEvent(new CustomEvent('remove'));
    }
}

window.customElements.define('moe-form-video-embed', MoeFormVideoEmbed);