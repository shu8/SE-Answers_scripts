// ==UserScript==
// @name         URL deobfuscater
// @namespace    http://stackexchange.com/users/4337810/
// @version      1.0
// @description  A userscript that lets you quickly copy a cleaned-up version of the current URL
// @author       ᔕᖺᘎᕊ (http://stackexchange.com/users/4337810/)
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.onkeyup = function(e) {
        if(e.ctrlKey && e.shiftKey && (e.keyCode == 117 || e.keyCode == 85)) {
            window.prompt('Press Ctrl+C/Ctrl+X', location.protocol + '//' + location.hostname + location.pathname);
        }
    };
})();
