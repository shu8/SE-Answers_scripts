// ==UserScript==
// @name         Side By Side Editing
// @namespace    http://stackexchange.com/users/4337810/
// @version      1.1
// @description  A userscript that adds the option to have the preview and editor side-by-side when asking/answering questions and when editing existing questions/answers
// @match        *://*.stackexchange.com/*
// @match        *://*.stackoverflow.com/*
// @match        *://*.superuser.com/*
// @match        *://*.serverfault.com/*
// @match        *://*.askubuntu.com/*
// @match        *://*.stackapps.com/*
// @match        *://*.mathoverflow.net/*
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// ==/UserScript==

function sideBySideEditing(itemid) {
    if(itemid === "") {
        itemid = "newAnswer";
    }

    if(sbsExpanded[itemid] == undefined || sbsExpanded[itemid] == false) {  //sbs is off, turn it on
        var toAppend = (itemid === "newAnswer" ? "" : "-" + itemid);  //helps select tags specific to the question/answer being edited (or new answer being written)
        
        $('#sidebar').hide();
            
        if(itemid != "newAnswer") {  //options specific to making edits on existing questions/answers
            $(".votecell").hide();
            $(".hide-preview").css("margin-left","10px");  //not necessary, looks better though
            
            //hack: float nuttiness for "Edit Summary" box
            $("#edit-comment" + toAppend).parent().parent().parent().parent().parent().css("float","left");
            $("#edit-comment" + toAppend).parent().parent().parent().parent().parent().parent().css({"float":"left","margin-left":"20px"});
            
            if(itemid === questionID) {  //hack: float nuttiness for "Tags" box
                $(".tag-editor").parent().css("float","left");
            }

            numOfEditingSBS++;  //to indicate that sbs is enabled for a question/answer edit
        }

        $("#content").width(1360);
        
        $("#post-editor" + toAppend).width(1360);    
        $("#wmd-preview" + toAppend).css({"clear":"none","float":"right"});
        $("#wmd-button-bar" + toAppend).css('float', 'none');
        $("#wmd-input" + toAppend).parent().css('float', 'left');
        
        //stretch the text input window to match the preview length
        //"215" came from trial and error
        previewLength = $("#wmd-preview" + toAppend).height();
        if(previewLength > 215) {  //default input box is 200px tall, only scale if necessary
            $("#wmd-input" + toAppend).height(previewLength - 15);
        }

        if(window.location.pathname.indexOf('questions/ask') > -1) {  //extra CSS for 'ask' page
            $('.wmd-preview').css('margin-top', '10px');
            $(".tag-editor").parent().css("float","left");
        }

        sbsExpanded[itemid] = true;  //to indicate that sbs is enabled for THIS question/answer edit or new answer
    } else { //sbs is on, turn it off
        var toAppend = (itemid === "newAnswer" ? "" : "-" + itemid);  //helps select tags specific to the question/answer being edited (or new answer being written)
            
        if(toAppend.length > 0) {  //options specific to making edits on existing questions/answers
            $(".hide-preview").css("margin-left","-5px");
            
            //hack: float nuttiness for "Edit Summary" box
            $("#edit-comment" + toAppend).parent().parent().parent().parent().parent().css("float","none");
            $("#edit-comment" + toAppend).parent().parent().parent().parent().parent().parent().css({"float":"none","margin-left":"0px"});
            
            if(itemid === questionID) {  //hack: float nuttiness for "Tags" box
                $(".tag-editor").parent().css("float","none");
            }

            numOfEditingSBS--;  //to indicate that sbs is disabled for a question/answer edit
        }
        
        $("#post-editor" + toAppend).width(660);    
        $("#wmd-preview" + toAppend).css({"clear":"both","float":"none"});
        $("#wmd-button-bar" + toAppend).css('float', 'left');
        $("#wmd-input" + toAppend).parent().css('float', 'none');
        
        $("#wmd-input" + toAppend).height(200);

        if(window.location.pathname.indexOf('questions/ask') > -1) {  //extra CSS for 'ask' page
            $('.wmd-preview').css('margin-top', '0px');
            $(".tag-editor").parent().css("float","none");
        }

        sbsExpanded[itemid] = false;  //to indicate that sbs is disabled for THIS question/answer edit or new answer

        if(numOfEditingSBS == 0) {  //sbs is disabled for all question/answer edits
            $(".votecell").show();

            if(sbsExpanded["newAnswer"] == undefined || sbsExpanded["newAnswer"] == false) { //sbs is disabled everywhere
                $("#content").width(1000);
                $('#sidebar').show();
            }
        }
    }
}

function addButton(jNode) {
    var itemid = jNode[0].id.replace( /^\D+/g, '');
    var toAppend = (itemid.length > 0 ? "-" + itemid : "");
    setTimeout(function() {
        var sbsBtn = "<li class='wmd-button' title='side-by-side editing' style='left: 409px;width: 170px;'><div id='wmd-sbs-button" + toAppend + "' style='background-image: none;'>Toggle Side-By-Side Editing</div></li>";
        $('[id=' + jNode[0].id + ']').after(sbsBtn);
        
        $("#wmd-sbs-button" + toAppend).on('click', function() {
            sideBySideEditing(itemid);
        });
        
        //add click listeners for "Save Edits" and "cancel" buttons
        // - also gets added to the "Post New Question" and "Post New Answer" button as an innocuous (I think) side effect
        $("#post-editor" + toAppend).siblings('.[class^="form-submit"]').children().on('click', function() {
            if(sbsExpanded[itemid]) { sideBySideEditing(itemid); }
        });
    }, 1000)
}

//bookkeeping variables
// - numOfEditingSBS is the number of non-new-answer SBS that are currently active
//    - used to keep track of when the vote counters should be hidden
//    - remains set to 0 when asking a new question
// - sbsExpanded is a boolean dictionary using the question/answer IDs (and the string "newAnswer") as keys
//    - used to toggle sbs on/off for particular text input boxes
//    - also makes sense when asking a new question, and is given the value "newAnswer" then for convenience
var numOfEditingSBS = 0;
var sbsExpanded = new Object();

if(window.location.pathname.indexOf("questions/ask") < 0) { //not posting a new question
    //get question and answer IDs for keeping track of the event listeners
    var questionID = $(".question")[0].getAttribute("data-questionid");

    var anchorList = $("#answers").children("a");  //answers have anchor tags before them of the form <a name="#">, where # is the answer ID
    var numAnchors = anchorList.length;
    var itemIDs = [];

    for(i = 1; i <= numAnchors-2; i++) {  //the first and last anchors aren't answers
        itemIDs.push(anchorList[i].name);
    }

    //event listeners for adding the sbs toggle buttons for editing existing questions or answers
    waitForKeyElements("#wmd-redo-button-" + questionID, addButton);

    for(i = 0; i <= numAnchors-3; i++) {
        waitForKeyElements("#wmd-redo-button-" + itemIDs[i], addButton);
    }
}

//event listener for adding the sbs toggle button for posting new questions or answers
waitForKeyElements("#wmd-redo-button", addButton);