// ==UserScript==
// @name         Are you sure you want to leave the page?
// @namespace    http://stackexchange.com/users/4337810/
// @version      1.1
// @description  Adds a confirmation dialog to all pages you browser that have an input or textarea in it
// @author       ᔕᖺᘎᕊ (http://stackexchange.com/users/4337810/)
// @match        *://*/*
// @grant        none
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
    var script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0];   

    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js";      		

    if (typeof jQuery=='undefined') {
        head.appendChild(script);
    }

    window.onbeforeunload = function () {   
        if($('textarea').length || $('input').length){
            if($.trim($('textarea').val()) != '' || $.trim($('input').val()) != ''){
                return "Do you really want to navigate away? Anything you have written will be lost!";       
            }
        };
    }
}, false);
