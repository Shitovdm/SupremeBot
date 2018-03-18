
var GLOBAL__ITEMS_COUNTER = 0;  //  Счетчик предметов, по нему определяем какой предмет вытаскивать из корзины.
var GLOBAL__CARD_COUNTER = 0;  //  Счетчик карт.
var GLOBAL__LOG = new Array();
var GLOBAL__LAP_FLAG = false;
var GLOBAL__ITEMS_ARRAY = {};
var GLOBAL__SETTINGS = {};
var GLOBAL__CARDS = {};
var GLOBAL__MATCHING_ARRAY = {};

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
        //  A handler called preventDefault.
    }else{
       //   None of the handlers called preventDefault.
    }
}

function redirect(url){
    window.location.href = url;
}

//  Action functions.

function addToBasket(sub__href){
    addToLog("Adding to basket.");
    var element = document.querySelector('input[value="add to basket"]');
    simulateClick(element);
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
 * @returns {Boolean}
 */
function selectItemSize(established__size){
    //  Выбор размера, установленного пользователем.
    var sizes = document.querySelector('select[name="size"]');
    var item__size__code = choiceSize(sizes, established__size);
    if(item__size__code !== false){   //  Если размер был найден.
        //  Выбираем его на странице.
        $(sizes).val(item__size__code); //  Устанавливаем в выпадающем списке.
        var resp = $(sizes).children('option[value="' + item__size__code + '"]').text();
        addToLog("Selected size : " + resp);
        return true;    //  Возвращмем выбранный размер.
     }else{
         return false;
     }
    
    function choiceSize(sizes, established__size){
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
        if(GLOBAL__SETTINGS["SelectAnySize"] === 1){    //  Если в настройках установлена галочка выбора любого размера.
            addToLog("The size is selected based on the settings.");
            return pure__sizes["0"]["code"];
        }else{
            addToLog("The size is not selected, because there is no fixed size!");
            return false;
        } 
    } 
}

/**
 * Функция добавления записи о совершенном действии в лог.
 * @param {string} note 
 * @returns {undefined}
 */
function addToLog(note){
    console.log(note);
    GLOBAL__LOG.push(note);
}

/**
 * Функция перехода на конечную страницу вывода результата работы.
 * @returns {undefined}
 */
function toLogPage(){
    addToLog("redirect to log page...");
    console.log(GLOBAL__LOG);
    chrome.storage.local.set({ "log" :  GLOBAL__LOG} , function(){});
    chrome.runtime.sendMessage({redirect: "/log.html"});
}


/**
 * Функция перехода на страницу типа предмета.
 * @param {string} sub__href
 * @returns {undefined}
 */
function toTypePage(sub__href){
    addToLog("Go to type page: " + sub__href);
    var what = document.querySelector('a[href="' + sub__href + '"]'); 
    if(what === null){  //  Если предмет был добавлен в корзину, то переходим через основную страницу.
        console.log("7787");
        var what = document.querySelector('a[href="http://www.supremenewyork.com/shop/all"]'); 
        simulateClick(what);
        
    }else{
        simulateClick(what);
    }
}

/**
 * Функция поиска страницы предмета, заданного параметрами.
 * @param {object} data Массив со следующими параметрами.
 * 1. name Полное имя предмета.
 * 2. type Тип предмета (shirts,sweatshirts и т.д.).
 * 3. colors Строка с цветами. 
 *  Может быть 3х вариаетов: 
 *      1. Any - любой цвет. 
 *      2. Color,Color,.. - только цветов, указанных через запятую.
 *      3. !Color,!Color,.. - любого цвета, кроме указанных через запятую. 
 * 4. flag Флаг разрешения покупки предмета любого цвета, если нет нужного.
 *  Может быть 2 значения.
 *      1. 0 - Запрет (Строго те цвета, которые указаны).
 *      2. 1 - Разрешение (Любого цвета, если заданных нет).
 * size    Установленные пользователем размеры предмета.
 * @returns {string} href Ссылка на страницу предмета.
 */
function actionsOnTypePage(data){
    var foundItems = {};
    var name = data["name"];
    var type = data["type"];
    var size = data["size"];
    var colors = data["colors"];
    //  Исключение названия типа.
    if(type === "tops"){
        type = "tops_sweaters";
    }
    //  Переходим на страницу типа предмета.
    toTypePage("/shop/all/" + type);   //  Go to the subject page.
    if(document.querySelector('span[itemprop="price"]')){   //  Если переход осуществляется со страницы предмета.
        console.log("On item page...");
        //  Дожидаемся загрузки страницы.
        var forced_w = 0; //  Счетчик ожидания.
        var maxExpired = 50;    //  Максимальное время ожидания. 50 - 5000 мс - 5 с.
        var waiting = setInterval(function(){   //  Ждем прогрузки контента страницы.
            if(document.querySelector('a[class="current"]') !== null){
                clearInterval(waiting);
                toTypePage("/shop/all/" + type);   //  Go to the subject page.
                var forced = 0; //  Счетчик ожидания.
                var InnerWaiting = setInterval(function(){   //  Ждем прогрузки контента страницы.
                    if(document.querySelector('a[class="current"]').href === "http://www.supremenewyork.com/shop/all/" + type){
                        clearInterval(InnerWaiting);
                        //  Parse content.
                        foundItems = findItemsByName(name); //  Массив объектов отобранных по имени предметов.
                        var href__array = сolorSelection(colors, foundItems);   //  Получение ссылок на подходящие предметы.
                        var coi = 0;
                        for(var g in href__array){
                            if(href__array.hasOwnProperty(g)){
                                coi++;
                            }
                        }
                        addToLog("Found " + coi + " items.");
                        actionsOnItemPage(href__array, size);
                    }
                    if(forced > maxExpired){    //  Если ожидание слишком долгое.
                        addToLog("The page's wait period has expired.");
                        console.log("waiting 2");
                        clearInterval(InnerWaiting);
                        return false;
                    }
                    forced++;
                },100);
            }
            if(forced_w > maxExpired){    //  Если ожидание слишком долгое.
                addToLog("The page's wait period has expired.");
                console.log("waiting 1");
                clearInterval(waiting);
                return false;
            }
            forced_w++;         
        },100);
    }else{  //  Если переход осуществляется из /all.
        //  Дожидаемся загрузки страницы.
        var forced = 0; //  Счетчик ожидания.
        var maxExpired = 50;    //  Максимальное время ожидания. 50 - 5000 мс - 5 с.
        var waiting = setInterval(function(){   //  Ждем прогрузки контента страницы.
            if(document.querySelector('a[class="current"]').href === "http://www.supremenewyork.com/shop/all/" + type){
                clearInterval(waiting);
                //  Parse content.
                foundItems = findItemsByName(name); //  Массив объектов отобранных по имени предметов.
                var href__array = сolorSelection(colors, foundItems);   //  Получение ссылок на подходящие предметы.
                var coi = 0;
                for(var g in href__array){
                    if(href__array.hasOwnProperty(g)){
                        coi++;
                    }
                }
                addToLog("Found " + coi + " items.");
                actionsOnItemPage(href__array, size);
            }
            if(forced > maxExpired){    //  Если ожидание слишком долгое.
                addToLog("The page's wait period has expired.");
                clearInterval(waiting);
                return false;
            }
            forced++;
        },100);
    }
    
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

/**
 * Функция выполнения всех действий на странице предмета.
 * Выбирает размер, добавляет в корзину, возвращается к началу рекурсивного алгоритма.
 * @param {type} href__array    Массив ссылок на странице предметов, найденных в магазине, исходя из названия и цвета.
 * @param {string} established__size Строка с выбранными размерами.
 * @returns {undefined}
 */
function actionsOnItemPage(href__array, established__size){
    for(var obj in href__array){    //  Перебираем все найденные предметы.
        if(href__array.hasOwnProperty(obj)){
            var container = document.querySelector('a[href="' + href__array[obj] + '"]');
            if($(container).children("div").text().toString().replace(/\s/g, '') !== "soldout"){    //  Проверяем наличие предмета в магазине.
                //  Действия на странице предмета.
                toSubjectPage(href__array[obj]);   //  Go to the subject page.
                addToLog("Go to item page: " + href__array[obj]);
                //  Задержка подгрузки страницы.
                var forced = 0, maxExpired = 30;
                var waiting = setInterval(function(){   //  Ждем прогрузки контента страницы выбранного предмета.
                    if(document.querySelector('span[itemprop="price"]')){   //  Если страница загрузилась.
                        clearInterval(waiting);
                        //  Если предмета еще нет в корзине.
                        if(document.querySelector('input[value="add to basket"]')){ //  Если есть кнопка добавления в корзину.
                            //  Выбор размера.
                            var size__flag = selectItemSize(established__size);
                            if(size__flag !== false){
                                //  Добавление в корзину.
                                addToBasket(href__array[obj]);
                                setTimeout(function(){
                                    startActions(); //  Переход к другим предметам.
                                },500);
                            }else{
                                //  Размер не был выбран.
                                addToLog("Size was not selected.");
                                startActions(); //  Переход к другим предметам.
                            }
                        }else{
                            addToLog("The item is already in the basket.");
                        } 
                    }
                    if(forced > maxExpired){    //  Если ожидание слишком долгое.
                        addToLog("The page's wait period has expired.");
                        clearInterval(waiting);
                    }
                    forced++;
                },100);
                break;
            }else{  //  Все экземпляры предмета раскуплены.
                addToLog("All copies of the item are sold out.");
                startActions(); //  Переход к другим предметам.
                break; 
            }
        }
    }  
}

/**
 * Функция обработки страницы chrckout.
 * @returns {undefined}
 */
function Checkout__Payment(){
    //  Заполнение формы.
    formFilling();
    console.log(GLOBAL__CARD_COUNTER);
    console.log(GLOBAL__CARDS[GLOBAL__CARD_COUNTER]);
    /**
     * Функция заполнения всех полей на странице checkout.
     * @returns {undefined}
     */
    function formFilling(){
        addToLog("Form filling...");
        //  Common.
        fillingField("order_billing_name", "fullName");
        fillingField("order_email", "email");
        fillingField("order_tel", "tel");
        fillingField("bo", "address");
        fillingField("oba3", "address2");
        fillingField("order_billing_address_3", "address3");
        fillingField("order_billing_city", "city");
        fillingField("order_billing_zip", "postcode");
        fillingField("order_billing_country", "country", "drop-list");
        //  Payment.
        fillingField("credit_card_type", "cardType", "drop-list");
        fillingField("cnb", "cardNumber", "nonfloating");
        fillingField("credit_card_month", "cardMonth", "drop-list");
        fillingField("credit_card_year", "cardYear", "drop-list");
        fillingField("vval", "cardCVV", "nonfloating");
        //  Confirmation terms.
        var selector = document.querySelector('input[name="order[terms]"]');
        simulateClick(selector); 
    }
    
    /**
     * Функция заполнения поля ввода.
     * @param {string} fieldID  ID поля ввода.
     * @param {string} fieldName    Название поля из в локальном хранилище.
     * @param {string} fieldType    Особые флаги. Определяют положение текста в поле ввода или тип поля.
     * @returns {undefined}
     */
    function fillingField(fieldID, fieldName, fieldType){
        if( (fieldType === "drop-list") || (fieldType === "nonfloating") ){   //  If Drop-down list.
            $("#" + fieldID).val(GLOBAL__CARDS[GLOBAL__CARD_COUNTER][fieldName]);
        }else{  //  Обычное поле.
            if(GLOBAL__CARDS[GLOBAL__CARD_COUNTER][fieldName] !== ""){
                $("#" + fieldID).val(GLOBAL__CARDS[GLOBAL__CARD_COUNTER][fieldName]);
                $("#" + fieldID).addClass("floating");
                $("#" + fieldID).parent("div").children("label").addClass("floating");
            }
        } 
    }
    
    /**
     * Функция обработки ответа магазина на попытку произвести оплату покупки.
     * @returns {undefined}
     */
    function getResponse(){
        
    }
    
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.windows.create({ 
            url: "http://www.google.com/",
            width:  430,
            height: 150,
            top:    0,
            left:   0
        }, function(win) {
            chrome.windows.update(tab.windowId, { focused: true });
        });
    });
    
}

/**
 * Функция редиректа на страницу checkout.
 * @returns {undefined}
 */
function goToCheckOutPage(){
    chrome.storage.local.set({"checkout": "start_actions"}, function (){}); // Указываем место, откуда был сделан редирект на страницу checkout.
    addToLog("Go to checkout page.");
    var selector = document.querySelector('a[href="https://www.supremenewyork.com/checkout"]');
    simulateClick(selector); 
}


/**
 * Прослойка рекурсивного алгоритма обхода всех предметов и карт.
 * Выполняет функцию вызова основного алгоритма перебора и поиска.
 * @returns {undefined}
 */
function stub(){
    console.log(GLOBAL__LAP_FLAG, GLOBAL__CARD_COUNTER, GLOBAL__ITEMS_COUNTER);
    var CURRENT__ITEM = GLOBAL__ITEMS_ARRAY[GLOBAL__MATCHING_ARRAY[GLOBAL__CARD_COUNTER]][GLOBAL__ITEMS_COUNTER];
    addToLog("Processing of the object: ", CURRENT__ITEM["name"]);
    actionsOnTypePage( {
        "name": CURRENT__ITEM["name"],
        "type": CURRENT__ITEM["type"],
        "size": CURRENT__ITEM["size"],
        "colors": CURRENT__ITEM["color"]
    });
}

/**
 * Функция является частью рекурсивного алгоритма перебора всех предметов в корзине.
 * Выполняет инкрементирующую функцию. Перевыми перебираются предметы на карте, затем карты.
 * @returns {Boolean} Если предметов больше нет, возвращает false;
 */
function startActions(){
    if(!GLOBAL__LAP_FLAG){  //  Вход.
        //  Предусматривает наличие хотя бы 1й карты и 1 предмета на ней.
        stub();
        GLOBAL__LAP_FLAG = true;
    }else{  //  Последующие.
        if(GLOBAL__ITEMS_ARRAY[GLOBAL__MATCHING_ARRAY[GLOBAL__CARD_COUNTER]][GLOBAL__ITEMS_COUNTER + 1] !== undefined) {   //  Если есть еще предметы на данной карте.
            GLOBAL__ITEMS_COUNTER++;    //  Переход к следующему предмету на карте.
            stub();
            
            
        }else{  //  Предметов на карте нет, переходим к оплате. Переход к следующей карте.
            
            //  Удаление из корзины уже купленных предметов.
            
            //  Запоминаем все глобальные переменные.
            
            //  Запоминаем номер карты, с которой производить оплату.
            chrome.storage.local.set({ "currentCard": GLOBAL__CARD_COUNTER},function() {});
            
            //  Checkout and payment.
            goToCheckOutPage();
            /*
            if(GLOBAL__ITEMS_ARRAY[GLOBAL__MATCHING_ARRAY[GLOBAL__CARD_COUNTER + 1]] !== undefined){    //  Если есть еще одна карта.
                addToLog("Card number " + GLOBAL__CARD_COUNTER + " worked.");
                GLOBAL__CARD_COUNTER++; //  Переход к следующей карте.
                GLOBAL__ITEMS_COUNTER = 0;  // К первому предмету на карте.
            }else{  // Карт больше нет, выход.
                //  LOG;
                console.log("Items ended!");
                //toLogPage();
                return false;
            }*/
            
        }
    }
    
}

/**
 * При загрузке выполняется чтение локального хранилища, достаются массивы: корзины и настроек.
 * Массив корзины перестраивается по первичному ключу id карты.
 * Добавляется массив сопоставления ключа и id карты.
 */
$(document).ready(function () {
    chrome.storage.local.get(function (storage) {   //  Reading local storage.
        if (window.location.href === "https://www.supremenewyork.com/checkout") {   //  Если это страница checkout.
            if(storage["checkout"] !== undefined){    //  Определяем откуда открыта страница.
                // Перестройка массива с платежными картами.
                GLOBAL__CARD_COUNTER = storage["currentCard"];
                var cardsArray = storage["card"];
                var card_counter = 0;
                for (var card in cardsArray) {
                    if (cardsArray.hasOwnProperty(card)) {
                        GLOBAL__CARDS[card_counter] = cardsArray[card];
                        card_counter++;
                    }
                }
                console.log(GLOBAL__CARDS);
                
                
                
                
                
                Checkout__Payment();
            }else{
                console.log("No auto checkout!");
            }
        chrome.storage.local.remove( "checkout", function() {
            //console.log('Operations array removed');
        });
        } else {
            if (storage["operations"] !== undefined) {  //  Определяем откуда была открыта страница. Скрипт запускается только при редиректе со страницы options.
                // Инициализация лога.
                chrome.storage.local.set({"log": {}}, function () {
                    addToLog("Initialize log page.");
                    addToLog("Reading cart and arranging the arrays.");
                    GLOBAL__SETTINGS = storage["settings"];
                    var cardsArray = storage["card"];

                    // Перестройка массива с платежными картами.
                    var card_counter = 0;
                    for (var card in cardsArray) {
                        if (cardsArray.hasOwnProperty(card)) {
                            GLOBAL__CARDS[card_counter] = cardsArray[card];
                            card_counter++;
                        }
                    }
                    console.log(GLOBAL__CARDS);

                    var cart = storage["cart"], cardItems__counter = {};
                    for (var item in cart) {
                        if (cart.hasOwnProperty(item)) {
                            // Сортировка по id карты.
                            if (cardItems__counter[cart[item]["card"]] !== undefined) {
                                cardItems__counter[cart[item]["card"]] += 1;
                            } else {
                                cardItems__counter[cart[item]["card"]] = 0;
                            }
                            if (GLOBAL__ITEMS_ARRAY[cart[item]["card"]] !== undefined) {   //  Если в глобальном массиве уже есть эта карта.
                                GLOBAL__ITEMS_ARRAY[cart[item]["card"]][cardItems__counter[cart[item]["card"]]] = {
                                    name: cart[item]["name"],
                                    type: cart[item]["type"],
                                    size: cart[item]["size"],
                                    color: cart[item]["color"]
                                };
                            } else {
                                GLOBAL__ITEMS_ARRAY[cart[item]["card"]] = {
                                    0: {
                                        name: cart[item]["name"],
                                        type: cart[item]["type"],
                                        size: cart[item]["size"],
                                        color: cart[item]["color"]
                                    }
                                };
                            }
                        }
                    }
                    //  Сопоставление ключа и id карты.
                    var matching_counter = 0;
                    for (var card in GLOBAL__ITEMS_ARRAY) {
                        if (GLOBAL__ITEMS_ARRAY.hasOwnProperty(card)) {
                            GLOBAL__MATCHING_ARRAY[matching_counter] = card;
                            matching_counter++;
                        }
                    }
                    addToLog("Start auto actions on page.");
                    startActions(); 
                });
            } else {  //  Ничего не делаем. На страницу зашли не из под расширения.
                console.log("Inactivity.");
            }
        }

    });
    //  Удаление массива операций, сделано для того, чтобы при каждом посещении страницы магазина самопроизвольно не запускался скрипт расширения.
     chrome.storage.local.remove( "operations", function() {
     //console.log('Operations array removed');
     });

});