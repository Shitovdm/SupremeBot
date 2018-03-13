chrome.runtime.onMessage.addListener(function(request, sender) {
    chrome.tabs.update(sender.tab.id, {url: request.redirect});
});

/*
* Функция эмулирует событие нажатия на элемент.
* @param {type} obj
* @returns {undefined}
*/
function simulateClick(obj) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var canceled = !obj.dispatchEvent(evt);

    if(canceled) {
        // A handler called preventDefault  
    }else{
        // None of the handlers called preventDefault
    }
}

function addToBasket(){
    var element = document.querySelector('input[value="add to basket"]');
    simulateClick(element);
}

function checkOut(){
    setTimeout(function(){
        var selector = document.querySelector('a[href="https://www.supremenewyork.com/checkout"]');
        simulateClick(selector); 
    },200);   
}

$(document).ready(function () {

    /*
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
    */
   
   
   
    
    /*var link = "/shop/jackets/iqale9x3h/egyxizwn6";
    var what = document.querySelector('a[href="' + link + '"]');
    if(window.location.href == "http://www.supremenewyork.com/shop/all"){
        console.log("Shop All");
        simulateClick(what);
        var waiting = setInterval(function(){
            console.log(window.location.href);
            if(window.location.href == "http://www.supremenewyork.com" + link){
                addToBasket()
                clearInterval(waiting);
                checkOut();
                
            }
        },500);
        
        
        
    }*/
    

    
});