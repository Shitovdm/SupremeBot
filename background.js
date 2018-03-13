
var GLOBAL_FLAG_redirect = false;


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

function redirect(url){
    window.location.href = url;
}

function addToBasket(sub__href){
    var waiting = setInterval(function(){
        if(window.location.href == "http://www.supremenewyork.com" + sub__href){
            var element = document.querySelector('input[value="add to basket"]');
            simulateClick(element);
            clearInterval(waiting);
        }
    },500); 
}

function checkOut(){
    setTimeout(function(){
        var selector = document.querySelector('a[href="https://www.supremenewyork.com/checkout"]');
        simulateClick(selector); 
    },200);   
}

function toSubjectPage(sub__href){
    if(window.location.href == "http://www.supremenewyork.com/shop/all/"){
        var what = document.querySelector('a[href="' + sub__href + '"]'); 
        simulateClick(what);
    }
}

function selectItemSize(){
    var element = document.querySelector('select[name="size"]');
    console.log(element);
    //$(element).val("43400");
    //simulateClick(element);
}

function selectItemColor(){
    
}



chrome.runtime.onMessage.addListener(function(request, sender) { 
    chrome.tabs.update(sender.tab.id, {url: request.redirect});
    

    var operations = "start_actions";
    chrome.storage.local.set({ "operations": operations},function() {
        //console.log("Complete!");
     });
    /*
    var waiting = setInterval(function(){
        console.log(window.location.href);
        if(window.location.href == "http://www.supremenewyork.com/shop/all/"){
            console.log("Complete!");
            clearInterval(waiting);
        }
    },500);    
     */   

    /**/

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



$(document).ready(function(){
    //  Reading local storage.
    chrome.storage.local.get(function(result) {

        //  Определяем откуда была открыта страница.
        if(result["operations"] !== undefined){
            console.log("Start auto actions on page.");
            
            
            
            //  Start buying items.
            var sub__href = "/shop/jackets/iqale9x3h/egyxizwn6";
            toSubjectPage(sub__href);   //  Go to the subject page.
            selectItemSize();   //  Select size.
            //selectItemColor();  //  Select color.
            //addToBasket(sub__href); //  Add item to basket.
            /*setTimeout(function(){  //  Редирект на стартовую, если в заказе будут еще предметы.
                redirect("http://www.supremenewyork.com/shop/all/");
            },200);
            */
            
            
            
        }else{  //  Ничего не делаем. На страницу зашли не из под расширения.
            console.log("Inactivity.");
        }
     });

    //console.log(window.location.href);
    /*if(window.GLOBAL_FLAG_redirect){
        console.log("Страница загружена!");
    }*/
    //chrome.runtime.sendMessage({redirect: "http://www.supremenewyork.com/shop/all/"});

    /*if(window.GLOBAL_FLAG_redirect){
        if(window.location.href == "http://www.supremenewyork.com/shop/all/"){
            var link = "/shop/jackets/iqale9x3h/egyxizwn6";
            var what = document.querySelector('a[href="/shop/jackets/iqale9x3h/egyxizwn6"]');
            console.log(what);   
            //simulateClick(what);
        }
    }*/
    
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
   
   
   
    chrome.storage.local.remove( "operations", function() {
        //console.log('Operations array removed');
    });
    
    

    
});