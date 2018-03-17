$(document).ready(function () {
    chrome.storage.local.get(function (storage) {   //  Reading local storage.
        var log = storage["log"];
        if(log !== undefined){
            for(var note in log){
                if(log.hasOwnProperty(note)){
                    $("#log").append("<div><b>> </b><b>" + log[note] + "</b></div>");
                }
            }
        }else{
            $("#log").html("Ops... Page can not be displayed. <b>:(</b>");
        }
        
    });
});