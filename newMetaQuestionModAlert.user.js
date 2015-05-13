// ==UserScript==
// @name         Meta new question alert
// @namespace    http://stackexchange.com/users/4337810/
// @version      1.0
// @description  Adds an extra mod button to the topbar to alert you of new meta questions
// @author       ᔕᖺᘎᕊ (http://stackexchange.com/users/4337810/)
// @match        *://*.stackexchange.com/*
// @match        *://*.stackoverflow.com/*
// @match        *://*.superuser.com/*
// @match        *://*.serverfault.com/*
// @match        *://*.askubuntu.com/*
// @match        *://*.stackapps.com/*
// @match        *://*.mathoverflow.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==
var metaName = 'meta.' + $(location).attr('hostname').split('.')[0];
var apiLink = "https://api.stackexchange.com/2.2/questions?pagesize=5&order=desc&sort=activity&site=" + metaName;

$('.topbar-links').prepend('<span id="mod-extra-icon" class="reputation links-container" style="font-size: 2em; vertical-align: top; padding-top: 3px; color: white;">♦</span>');
$('.js-topbar-dialog-corral').prepend('<div class="topbar-dialog help-dialog js-help-dialog dno" id="newMetaQuestionsDialog" style="top: 34px; left: 380px; display: none;">\
<div class="modal-content" id="newMetaQuestionsList"><span id="closeNewQuestionList" style="float:right">x</span>\
<ul>\
<li>\
<a>No new questions!<span class="item-summary">\
No new meta questions!</span>\
</a>\
</li>\
</ul>\
</div>\
</div>')

$('#mod-extra-icon').css('cursor', 'pointer').click(function() {
    $('#newMetaQuestionsDialog').show();
});
$('#closeNewQuestionList').css('cursor', 'pointer').click(function() {
    $('#newMetaQuestionsDialog').hide();
});

$.getJSON(apiLink, function(json) {
    var latestQuestion = json.items[0].title;
    if(latestQuestion == GM_getValue("metaNewQuestionAlert-lastQuestion")) {
        //if you've already seen the stuff
        $('#mod-extra-icon').css('color', 'white');
    } else { 
        $('#newMetaQuestionsList ul').text("");
        $('#mod-extra-icon').css('color', 'red');
        
        for(i=0;i<json.items.length;i++){
            var title = json.items[i].title,
                link = json.items[i].link,
                author = json.items[i].owner.display_name;
            $('#newMetaQuestionsList ul').append("<li><a href='"+link+"'>"+title+"<br>("+author+")</a>");
        }
        $('#mod-extra-icon').css('cursor', 'pointer').click(function() {
            GM_setValue("metaNewQuestionAlert-lastQuestion", latestQuestion);
        });
    }
});
