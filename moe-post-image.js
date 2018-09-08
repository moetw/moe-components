import {html, PolymerElement} from "@polymer/polymer";

class MoePostImage extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: inline-block;
    max-width: 100%;
}
#ihover {
    position: fixed;
    left: 0;
    top: 0;
    display: none;
    padding: 0;
    margin: 0;
    z-index: 100;
}
</style>
<img id="img" src="[[thumbSrc]]" width="[[thumbWidth]]" height="[[thumbHeight]]" on-mouseover="_onMouseOver" on-mouseout="_onMouseOut" on-mousemove="_onMouseMove" />
<img id="ihover" />
`;
    }

    static get properties() {
        return {
            imageSrc: {
                type: String
            },
            imageHeight: {
                type: Number
            },
            imageWidth: {
                type: Number
            },
            thumbSrc: {
                type: String
            },
            thumbHeight: {
                type: Number
            },
            thumbWidth: {
                type: Number
            },
            ihoverPadding: {
                type: Number,
                value: 40
            }
        };
    }

    _onMouseOver(e) {
        this.$.ihover.style.display = 'block';
        this.$.ihover.src = this.imageSrc;
        this._updateIhoverSize(e);
        this._updateIhoverPosition(e);
    }

    _onMouseOut(e) {
        this.$.ihover.src = '';
        this.$.ihover.style.display = 'none';
    }

    _onMouseMove(e) {
        window.requestAnimationFrame(() => {
            this._updateIhoverSize(e);
            this._updateIhoverPosition(e);
        });
    }

    _updateIhoverSize(e) {
        const imgRect = this.$.img.getBoundingClientRect();
        const doc = window.document.documentElement;

        this.$.ihover.style.maxHeight = doc.clientHeight - this.ihoverPadding * 2 + "px";

        if (e.clientX < doc.clientWidth / 2) {
            this.$.ihover.style.maxWidth = doc.clientWidth - imgRect.right - this.ihoverPadding * 2 + "px";
        } else {
            this.$.ihover.style.maxWidth = imgRect.left - this.ihoverPadding * 2 + "px";
        }

        console.log(`doc height = ${doc.clientHeight}, doc width = ${doc.clientWidth}`)
    }

    _updateIhoverPosition(e) {
        const doc = window.document.documentElement;
        const ihover = this.$.ihover;

        if (e.clientX > doc.clientWidth / 2) {
            ihover.style.left = e.clientX - ihover.offsetWidth - this.ihoverPadding + "px";
            ihover.style.top = e.clientY - ihover.offsetHeight / 2 + "px";
        } else {
            ihover.style.left = e.clientX + this.ihoverPadding + "px";
            ihover.style.top = e.clientY - ihover.offsetHeight / 2 + "px";
        }

        console.log(e.pageX, e.pageY, ihover.style.left, ihover.style.top);
    }
}

window.customElements.define('moe-post-image', MoePostImage);