import {html} from '@polymer/polymer/lib/utils/html-tag.js';
const template = html`
<custom-style>
  <style is="custom-style">
    html {

        --futaba-red-color: #800000;
        --futaba-pink-color: #f0e0d6;   
        
        --moe-thread-cover-background-color: #fffde5;

        --moe-thread-no-text-color: #ffffff;
        --moe-thread-no-background-color: #0E71B6;
        --moe-thread-no-hover-background-color: #1086da;
        --moe-thread-reply-count-text-color: #ffffff;
        --moe-thread-reply-count-background-color: #579BCC;
        --moe-thread-reply-count-hover-background-color: #73abd4;
        
        --moe-thread-more-replies-button-background-color: #984d4d;
        --moe-thread-more-replies-button-hover-background-color: #af6060;
        --moe-thread-more-replies-button-text-color: #ffffff; 
        
        --moe-thread-firstpost-background-color: #fffde5;
        --moe-thread-reply-odd-background-color: #E7CFC0;
        --moe-thread-reply-even-background-color: #F0E0D6;
        
        --moe-post-header-no-text-color: #ffffff;
        --moe-post-header-no-background-color: #0E71B6;
        --moe-post-header-no-hover-background-color: #1086da;
        --moe-post-header-id-text-color: #909090;
        --moe-post-header-status-text-color: #909090;
        --moe-post-header-date-text-color: #909090;
        
        --moe-post-body-text-color: var(--futaba-red-color);
        --moe-post-action-button-color: #909090;
        --moe-post-quote-text-color: #789922;
        --moe-post-quote-link-color: #0E71B6;
        --moe-post-quote-link-hover-color: #1086da;
        
        --moe-poll-background-color: #fffde5;
        --moe-poll-title-color: var(--futaba-red-color);
        --moe-poll-text-color: var(--futaba-red-color);
        --moe-poll-unvoted-item-background-color: #ffe; 
    }

  </style>
</custom-style>
`;
template.setAttribute('style', 'display: none;');
document.head.appendChild(template.content);
