import {html, PolymerElement} from "@polymer/polymer/polymer-element";

import './moe-form-video-embed';

class MoeFormVideoEmbeds extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    height: auto;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 0.5em;
}

moe-form-video-embed {
    margin-right: 1em;
}
</style>
<template is="dom-repeat" items="[[embeds]]" as="embed">
    <moe-form-video-embed index="[[index]]" image="[[embed.image]]" title="[[embed.title]]" on-remove="_onEmbedRemove" disabled$="[[disabled]]"></moe-form-video-embed> 
</template>
`;
    }

    static get properties() {
        return {
            embeds: {
                type: Array,
                notify: true,
                value: []
            },
            embedsSet: {
                type: Object,
                value: new Set()
            },
            disabled: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    static get observers() {
        return [
            '_observeDisplay(embeds.length)',
            '_observeSplices(embeds.splices)',
            '_observeEmbeds(embeds)'
        ];
    }

    ready() {
        super.ready();
        this.addEventListener('mousewheel', (event) => {
            this.scrollLeft += (event.deltaY);
            event.preventDefault();
        });
    }

    add(image, title, data) {
        const newEmbed = {image, title, data};

        if (this.embedsSet.has(JSON.stringify(newEmbed))) {
            alert('重複的影片');
            return;
        }

        this.push('embeds', newEmbed);
        setTimeout(() => this.scrollLeft = this.scrollWidth, 0);
    }

    reset() {
        this.splice('embeds', 0, this.embeds.length);
    }

    _observeDisplay(embedsLength) {
        if (embedsLength > 0) {
            this.style.display = 'flex';
        } else {
            this.style.display = 'none';
        }
    }

    _observeSplices(splices) {
        if (!splices || !splices.indexSplices) return;

        splices.indexSplices.forEach(splice => {
            for (let i = splice.index;i < splice.index + splice.addedCount;i++) {
                this.embedsSet.add(JSON.stringify(splice.object[i]));
            }

            splice.removed.forEach(removed => this.embedsSet.delete(JSON.stringify(removed)))
        });
    }

    _observeEmbeds(embeds) {
        this._updateEmbedsSet(embeds);
    }

    _updateEmbedsSet(embeds) {
        if (!embeds) return;
        this.embedsSet.clear();
        embeds.forEach(embed => this.embedsSet.add(JSON.stringify(embed)));
    }

    _onEmbedRemove(e) {
        this.splice('embeds', e.currentTarget.index, 1);
    }
}

window.customElements.define('moe-form-video-embeds', MoeFormVideoEmbeds);