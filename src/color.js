import {html} from '@polymer/polymer/lib/utils/html-tag.js';

const template = html`
<custom-style>
  <style is="custom-style">
    html {
        /* http://mcg.mbitson.com/#!?mcgpalette0=%237e1012&themename=futaba */
        --palette-50: rgb(240, 226, 227);
        --palette-100: rgb(216, 183, 184);
        --palette-200: rgb(191, 136, 137);
        --palette-300: rgb(165, 88, 89);
        --palette-400: rgb(145, 52, 54);
        --palette-500: rgb(126, 16, 18);
        --palette-600: rgb(118, 14, 16);
        --palette-700: rgb(107, 12, 13);
        --palette-800: rgb(97, 9, 10);
        --palette-900: rgb(78, 5, 5);
        --palette-A100:rgb(255, 130, 130);
        --palette-A200:rgb(255, 79, 79);
        --palette-A400:rgb(255, 28, 28);
        --palette-A700:rgb(255, 3, 3);

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

        --moe-thread-first-post-background-color: #fffde5;
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
