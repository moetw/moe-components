import { html, PolymerElement } from '@polymer/polymer/polymer-element'

import './moe-video'

class MoeEmbeds extends PolymerElement {
  static get template () {
    return html`
<style>
:host {
    display: block;
    width: 100%;
    min-height: 360px;
    max-height: 360px;
}
:host([mobile]) {
    min-height: 200px;
    max-height: 400px;
}
moe-video {
    --moe-video-width: 100%;
    --moe-video-height: 360px;
    --moe-video-mobile-height: 200px;
    --moe-video-mobile-with-list-height: 400px;
}
</style>
<moe-video id="video"></moe-video>
`
  }

  static get properties () {
    return {
      embeds: {
        type: Array,
        observer: '_onEmbedsChange'
      },
      mobile: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    }
  }

  ready () {
    super.ready()
    this._mediaQuery()
    window.addEventListener('resize', () => this._mediaQuery())
  }

  _mediaQuery () {
    this.set('mobile', window.matchMedia('(max-width: 600px)').matches)
  }

  _onEmbedsChange (newValue) {
    const embeds = newValue || []
    if (embeds.length) {
      this.style.display = 'block'
      this.$.video.set('data', embeds.map(embed => JSON.parse(embed.data)))
    } else {
      this.style.display = 'none'
    }
  }
}

window.customElements.define('moe-embeds', MoeEmbeds)
