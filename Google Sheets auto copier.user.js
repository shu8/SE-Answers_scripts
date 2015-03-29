// ==UserScript==
// @name         Google Sheets auto copier
// @namespace    http://stackexchange.com/users/4337810/%E1%94%95%E1%96%BA%E1%98%8E%E1%95%8A
// @version      0.9
// @description  Auto copies cell contents when it is active
// @author       ᔕᖺᘎᕊ (http://stackexchange.com/users/4337810/%E1%94%95%E1%96%BA%E1%98%8E%E1%95%8A)
// @match        *://docs.google.com/spreadsheets/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js
// @grant        GM_setClipboard
// ==/UserScript==

setTimeout(function() {
    $('div[class="cell-input"]').on('click', function() {
        GM_setClipboard($(this).text());
    });
}, 1000);