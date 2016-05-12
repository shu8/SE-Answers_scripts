// ==UserScript==
// @name         URL deobfuscater
// @namespace    http://stackexchange.com/users/4337810/
// @version      1.0.1
// @description  A userscript that lets you quickly copy a cleaned-up version of the current URL
// @author       ᔕᖺᘎᕊ (http://stackexchange.com/users/4337810/)
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.onkeyup = function(e) {
        var x = location.href.split('?')[1].split('&'),
            params = {},
            extra;
        for(var i = 0; i < x.length; i++) {
            var s = x[i].split('=');
            params[s[0]] = s[1];
        }
        //a few standard parameters that many sites use, these are useful, so keep them; https://github.com/shu8/SE-Answers_scripts/issues/4
        if(params.s) {
            extra = 's='+params.s;
        } else if(params.q) {
            extra = 'q='+params.q;
        } else if(params.search) {
            extra = 'search='+params.search;
        } else if(params.query) {
            extra = 'query='+params.query;
        }
        if(e.ctrlKey && e.shiftKey && (e.keyCode == 117 || e.keyCode == 85)) {
            window.prompt('Press Ctrl+C/Ctrl+X', location.protocol + '//' + location.hostname + location.pathname + (extra ? '?' + extra : ''));
        }
    };
})();
