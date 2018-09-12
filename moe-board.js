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
import "./moe-page.js";

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
    background-color: #7E1012;
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
    background-color: #7E1012;
    z-index: 101;
}

app-toolbar.board-title {
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    background-color: #974F50;
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
    background-color: #7E1012;
    padding-left: 60px;
    height: 50px;
}

#fab-create {
    position: fixed;
    right: 28px;
    bottom: 28px;
    z-index: 99;
    --paper-fab-background: #F5B93E;
    --paper-fab-keyboard-focus-background: #F5B93E;
}

paper-icon-item:hover {
    cursor: pointer;
    background-color: var(--paper-grey-300);
}

app-toolbar {
background: transparent;
}

</style>
<app-header-layout fullbleed>
    <app-header slot="header" condenses reveals shadow effects="waterfall parallax-background blend-background" style="width: 100%">
        <app-toolbar class="board-toolbar">
            <paper-icon-button icon="menu" id="menuButton"></paper-icon-button>
            <div main-title>[[boardName]]</div>
            <paper-icon-button icon="refresh"></paper-icon-button>
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
            <div board-title-2>125 online users</div>
            <div board-title-3>Your ID: 1Nu1E47h</div>
            <div>&nbsp;</div>
        </app-toolbar>
        <app-toolbar class="board-top-menu">
            <div>第一頁</div>
        </app-toolbar>
    </app-header>
    <slot></slot>
    <paper-fab id="fab-create" icon="create"></paper-fab>
</app-header-layout>
<app-drawer id="drawer" swipe-open>
    <paper-listbox>
        <paper-item>Item 1<paper-ripple></paper-ripple></paper-item>
        <paper-item>Item 2<paper-ripple></paper-ripple></paper-item>
        <paper-item>Item 3<paper-ripple></paper-ripple></paper-item>
    </paper-listbox>
</app-drawer>
`;
    }

    static get properties() {
        return {
            boardName: {
                type: String
            }
        };
    }

    ready() {
        super.ready();
        this.$.menuButton.addEventListener('click', () => {
            this.$.drawer.toggle();
        });
    }
}

window.customElements.define('moe-board', MoeBoard);