
//  Chrome functions.
chrome.runtime.onMessage.addListener(function(request, sender) { 
    chrome.tabs.update(sender.tab.id, {url: request.redirect});
    chrome.storage.local.set({ "operations": "start_actions"},function() {
        //console.log("Complete!");
     });
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

function redirect(url){
    window.location.href = url;
}

//  Action functions.

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

function selectItemSize(item__size){
    var element = document.querySelector('select[name="size"]');
    console.log(element);
    var opt = $(element).children("option");
    console.log($(opt).length);
    for(var i = 0; i < $(opt).length; i++){
        if($(opt[i]).text() === item__size){    //  Если нужный размер найден.
            $(element).val($(opt[i]).val());
            return true;
        }else{
            if(i === ($(opt).length - 1)){   //  Если нет нужного размера.
                return false;
            }
        }  
    }
}

function selectItemColor(){
    
}
/**
 * Функция поиска страницы предмета, заданного параметрами.
 * @param {string} name Полное имя предмета.
 * @param {string} type Тип предмета (shirts,sweatshirts и т.д.).
 * @param {string} color Строка с цветами. 
 *  Может быть 3х вариаетов: 
 *      1. Any - любой цвет. 
 *      2. Color,Color,.. - только цветов, указанных через запятую.
 *      3. !Color,!Color,.. - любого цвета, кроме указанных через запятую. 
 * @param {integer} flag Флаг разрешения покупки предмета любого цвета, если нет нужного.
 *  Может быть 2 значения.
 *      1. 0 - Запрет (Строго те цвета, которые указаны).
 *      2. 1 - Разрешение (Любого цвета, если заданных нет).
 * @returns {string} href Ссылка на страницу предмета.
 */
function getHref(name,type,color,flag){
    var colors = {};    //  Массив заданных цветов.
    var flag__color = true;    //  True - Любой цвет. False - Заданный.
    if(color !== "Any"){    //  Если список цветов указан.
        //  Разбиваем строку на цвета.
        var flag__color = false;
        var forbiddenColor = {}, resolvedColor = {};
        var f_c = 0;    //  Счетчик запрещенных цветов.
        var r_c = 0;    //  Счетчик разрешенных цветов.
        for(var i = 0; i < color.split(",").length; i++){   //  Перебираем все указанные цвета.
            if((color.split(",")[i]).substr(0,1) === "!"){  //  Запрещенный цвет.
                forbiddenColor[f_c] = (color.split(",")[i]).substr(1);
                f_c++;
            }else{  //  Разрешенный цвет.
                resolvedColor[r_c] = color.split(",")[i];
                r_c++;
            }   
        }
    }
    
    if(!flag__color){
        console.log("forbidden: ", forbiddenColor);
        console.log("resolved: ", resolvedColor);
    }else{
        console.log("Any");
    }
    
    //  Функция поиска ссылки на страницу предмета.
    function findItemHref(){
        //  Парсинг контента страницы и нахождение ссылки.
        var content = document.querySelectorAll('a[class="name-link"]');
        for(var i = 0; i < content.length; i++){    //  Перебор всех названий и цветов.
            if( i % 2 === 0){   //  Все названия.
                console.log(content[i].innerHTML);
            }else{  //  Все цвета.
                
            }
            
        }
        //console.log(content);
    }
    
    
    //  Переходим на страницу типа предмета.
    toSubjectPage("/shop/all/" + type);   //  Go to the subject page.
    //  Дожидаемся загрузки страницы.
    var forced = 0; //  Счетчик ожидания.
    var maxExpired = 50;    //  Максимальное время ожидания. 50 - 5000 мс - 5 с.
    var waiting = setInterval(function(){   //  Ждем прогрузки контента страницы.
        if(document.querySelector('a[class="current"]').href === "http://www.supremenewyork.com/shop/all/jackets"){
            clearInterval(waiting);
            //  Parse content.
            findItemHref();
        }
        if(forced > maxExpired){    //  Если ожидание слишком долгое.
            console.log("The page's wait period has expired.");
            clearInterval(waiting);
        }
        forced++;
    },100);
    
 
}




$(document).ready(function(){
   chrome.storage.local.get(function (storage) {   //  Reading local storage.
    //  Определяем откуда была открыта страница.
        if (storage["operations"] !== undefined) {
            console.log("Start auto actions on page.");
            var settings = storage["settings"];
            var cart = storage["cart"];
            var itemsArray = {};
            //  Достаем предметы из корзины.
            for (var item in cart) {
                if (cart.hasOwnProperty(item)) {
                    itemsArray[item] = {
                        name : cart[item]["name"],
                        type : cart[item]["type"],
                        size : cart[item]["size"],
                        color : cart[item]["color"]
                    };
                }
            }
            //console.log(itemsArray);
            //  Пока для одного предмета.
            //  Параметры необходимого предмета.
            var item__name = itemsArray[0]["name"];
            var item__size = itemsArray[0]["size"];
            var item__color = itemsArray[0]["color"];
            
            
            var sub__href = getHref( itemsArray[0]["name"], itemsArray[0]["type"] , itemsArray[0]["color"] , settings["SelectAnyColor"]); //  Get link on item page.
            //  Start buying items.
            //var sub__href = "/shop/jackets/iqale9x3h/egyxizwn6";
            //toSubjectPage(sub__href);   //  Go to the subject page.
            //setTimeout(function () {   //  Waiting for the page to load.
                //  Sampling parameters of the object.


                //for(var i = 0; i < $().length; i++){

                //}

                /*
                 var action__state = selectItemSize(item__size);   //  Select size.
                 if(!action__state){ //  Если не найдено вещи с подходящим размером.
                 if(settings['SelectAnySize'] === 1){    // Если установлен параметр покупки вещи любого размера.
                 //  Пробуем установить вещь приоритетного размера.
                 var action__state = selectItemSize(settings['PrioritySize']);
                 if(!action__state){
                 console.log("Подходящего размера нет!" , settings['SelectAnySize']);
                 }else{
                 console.log("Установлена вещь приоритетного размера. Размер: " + settings['SelectAnySize']);
                 }
                 }else{
                 console.log("Вещи выбранного размера нет. Завершаем покупку.");
                 }
                 
                 }
                 */
                //var action__state = selectItemColor(item__color);  //  Select color.

            //}, 500);


            //addToBasket(sub__href); //  Add item to basket.
            /*setTimeout(function(){  //  Редирект на стартовую, если в заказе будут еще предметы.
             redirect("http://www.supremenewyork.com/shop/all/");
             },200);
             */


        
        } else {  //  Ничего не делаем. На страницу зашли не из под расширения.
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