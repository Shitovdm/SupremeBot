
var GLOBAL__ITEMS_COUNTER = 0;  //  Счетчик предметов, по нему определяем какой предмет вытаскивать из корзины.

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
    //var waiting = setInterval(function(){
       // if(window.location.href == "http://www.supremenewyork.com" + sub__href){
            console.log("Adding to basket.");
            var element = document.querySelector('input[value="add to basket"]');
            simulateClick(element);
           // clearInterval(waiting);
     //   }
    //},500); 
}

function checkOut(){
    setTimeout(function(){
        var selector = document.querySelector('a[href="https://www.supremenewyork.com/checkout"]');
        simulateClick(selector); 
    },200);   
}



function toSubjectPage(sub__href){
    var what = document.querySelector('a[href="' + sub__href + '"]'); 
    simulateClick(what);
}

/**
 * 
 * @param {type} established__size
 * @param {type} settings
 * @returns {Boolean}
 */
function selectItemSize(established__size, settings){
    //  Выбор размера, установленного пользователем.
    var sizes = document.querySelector('select[name="size"]');
    var item__size__code = choiceSize(sizes, established__size, settings);
    if(item__size__code !== false){   //  Если размер был найден.
        //  Выбираем его на странице.
        $(sizes).val(item__size__code); //  Устанавливаем в выпадающем списке.
        var resp = $(sizes).children('option[value="' + item__size__code + '"]').text();
        console.log("Selected size : ", resp);
        return true;    //  Возвращмем выбранный размер.
     }else{
         return false;
     }
    
    function choiceSize(sizes, established__size, settings){
        var pure__sizes = {};
        
        //  Если у предмета нет параметров выбора размера.
        
        
        
        //  Выбор всех размеров со страницы.
        var sizes__array = $(sizes).children("option");
        for(var i = 0; i < $(sizes__array).length; i++){
            pure__sizes[i] = {
                label: $(sizes__array[i]).text(),
                code: $(sizes__array[i]).val()
            };  
        }
        
        //  Разбитие строки размеров, указанной пользователем.
        var established__array = {};
        for(var i = 0; i < established__size.split(",").length; i++){   //  Перебираем все указанные цвета.
            established__array[i] = established__size.split(",")[i];
        }
        
        //  Сопоставление и поиск нужного размера.
        //  Перебираем все указанные размеры в порядке указанного приоритета.
        for(var size in established__array){    //  Перебор все введенных размеров.
            if(established__array.hasOwnProperty(size)){ 
                for(var present_size in pure__sizes){   //  Перебор всех размеров в наличии.
                    if(pure__sizes.hasOwnProperty(present_size)){
                        if(established__array[size].toString().replace(/\s/g, '') === pure__sizes[present_size]["label"].toString().replace(/\s/g, '')){
                            //  Если найден размер. Возвращаем его код.
                            return pure__sizes[present_size]["code"];
                        }
                    }
                }
            }
        }
        //  Если размер не выбран из установленных:
        //  Если стоит галочка в настройках, установки любого рамера из присутствующих, если не найден указанный;
        //  Выбираем наименьший размер из присутствующих.
        console.log("The size is not selected, because there is no fixed size!");
        if(settings["SelectAnySize"] === 1){    //  Если в настройках установлена галочка выбора любого размера.
            return pure__sizes["0"]["code"];
        }else{
            return false;
        } 
    } 
}



function actionsOnItemPage(href__array, established__size, settings){
    for(var obj in href__array){    //  Перебираем все найденные предметы.
        if(href__array.hasOwnProperty(obj)){
            console.log("Go to item page: ", href__array[obj]);
            var container = document.querySelector('a[href="' + href__array[obj] + '"]');
            if($(container).children("div").text().toString().replace(/\s/g, '') !== "soldout"){    //  Проверяем наличие предмета в магазине.
                //  Действия на странице предмета.
                toSubjectPage(href__array[obj]);   //  Go to the subject page.
                //  Задержка подгрузки страницы.
                var forced = 0, maxExpired = 30;
                var waiting = setInterval(function(){   //  Ждем прогрузки контента страницы выбранного предмета.
                    if(document.querySelector('span[itemprop="price"]')){   //  Если страница загрузилась.
                        clearInterval(waiting);
                        //  Если предмета еще нет в корзине.
                        if(document.querySelector('input[value="add to basket"]')){ //  Если есть кнопка добавления в корзину.
                            //  Выбор размера.
                            var size__flag = selectItemSize(established__size, settings);
                            if(size__flag !== false){
                                //  Добавление в корзину.
                                addToBasket(href__array[obj]);
                                //  Переход к другим предметам, если они присутствуют.

                            }else{
                                //  Размер не был выбран.

                                //  Переход к другим предметам, если они присутствуют.
                            }
                        }else{
                            console.log("The item is already in the basket.");
                        } 
                    }
                    if(forced > maxExpired){    //  Если ожидание слишком долгое.
                        console.log("The page's wait period has expired.");
                        clearInterval(waiting);
                    }
                    forced++;
                },100);
            }else{  //  Все экземпляры предмета раскуплены.
                console.log("All copies of the item are sold out.");
            }
        }
    }   
}


/**
 * Функция перехода на страницу типа предмета.
 * @param {string} sub__href
 * @returns {undefined}
 */
function toTypePage(sub__href){
    if(window.location.href === "http://www.supremenewyork.com/shop/all/"){
        console.log("Go to type page: ", sub__href);
        var what = document.querySelector('a[href="' + sub__href + '"]'); 
        simulateClick(what);
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
 * @param {string} size    Установленные пользователем размеры предмета.
 * @param {object} settings Массив с настройками.
 * @returns {string} href Ссылка на страницу предмета.
 */
function startActions(name,type,colors,flag, size, settings){
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
            console.log("Found items: ", href__array);
            actionsOnItemPage(href__array, size, settings);
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

function loadLocalStorage(){
    chrome.storage.local.get(function (storage) {
        var settings = storage["settings"];
        var cart = storage["cart"];
        var itemsArray = {};
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

        console.log( itemsArray[GLOBAL__ITEMS_COUNTER]["name"]);
            
        startActions( itemsArray[GLOBAL__ITEMS_COUNTER]["name"], itemsArray[0]["type"] , itemsArray[0]["color"] , settings["SelectAnyColor"], itemsArray[0]["size"], settings);
        
        
    });
}


$(document).ready(function(){
   chrome.storage.local.get(function (storage) {   //  Reading local storage.
    //  Определяем откуда была открыта страница.
        if (storage["operations"] !== undefined) {
            console.log("Start auto actions on page.");
            loadLocalStorage();
            
        
        } else {  //  Ничего не делаем. На страницу зашли не из под расширения.
            console.log("Inactivity.");
        }
    });
    chrome.storage.local.remove( "operations", function() {
        //console.log('Operations array removed');
    });

});