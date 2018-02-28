chrome.runtime.onMessage.addListener(function(request, sender) {
    chrome.tabs.update(sender.tab.id, {url: request.redirect});
});
$(document).ready(function () {
    //alert("NO DROP");
    var href = window.location.href;
    if(href == "http://www.supremenewyork.com/shop/all"){
        console.log("Press on item!");
        //chrome.runtime.sendMessage({redirect: "http://www.supremenewyork.com/shop/all/  jackets"});
        //jackets
        var itemsContainer = $(".inner-article");
        for(var i = 0; i < itemsContainer.length; i++ ){
            console.log();
            if($(itemsContainer[i]).children("a").children().length == 2){
                //  Delete sold-out element.
                $(itemsContainer[i]).parent("article").detach();
            }
        }
        
    }
    
    
    
    /*
     * Функция эмулирует событие нажатия на элемент.
     * @param {type} obj
     * @returns {undefined}
     */
    function simulateClick(obj) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var canceled = !obj.dispatchEvent(evt);
        /*
         
         if(canceled) {
         // A handler called preventDefault
         alert("canceled");
         } else {
         // None of the handlers called preventDefault
         alert("not canceled");
         }
         */
    }
    
    //var what = document.querySelector('a[href="/shop/jackets/fa5uzyo2d/n5m2xirug"]');
    //simulateClick(what);
    
});