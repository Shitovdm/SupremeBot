
//  Chrome functions.
chrome.runtime.onMessage.addListener(function(request, sender) { 
    chrome.tabs.update(sender.tab.id, {url: request.redirect});
    chrome.storage.local.set({ "operations": "start_actions"},function() {
        //console.log("Complete!");
     });
});

function error__Exception(error__desc){
    alert(error__desc);
}


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

function toTypePage(sub__href){
    if(window.location.href === "http://www.supremenewyork.com/shop/all/"){
        var what = document.querySelector('a[href="' + sub__href + '"]'); 
        simulateClick(what);
    }
}

function toSubjectPage(sub__href){
        var what = document.querySelector('a[href="' + sub__href + '"]'); 
        simulateClick(what);
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



function actionsOnItemPage(href__array){
    //console.log(document.querySelector('a[href="' + href__array["0"] + '"]'));
    //toSubjectPage(href__array["0"]);   //  Go to the subject page.
    for(var obj in href__array){    //  Перебираем все найденные предметы.
        if(href__array.hasOwnProperty(obj)){
            var container = document.querySelector('a[href="' + href__array[obj] + '"]');
            if($(container).children("div").text().toString().replace(/\s/g, '') !== "soldout"){    //  Проверяем наличие предмета в магазине.
                //  Действия на странице предмета.
                toSubjectPage(href__array[obj]);   //  Go to the subject page.
                
                
                break;
            }else{
                //  Все экземпляры предмета раскуплены.
            }
        }
    }
    
    
    
}






/**
 * Функция поиска страницы предмета, заданного параметрами.
 * @param {string} name Полное имя предмета.
 * @param {string} type Тип предмета (shirts,sweatshirts и т.д.).
 * @param {string} colors Строка с цветами. 
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
function startActions(name,type,colors,flag){
    var foundItems = {};
    //  Исключение названия типа.
    if(type === "tops"){
        type = "tops_sweaters";
    }
    //  Переходим на страницу типа предмета.
    toTypePage("/shop/all/" + type);   //  Go to the subject page.
    //  Дожидаемся загрузки страницы.
    var forced = 0; //  Счетчик ожидания.
    var maxExpired = 50;    //  Максимальное время ожидания. 50 - 5000 мс - 5 с.
    var waiting = setInterval(function(){   //  Ждем прогрузки контента страницы.
        if(document.querySelector('a[class="current"]').href === "http://www.supremenewyork.com/shop/all/" + type){
            clearInterval(waiting);
            //  Parse content.
            foundItems = findItemsByName(name); //  Массив объектов отобранных по имени предметов.
            var href__array = сolorSelection(colors, foundItems);   //  Получение ссылок на подходящие предметы.
            actionsOnItemPage(href__array);
        }
        if(forced > maxExpired){    //  Если ожидание слишком долгое.
            console.log("The page's wait period has expired.");
            clearInterval(waiting);
            return false;
        }
        forced++;
    },100);
    

    /**
     * Функция находит все цвета предмета, выбирает нужный и возвращает массив с ссылками.
     * @param {string} selectedColor    Строка указанных цветов.
     * @param {object} foundItems   Массив объектов найденных предметов после поиска по имени.
     * @returns {object} Массив ссылок на страницы предметов.
     */
    function сolorSelection(selectedColor, foundItems){
        var selectedColors = {};    //  Массив заданных цветов.
        var flag__color = true;    //  True - Любой цвет. False - Заданный.
        if(selectedColor !== "Any"){    //  Если список цветов указан.
            //  Разбиваем строку на цвета.
            var flag__color = false, f_c = 0, r_c = 0;  //  Счетчик запрещенных/разрешенных цветов.
            var forbiddenColors = {}, resolvedColors = {};
            for(var i = 0; i < selectedColor.split(",").length; i++){   //  Перебираем все указанные цвета.
                if((selectedColor.split(",")[i]).substr(0,1) === "!"){  //  Запрещенный цвет.
                    forbiddenColors[f_c] = (selectedColor.split(",")[i]).substr(1);
                    f_c++;
                }else{  //  Разрешенный цвет.
                    resolvedColors[r_c] = selectedColor.split(",")[i];
                    r_c++;
                }   
            }
        }
        
        var foundColors = {}, hrefArray = {}, colorsAmount = 0;
        //  Строим массив всех существующих цветов.
        for(var i = 0; i < foundItems.length; i++){
            foundColors[i] = foundItems[i].parentElement.parentElement.children[2].children["0"].innerHTML;  
            colorsAmount++;
        }
        //  Выбираем что указано пользователем, а что нет.
        if(flag__color === true){   //  Выбираем все найденные цвета.
            for(var i = 0; i < foundItems.length; i++){
                hrefArray[i] = foundItems[i].parentElement.parentElement.children["0"].attributes[1].value;
            }
        }else{  //  Если цвета указаны точно.
            if(forbiddenColors[0] === undefined){
                if(resolvedColors[0] === undefined){ //  Не указаны ни запрещенные ни разрешенные.
                    return false;
                }else{  //  Разрешенные указаны, запрешенные нет.
                    /**
                     * Перебираем все цвета.
                     * Перебираем указанные цвета.
                     * Ищем в массиве всех цветов, указанные, разрешенные.
                     */
                    var counter = 0;
                    for(var color in foundColors){    //  Перебираем все найденные цвета.
                        if(foundColors.hasOwnProperty(color)){
                            for(var resolved__color in resolvedColors){
                                if(resolvedColors.hasOwnProperty(resolved__color)){
                                    if(foundColors[color] === resolvedColors[resolved__color]){
                                        hrefArray[counter] = foundItems[color].parentElement.parentElement.children["0"].attributes[1].value;
                                        counter++;
                                        break;
                                    }   
                                }
                            } 
                        }
                    }
                }
            }else{
                if(resolvedColors[0] === undefined){   //  Разрешенные не указаны, запрещенные указаны.
                    var counter = 0;
                    for(var color in foundColors){    //  Перебираем все найденные цвета.
                        var c__ = 0, flag = false, contin = true;
                        if(foundColors.hasOwnProperty(color)){
                            for(var forbidden__color in forbiddenColors){
                                if(forbiddenColors.hasOwnProperty(forbidden__color) && (contin)){
                                    if( (foundColors[color].toString().replace(/\s/g, '') === forbiddenColors[forbidden__color].toString().replace(/\s/g, '')) ){
                                        flag = true;
                                        contin = false;
                                        break;
                                    }else{
                                        if(!flag){
                                            if(c__ === (f_c - 1) ){
                                                hrefArray[counter] = foundItems[color].parentElement.parentElement.children["0"].attributes[1].value;
                                                counter++; 
                                            }
                                        }
                                    }  
                                }
                                c__++;
                            } 
                        }
                    }
                }else{  //  Указаны и запрещенные и разрешенные.
                    //  Добавить алгоритм.
                    /**
                     * Построить массив всех присутствующих цветов.
                     * Оставить только разрешенные цвета.
                     * Запретить к выбору запрещенные цвета.
                     */
                }
            }
        }
        return hrefArray; 
    }
    
    
    /**
     * Функция поиска предметов по имени.
     * @param {string} innerName Полное имя предмета.
     * @returns {object} Массив объектов отобранных предметов.
     */
    function findItemsByName(innerName){
        /*  Принцип следующий:
        *  Считываем все названия со страницы типа предмета.
        *  Считаем количество совпадения слов в названии найденного предмкта и разыскиваемого.
        *  Чем больше совпадений, тем больше шанс то что это именно разыскиваемый предмет.
        *  Одинаковое количество совпадений - одинаковые найденные названия.
        *  Чтобы отсеять предметы с одинаковыми словами но не совпадающими, проверяем длинну всего названия после подсчета совпадений.
        */  
        var mainWord__Arr = innerName.split(" ");   //  Массив слов из названия предмета.
        for(var k = 0; k < mainWord__Arr.length; k++){
            mainWord__Arr[k] = mainWord__Arr[k].toString().replace(/\s/g, '');
        }
        var itemWord__Arr = {}, foundItems = new Array();
        var counter = 0;    //  Количество предметов на странице.
        var coincidenceWords__Arr = {}; //  Количество совпадений слов в каждом найденном предмете с розыскиваемым предметом.
        //  Парсинг контента страницы и нахождение ссылки.
        var content = document.querySelectorAll('a[class="name-link"]');
        for(var i = 0; i < content.length; i++){    //  Перебор всех названий и цветов.
            if( i % 2 === 0){   //  Все названия.
                itemWord__Arr = (content[i].innerHTML).split(" "); //    Массив слов найденного предмета.
                //  Находим количество совпадений по словам.
                for(var l = 0; l < itemWord__Arr.length; l++){   //  Перебираем все слова из названия найденного предмета.
                    itemWord__Arr[l] = itemWord__Arr[l].toString().replace(/\s/g, '');
                    for(var k = 0; k < mainWord__Arr.length; k++){ //  Перебираем все слова из названия розыскиваемого предмета.
                        if(mainWord__Arr[k] === itemWord__Arr[l]){   //  Совпадения вложенного слова.
                            if(coincidenceWords__Arr[counter] === undefined){
                                coincidenceWords__Arr[counter] = 1;
                            }else{
                                coincidenceWords__Arr[counter] += 1;
                            }
                        }
                    } 
                }
                //  Количество слов в названии.
                if(itemWord__Arr.length !== mainWord__Arr.length){
                    coincidenceWords__Arr[counter] = 0;  
                }
                counter++;
            }
        }
        //  Выбираем предметы с максимальным количеством совпаденний слов.
        var MAX_coinc = 0;
        for(var y = 0; y < counter; y++){
            if(coincidenceWords__Arr[y] > MAX_coinc){
                MAX_coinc = coincidenceWords__Arr[y];
            }
        }
        //  Сопоставляем и формируем массив объектов предметов, подходящий по назнавию.
        for(var i = 0, j = 0; i < content.length; i = i + 2, j++){
            if(coincidenceWords__Arr[j] === MAX_coinc){
                foundItems.push(content[i]);
            }
        }
        return foundItems;
    }
}




$(document).ready(function(){
   chrome.storage.local.get(function (storage) {   //  Reading local storage.
    //  Определяем откуда была открыта страница.
        if (storage["operations"] !== undefined) {
            console.log("Start auto actions on page.");
            console.log();
            var settings = storage["settings"];
            var cart = storage["cart"];
            var sub__href = {};
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
            
            console.log( itemsArray[0]["name"]);
            
            startActions( itemsArray[0]["name"], itemsArray[0]["type"] , itemsArray[0]["color"] , settings["SelectAnyColor"]);
            
            
           
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