import {html, PolymerElement} from "@polymer/polymer/polymer-element";

import '@polymer/paper-button';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/image-icons';
import '@polymer/iron-icon'
import '@polymer/iron-flex-layout/iron-flex-layout';

class MoeFileButton extends PolymerElement {

  static get template() {
    return html`
<style>
:host {
    display: inline-block;
}
paper-button {
    width: 100%;
}
input[type=file] {
    position: absolute;
    opacity: 0;
    height: 100%;
    width: 100%;
}
input[type=file]:hover {
    cursor: pointer;
}
iron-icon {
    padding-right: 0.5em;
}
</style>
<paper-button disabled$="[[disabled]]">
    <iron-icon icon="image:photo"></iron-icon>
    <div>圖片</div>
    <input id="file" type="file" accept$="[[accept]]" on-change="_onFileChange" />
</paper-button>
`;
  }

  static get properties() {
    return {
      accept: {
        type: String,
        value: 'image/*'
      },
      file: {
        type: Object,
        notify: true
      },
      fileSelected: {
        type: Boolean,
        computed: '_computeFileSelected(file)',
        notify: true
      },
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    }
      ;
  }

  cancel() {
    this.$.file.value = "";
    this.$.file.dispatchEvent(new Event('change'));
  }

  _onFileChange() {
    const files = this.$.file.files;
    if (files.length > 0) {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          file: files[0]
        }
      }));
      this.set('file', files[0])
    } else {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          file: null
        }
      }));
      this.set('file', null);
    }
  }

  _computeFileSelected(file) {
    return !!file;
  }
}

window.customElements.define('moe-file-button', MoeFileButton);
