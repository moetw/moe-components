import {html} from '@polymer/polymer/lib/utils/html-tag.js';

const template = html`
<custom-style>
  <style is="custom-style">
    html {            
        /***************/
        /* Theme Mixin */
        /***************/
        
        --moe-replies-classic-styles: {
            align-items: flex-start;
        };
        --moe-reply-classic-styles: {
            margin: 3px 0 0 0;
        };
    }
  </style>
</custom-style>
`;
template.setAttribute('style', 'display: none;');
document.head.appendChild(template.content);

