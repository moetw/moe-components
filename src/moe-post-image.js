import { html, PolymerElement } from '@polymer/polymer'
import '@polymer/iron-image'

class MoePostImage extends PolymerElement {
  static get template () {
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
    z-index: 4;
}
#img {
    display: block;
    margin: auto;
}
</style>
<img id="img" src="[[thumbSrc]]" width="[[thumbWidth]]" height="[[thumbHeight]]" on-mouseover="_onMouseOver" on-mouseout="_onMouseOut" on-mousemove="_onMouseMove" />
<img id="ihover" sizing="contain" />
`
  }

  static get properties () {
    return {
      imageSrc: {
        type: String,
        reflectToAttribute: true
      },
      imageHeight: {
        type: Number,
        reflectToAttribute: true
      },
      imageWidth: {
        type: Number,
        reflectToAttribute: true
      },
      thumbSrc: {
        type: String,
        reflectToAttribute: true
      },
      thumbHeight: {
        type: Number,
        reflectToAttribute: true
      },
      thumbWidth: {
        type: Number,
        reflectToAttribute: true
      },
      ihoverPadding: {
        type: Number,
        value: 40
      }
    }
  }

  _onMouseOver (e) {
    this.$.ihover.style.display = 'block'
    this.$.ihover.src = this.imageSrc
    this._updateIhoverSize(e)
    this._updateIhoverPosition(e)
  }

  _onMouseOut (e) {
    this.$.ihover.src = ''
    this.$.ihover.style.display = 'none'
  }

  _onMouseMove (e) {
    this._updateIhoverSize(e)
    this._updateIhoverPosition(e)
  }

  _updateIhoverSize (e) {
    const imgRect = this.$.img.getBoundingClientRect()
    const doc = window.document.documentElement

    let maxHeight, maxWidth
    maxHeight = doc.clientHeight - this.ihoverPadding * 2
    if (e.clientX < doc.clientWidth / 2) {
      maxWidth = doc.clientWidth - imgRect.right - this.ihoverPadding * 2
    } else {
      maxWidth = imgRect.left - this.ihoverPadding * 2
    }

    let height, width
    if (this.imageWidth > this.imageHeight) {
      width = Math.min(maxWidth, this.imageWidth)
      height = this.imageHeight * (width / this.imageWidth)
    } else {
      height = Math.min(maxHeight, this.imageHeight)
      width = this.imageWidth * (height / this.imageHeight)
    }

    this.$.ihover.height = `${height}`
    this.$.ihover.width = `${width}`
  }

  _updateIhoverPosition (e) {
    const doc = window.document.documentElement
    const ihover = this.$.ihover

    if (e.clientX > doc.clientWidth / 2) {
      ihover.style.left = e.clientX - ihover.offsetWidth - this.ihoverPadding + 'px'
    } else {
      ihover.style.left = e.clientX + this.ihoverPadding + 'px'
    }

    let top = Math.min(Math.max(e.clientY - ihover.offsetHeight / 2, 0), doc.clientHeight - ihover.offsetHeight)
    ihover.style.top = top + 'px'
  }
}

window.customElements.define('moe-post-image', MoePostImage)
