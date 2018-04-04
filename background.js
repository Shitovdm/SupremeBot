/**
 * Background script of SupremeBot for Chrome Extension.
 * @author Shitov Dmitry
 * @version 0.5
 */

/*
 * Global constants:
 * GLOBAL__ITEMS_COUNTER - The counter of items when buying from a certain card.
 * GLOBAL__CARD_COUNTER - The counter of payment card.
 * GLOBAL__LOG - Local array of current actions.
 * GLOBAL__LAP_FLAG - Specified flag of first lap.
 * GLOBAL__ITEMS_ARRAY - Array of items participating in auto buying.
 * GLOBAL["SETTINGS"] - Array of settings setup on setting page.(file "/settins.js").
 * GLOBAL__CARDS - Array with data on payment cards.
 * GLOBAL__MATCHING_ARRAY - Array with matching data for convert items array by id key.
 * GLOBAL__TIMEOUT - The maximum time to wait for a page response.
 * GLOBAL__INTERVAl - Interval of page access, while waiting for content.
 */
var GLOBAL = {
    "ITEMS_COUNTER": 0,
    "CARD_COUNTER": 0,
    "ITEMS_ARRAY": {},
    "SETTINGS": {},
    "CARDS": {},
    "LOG": new Array(),
    "LAP_FLAG": false,
    "MATCHING_ARRAY": {},
    "TIMEOUT": 100, //  Equalse 5000 ms (100 segments of 50ms);
    "INTERVAL": 50,
    "LAST_LOCATION": "http://www.supremenewyork.com/shop/all",
    "NEW_LOCATION": "http://www.supremenewyork.com/shop/all"
};

/**
 * All simple and basic functions.
 * @type Class
 */
class BasicFunctions{
    /*
     * Функция эмулирует событие нажатия на элемент.
     * @param {object} obj Элемент, по которому следует сделать клик.
     * @returns {undefined}
     */
    simulateClick(obj) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var canceled = !obj.dispatchEvent(evt);
        if (canceled) {
            //  A handler called preventDefault.
        } else {
            //   None of the handlers called preventDefault.
        }
    }
    
    /**
     * Функция добавления предмета в корзину, эмитация клика на кнопку "Add to backet".
     * @returns {undefined}
     */
    addToBasket(GLOBAL) {
        LogActions.addToLog("Adding to basket.",GLOBAL);
        var element = document.querySelector('input[value="add to basket"]');
        this.simulateClick(element);
    }
    
    /**
     * Функция перехода на страницу предмета.
     * @param {string} sub__href Значимая часть ссылки на страницу.
     * @returns {undefined}
     */
    toSubjectPage(sub__href) {
        var what = document.querySelector('a[href="' + sub__href + '"]');
        this.simulateClick(what);
    }
    
    /**
     * Функция перехода на страницу типа предмета.
     * @param {string} sub__href
     * @returns {undefined}
     */
    toTypePage(sub__href,GLOBAL) {
        // Remember last and new localion.
        GLOBAL["LAST_LOCATION"] = "http://www.supremenewyork.com/shop/all";
        GLOBAL["NEW_LOCATION"] = "http://www.supremenewyork.com" + sub__href;
        //  Save global vars.
        LogActions.addToLog("Redirect to " + sub__href ,GLOBAL);
        console.log("Redirect to " , sub__href);
        chrome.storage.local.set({"GLOBAL": GLOBAL}, function () {
            chrome.storage.local.set({"operations": "start_actions"}, function () { });
            window.location.href = "http://www.supremenewyork.com" + sub__href; // Redirect.
        }); 
    }
        
    
    
        
    /**
     * Прослойка рекурсивного алгоритма обхода всех предметов и карт.
     * Выполняет функцию вызова основного алгоритма перебора и поиска.
     * @returns {undefined}
     */
    stub(GLOBAL) {
        var CURRENT__ITEM = GLOBAL["ITEMS_ARRAY"][GLOBAL["MATCHING_ARRAY"][GLOBAL["CARD_COUNTER"]]][GLOBAL["ITEMS_COUNTER"]];
        //  Исключение названия типа.
        if (CURRENT__ITEM["type"] === "tops") {
            CURRENT__ITEM["type"] = "tops_sweaters";
        }
        //  Redirect to type page.
        this.toTypePage("/shop/all/" + CURRENT__ITEM["type"],GLOBAL);   //  Go to the subject page.
    }

    /**
     * Функция является частью рекурсивного алгоритма перебора всех предметов в корзине.
     * Выполняет инкрементирующую функцию. Первыми перебираются предметы на карте, затем карты.
     * @returns {Boolean} Если предметов больше нет, возвращает false;
     */
    startActions(GLOBAL) {
        if (!GLOBAL["LAP_FLAG"]) {  //  Вход.
            //  Предусматривает наличие хотя бы 1й карты и 1 предмета на ней.
            this.stub(GLOBAL);
            GLOBAL["LAP_FLAG"] = true;
        } else {  //  Последующие.
            if (GLOBAL["ITEMS_ARRAY"][GLOBAL["MATCHING_ARRAY"][GLOBAL["CARD_COUNTER"]]][GLOBAL["ITEMS_COUNTER"] + 1] !== undefined) {   //  Если есть еще предметы на данной карте.
                GLOBAL["ITEMS_COUNTER"]++;    //  Переход к следующему предмету на карте.
                this.stub();
            } else {  //  Предметов на карте нет, переходим к оплате. Переход к следующей карте.

                //  Удаление из корзины уже купленных предметов.

                //  Запоминаем все глобальные переменные.

                //  Запоминаем номер карты, с которой производить оплату.
                chrome.storage.local.set({"currentCard": GLOBAL["CARD_COUNTER"]}, function () {});
                //  Checkout and payment.
                //var checkout_finish = CheckoutActions.goToCheckoutPage();
                // Сохраняем все данные, потому что переменные сбросятся при переходе на формально другую чтраницу.
                chrome.storage.local.set({"log": GLOBAL["LOG"]}, function () {});


                if (GLOBAL["ITEMS_ARRAY"][GLOBAL["MATCHING_ARRAY"][GLOBAL["CARD_COUNTER"] + 1]] !== undefined) {    //  Если есть еще одна карта.

                    //  Редирек к началу.

                    //LogActions.addToLog("Card number " + GLOBAL__CARD_COUNTER + " worked.");
                    //GLOBAL__CARD_COUNTER++; //  Переход к следующей карте.
                    //GLOBAL__ITEMS_COUNTER = 0;  // К первому предмету на карте.
                } else {  // Карт больше нет, выход.
                    console.log("gggggggggggggggg!");
                   /* var forced = 0;
                    var waiting = setInterval(function () {
                        if (checkout_finish) {
                            clearInterval(waiting);
                            console.log("process payment");
                            LogActions.showLogPage();
                        }
                        if (forced > GLOBAL__TIMEOUT) {    //  Если ожидание слишком долгое.
                            LogActions.addToLog("<b class='error'>The payment page is not responding.</b>");
                            clearInterval(waiting);
                            return false;
                        }
                        forced++;
                    }, GLOBAL__INTERVAl);*/
                }
            }
        }
    }
}


/**
 * Class contain all operations with items.
 * @type Class
 */
class ItemsActions{
    /**
     * Функция поиска предметов по имени.
     * @param {string} innerName Полное имя предмета.
     * @returns {object} Массив объектов отобранных предметов.
     */
    findItemsByName(innerName) {
        /*  Принцип следующий:
         *  Считываем все названия со страницы типа предмета.
         *  Считаем количество совпадения слов в названии найденного предмкта и разыскиваемого.
         *  Чем больше совпадений, тем больше шанс то что это именно разыскиваемый предмет.
         *  Одинаковое количество совпадений - одинаковые найденные названия.
         *  Чтобы отсеять предметы с одинаковыми словами но не совпадающими, проверяем длинну всего названия после подсчета совпадений.
         */
        var mainWord__Arr = innerName.split(" ");   //  Массив слов из названия предмета.
        for (var k = 0; k < mainWord__Arr.length; k++) {
            mainWord__Arr[k] = mainWord__Arr[k].toString().replace(/\s/g, '');
        }
        var itemWord__Arr = {}, foundItems = new Array();
        var counter = 0;    //  Количество предметов на странице.
        var coincidenceWords__Arr = {}; //  Количество совпадений слов в каждом найденном предмете с розыскиваемым предметом.
        //  Парсинг контента страницы и нахождение ссылки.
        var content = document.querySelectorAll('a[class="name-link"]');
        for (var i = 0; i < content.length; i++) {    //  Перебор всех названий и цветов.
            if (i % 2 === 0) {   //  Все названия.
                itemWord__Arr = (content[i].innerHTML).split(" "); //    Массив слов найденного предмета.
                //  Находим количество совпадений по словам.
                for (var l = 0; l < itemWord__Arr.length; l++) {   //  Перебираем все слова из названия найденного предмета.
                    itemWord__Arr[l] = itemWord__Arr[l].toString().replace(/\s/g, '');
                    for (var k = 0; k < mainWord__Arr.length; k++) { //  Перебираем все слова из названия розыскиваемого предмета.
                        if (mainWord__Arr[k] === itemWord__Arr[l]) {   //  Совпадения вложенного слова.
                            if (coincidenceWords__Arr[counter] === undefined) {
                                coincidenceWords__Arr[counter] = 1;
                            } else {
                                coincidenceWords__Arr[counter] += 1;
                            }
                        }
                    }
                }
                //  Количество слов в названии.
                if (itemWord__Arr.length !== mainWord__Arr.length) {
                    coincidenceWords__Arr[counter] = 0;
                }
                counter++;
            }
        }
        //  Выбираем предметы с максимальным количеством совпаденний слов.
        var MAX_coinc = 0;
        for (var y = 0; y < counter; y++) {
            if (coincidenceWords__Arr[y] > MAX_coinc) {
                MAX_coinc = coincidenceWords__Arr[y];
            }
        }
        //  Сопоставляем и формируем массив объектов предметов, подходящий по назнавию.
        for (var i = 0, j = 0; i < content.length; i = i + 2, j++) {
            if (coincidenceWords__Arr[j] === MAX_coinc) {
                foundItems.push(content[i]);
            }
        }
        return foundItems;
    }
    
    
    /**
     * Выбор размера, включает перебор всез присутствующих размеров и выбор приоритетного.
     * @param {type} sizes
     * @param {type} established__size
     * @returns {pure__sizes.code|Boolean|pure__sizes0.code}
     */
    choiceSize(sizes, established__size, GLOBAL) {
        var pure__sizes = {};
        //  Если у предмета нет параметров выбора размера. Например кепки или аксессуаров.
        if(sizes !== undefined){
            //  Выбор всех размеров со страницы.
            var sizes__array = $(sizes).children("option");
            for (var i = 0; i < $(sizes__array).length; i++) {
                pure__sizes[i] = {
                    label: $(sizes__array[i]).text(),
                    code: $(sizes__array[i]).val()
                };
            }

            if(established__size === "Any"){    //  Выбираем любой размер.
                return pure__sizes["0"]["code"];    //  Первый попавшийся размер.
            }else{  //  Размер указан явно.
                //  Разбитие строки размеров, указанной пользователем.
                var established__array = {};
                for (var i = 0; i < established__size.split(",").length; i++) {   //  Перебираем все указанные цвета.
                    established__array[i] = established__size.split(",")[i];
                }

                //  Сопоставление и поиск нужного размера.
                //  Перебираем все указанные размеры в порядке указанного приоритета.
                for (var size in established__array) {    //  Перебор все введенных размеров.
                    if (established__array.hasOwnProperty(size)) {
                        for (var present_size in pure__sizes) {   //  Перебор всех размеров в наличии.
                            if (pure__sizes.hasOwnProperty(present_size)) {
                                if (established__array[size].toString().replace(/\s/g, '') === pure__sizes[present_size]["label"].toString().replace(/\s/g, '')) {
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
                if (GLOBAL["SETTINGS"]["SelectAnySize"] === 1) {    //  Если в настройках установлена галочка выбора любого размера.
                    LogActions.addToLog("The size is selected based on the settings.",GLOBAL);
                    return pure__sizes["0"]["code"];
                } else {
                    LogActions.addToLog("This color does not have the required size!",GLOBAL);
                    return false;
                }
            }
        }else{  //  Предмет не имеет размера.
            return true;
        }
    }
    
    /**
     * Функция выбора необходимого размера на странице предмета.
     * @param {type} established__size
     * @returns {Boolean}
     */
    selectItemSize(established__size,GLOBAL) {
        //  Выбор размера, установленного пользователем.
        var sizes = document.querySelector('select[name="size"]');
        var item__size__code = ItemsActions.prototype.choiceSize(sizes, established__size,GLOBAL);
        if (item__size__code !== false) {   //  Если размер был найден.
            if(item__size__code === true){   //  Если у предмета нет размера.
                LogActions.addToLog("Item does not have a size.",GLOBAL);
                return true;
            }else{
                //  Выбираем его на странице.
                $(sizes).val(item__size__code); //  Устанавливаем в выпадающем списке.
                var resp = $(sizes).children('option[value="' + item__size__code + '"]').text();
                LogActions.addToLog("Selected size : " + resp,GLOBAL);
                return true;    //  Отвечаем что размер выбран.
            }
        } else {
            return false;   //  Размера не было найдено.
        }
    }
    
    
    /**
     * Функция выполнения всех действий на странице предмета.
     * Выбирает размер, добавляет в корзину, возвращается к началу рекурсивного алгоритма.
     * @param {type} href__array    Массив ссылок на странице предметов, найденных в магазине, исходя из названия и цвета.
     * @param {string} established__size Строка с выбранными размерами.
     * @returns {undefined}
     */
    actionsOnItemPage(colors__array, foundItems, established__size,GLOBAL) {
        var _proto__selectItemSize = ItemsActions.selectItemSize;
        if(colors__array[0] !== undefined){ //  Если есть хотя бы один цвет предмета.
            //  Переходим на страницу первого найденного предмета.
            var f__href = {};
            for (var i = 0; i < foundItems.length; i++) {   //  Находим ссылку на первый найденный предмет.
                var temp__color = foundItems[i].parentElement.parentElement.children[2].children["0"].innerHTML;
                if(temp__color.toString().replace(/\s/g, '') === colors__array[0].toString().replace(/\s/g, '')){
                    f__href = foundItems[i].parentElement.parentElement.children["0"].attributes[1].value;
                    break;
                }
            }
            
            BasicFunctions.toSubjectPage(f__href);   //  Go to the subject page. 
            
            var forced = 0;
            var waiting = setInterval(function () {   //  Ждем прогрузки контента страницы выбранного предмета.
                if (document.querySelector('span[itemprop="price"]')) {   //  Если страница загрузилась.
                    clearInterval(waiting);
                    //  Находим все ссылки
                    var colors__container = $("#details").children("ul").children("li");
                    //  Строим массив цветов, которые будем проверять.
                    var items_data = {};
                    var soldout__all = true;    //  Пусть все предметы проданы.
                    var color__counter = 0;
                    for (var color in colors__array) {    //  Перебираем все цвета, в отсортированном виде.(которые нам подходят.)
                        if (colors__array.hasOwnProperty(color)) {
                            for (var i = 0; i < colors__container.length; i++) {  //  Перебираем все найденные цвета.
                                if (colors__array[color].toString().replace(/\s/g, '') === $(colors__container[i]).children("a").attr("data-style-name").toString().replace(/\s/g, '')) {
                                    console.log("Найдено соответствие цвета.", colors__array[color]);
                                    items_data[color__counter] = {
                                        "color" : colors__array[color],
                                        "href" : $(colors__container[i]).children("a").attr("href"),
                                        "status" : $(colors__container[i]).children("a").attr("data-sold-out")
                                    };
                                    color__counter++;
                                    //  Если есть еще не проданные предмет.
                                    if( ($(colors__container[i]).children("a").attr("data-sold-out") === "false") && (soldout__all) ){
                                        soldout__all = false;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    //  Если есть не распроданные предметы.
                    if(!soldout__all){  //  Если есть еще не проданные предметы.
                        /*
                         * 
                         */
                        function sniffSizes(i, color){
                            var search__size = setInterval(function () {    //  Если список размеров загружен.
                                if( (document.querySelector('select[name="size"]') !== null) || (document.querySelector('b[class="button in-cart"]') !== null)){
                                    clearInterval(search__size);
                                    //  Счетчик i завершил свою работу.
                                    clearInterval(promise__arr[i]);
                                    promise__arr[i] = 0;   
                                    if(document.querySelector('b[class="button in-cart"]') !== null){   //  Если предмет уже в корзине.
                                        LogActions.addToLog("Item already in the basket!",GLOBAL);
                                        for (var k in promise__arr) {
                                            if (promise__arr.hasOwnProperty(k)) {
                                                if (promise__arr[k] !== 0) {   //  Если интервал еще не удален.
                                                    //  Удаляем интервал.
                                                    clearInterval(promise__arr[k]);
                                                    promise__arr[k] = 0;
                                                    LogActions.addToLog("Delete the check item with color " + only__not_sold_out[k]["color"],GLOBAL);
                                                }
                                            }
                                        }
                                        var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
                                        LogActions.addToLog("The end value of the stopwatch. Timestamp: " + timeStampInMs,GLOBAL);
                                        chrome.storage.local.get("timestamp", function (stor) {
                                            var time_diff = Math.floor(timeStampInMs - stor["timestamp"]);
                                            LogActions.addToLog("Total execution time: " + (time_diff / 1000) + " sec.",GLOBAL);
                                            LogActions.showLogPage(GLOBAL);
                                            // Удаляем 
                                            /*chrome.storage.local.remove("operations", function () {
                                                console.log("Operations removed!");
                                            });*/
                                        });
                                    }else{  //  Если предмета еще нет в корзине.
                                         //  Размер данного цвета считан, ищем совпадения.
                                        var size__flag = ItemsActions.prototype.selectItemSize(established__size, GLOBAL);
                                        if (size__flag){
                                            //  Если нужный размер был выбран, удаляем все последующие таймеры.
                                            for (var k in promise__arr) {
                                                if (promise__arr.hasOwnProperty(k)) {
                                                    if (promise__arr[k] !== 0) {   //  Если интервал еще не удален.
                                                        //  Удаляем интервал.
                                                        clearInterval(promise__arr[k]);
                                                        promise__arr[k] = 0;
                                                        LogActions.addToLog("Delete the check item with color " + only__not_sold_out[k]["color"],GLOBAL);
                                                    }
                                                }
                                            }

                                            //  Цвет выбран.
                                            LogActions.addToLog("Selected color: " + color,GLOBAL);

                                            // Добавляем в корзину.
                                            BasicFunctions.addToBasket(GLOBAL);
                                            
                                            var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
                                            LogActions.addToLog("The end value of the stopwatch. Timestamp: " + timeStampInMs,GLOBAL);
                                            chrome.storage.local.get("timestamp", function (stor) {
                                                var time_diff = Math.floor(timeStampInMs - stor["timestamp"]);
                                                LogActions.addToLog("Total execution time: " + (time_diff / 1000) + " sec.",GLOBAL);
                                                LogActions.showLogPage(GLOBAL);
                                                chrome.storage.local.set({'operations': ""},function(){});
                                                // Удаляем 
                                                /*chrome.storage.local.remove("operations", function () {
                                                    console.log("Operations removed!");
                                                });*/
                                            });
                                        }else{
                                            if(promise__arr[i+1] === undefined){   //  Если это последний проверяемый цвет.
                                                LogActions.addToLog("Fatal! Size was not select!",GLOBAL);
                                                LogActions.showLogPage(GLOBAL);
                                            }
                                        } 
                                    } 
                                }
                            },100);
                        }
                        
                        /**
                         * Функция создания нового счетчика ожидания подгрузки контента страницы.
                         * @param {integer} i Порядковый номер предмета.
                         * @returns {undefined}
                         */
                        function newInterval(i, color) {
                            promise__arr[i] = setInterval(function () {  //  Создаем новый счетчик.
                                if (i === 0) {    //  Если это первый интервал.
                                    BasicFunctions.toSubjectPage(only__not_sold_out[i]["href"]);
                                    if(document.querySelector('p[itemprop="model"]').textContent.toString().replace(/\s/g, '') === (only__not_sold_out[i]["color"]).toString().replace(/\s/g, '')){
                                        console.log(document.querySelector('p[itemprop="model"]').textContent.toString().replace(/\s/g, ''));
                                        sniffSizes(i, color);  //  Читаем список размеров.
                                    }
                                    promise__counter[i] = promise__counter[i] + 1;
                                } else {  //  Если это не первый интервал.(все последующие)
                                    if (promise__arr[i - 1] === 0) {   //  Если предыдущие счетчик уже отработал.
                                        //  Переход на следующую страницу.
                                        BasicFunctions.toSubjectPage(only__not_sold_out[i]["href"]);
                                        if(document.querySelector('p[itemprop="model"]').textContent.toString().replace(/\s/g, '') === (only__not_sold_out[i]["color"]).toString().replace(/\s/g, '')){
                                            console.log(document.querySelector('p[itemprop="model"]').textContent.toString().replace(/\s/g, ''));
                                            sniffSizes(i, color);  //  Читаем список размеров.
                                        }
                                        promise__counter[i] = promise__counter[i] + 1;
                                    }
                                }
                            }, 150);
                        }
                        
                        var promise__counter = {}, promise__arr = {};   //  Массив обещаний и счетчик каждого обещания.
                        var only__not_sold_out = {}; //  Вспомогательный массив номеров не распроданных предметов.
                        var only__not_sold_out_counter = 0;
                        //  Переходим на страницы предметов по цветам проверяем наличие нужного размера.
                        for(var j = 0; j < color__counter; j++){
                            if(items_data[j]["status"] === "false" ){ //  Если не sold out.
                                only__not_sold_out[only__not_sold_out_counter] = items_data[j];
                                promise__counter[only__not_sold_out_counter] = 0;    //  Начальное значения счетчика.
                                newInterval(only__not_sold_out_counter, only__not_sold_out[only__not_sold_out_counter]["color"]);
                                only__not_sold_out_counter++;
                            }else{
                                LogActions.addToLog("Item color " + items_data[j]["color"] + " are sold out!",GLOBAL);
                            }
                        }
                    }else{
                        LogActions.addToLog("Fatal!All items are sold out!",GLOBAL);
                        LogActions.showLogPage(GLOBAL);
                    }
                }
                if (forced > GLOBAL["TIMEOUT"]) {    //  Если ожидание слишком долгое.
                    LogActions.addToLog("<b class='error'>The page's wait period has expired.</b>",GLOBAL);
                    clearInterval(waiting);
                }
                forced++;
            }, GLOBAL["INTERVAL"]);
        }else{
            LogActions.addToLog("Fatal!There are no delicate colors!",GLOBAL);
            LogActions.showLogPage(GLOBAL); 
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
    actionsOnTypePage(data, GLOBAL) {
        var _proto__findItemsByName = this.findItemsByName;
        var _proto__сolorSelection = this.сolorSelection;
        var _proto__actionsOnItemPage = this.actionsOnItemPage;
        var foundItems = {};
        var name = data["name"];
        var type = data["type"];
        var size = data["size"];
        var colors = data["colors"];
        if (document.querySelector('span[itemprop="price"]')) {   //  Если переход осуществляется со страницы предмета.
            //  Дожидаемся загрузки страницы.
            var forced_w = 0; //  Счетчик ожидания.
            var waiting = setInterval(function () {   //  Ждем прогрузки контента страницы.
                if (document.querySelector('a[class="current"]') !== null) {
                    clearInterval(waiting);
                    if (GLOBAL["SETTINGS"]["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                        LogActions.addToLog("Waiting time for response: " + (forced_w * 50) + " ms.",GLOBAL);
                    }
                    BasicFunctions.toTypePage("/shop/all/" + type);   //  Go to the subject page.
                    var forced = 0; //  Счетчик ожидания.
                    var InnerWaiting = setInterval(function () {   //  Ждем прогрузки контента страницы.
                        if (document.querySelector('a[class="current"]').href === "http://www.supremenewyork.com/shop/all/" + type) {
                            clearInterval(InnerWaiting);
                            if (GLOBAL["SETTINGS"]["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                                LogActions.addToLog("Waiting time for response: " + (forced * 50) + " ms.",GLOBAL);
                            }
                            //  Parse content.
                            foundItems = _proto__findItemsByName(name); //  Массив объектов отобранных по имени предметов.
                            var colors__array = _proto__сolorSelection(colors, foundItems,GLOBAL);   //  Получение ссылок на подходящие предметы.
                            var coi = 0;
                            for (var g in colors__array) {
                                if (colors__array.hasOwnProperty(g)) {
                                    coi++;
                                }
                            }
                            LogActions.addToLog("Found " + coi + " suitable items.",GLOBAL);
                            _proto__actionsOnItemPage(colors__array, foundItems, size, GLOBAL);
                        }
                        if (forced > GLOBAL["TIMEOUT"]) {    //  Если ожидание слишком долгое.
                            LogActions.addToLog("<b class='error'>The page's wait period has expired.</b>",GLOBAL);
                            clearInterval(InnerWaiting);
                            return false;
                        }
                        forced++;
                    }, GLOBAL["INTERVAL"]);
                }
                if (forced_w > GLOBAL["TIMEOUT"]) {    //  Если ожидание слишком долгое.
                    LogActions.addToLog("<b class='error'>The page's wait period has expired.</b>",GLOBAL);
                    clearInterval(waiting);
                    return false;
                }
                forced_w++;
            }, GLOBAL["INTERVAL"]);
        } else {  //  Если переход осуществляется из /all.
            //  Дожидаемся загрузки страницы.
            var forced = 0; //  Счетчик ожидания.
            var waiting = setInterval(function () {   //  Ждем прогрузки контента страницы.
                if (document.querySelector('a[class="current"]').href === "http://www.supremenewyork.com/shop/all/" + type) {
                    clearInterval(waiting);
                    //  Parse content.
                    foundItems = _proto__findItemsByName(name); //  Массив объектов отобранных по имени предметов.
                    var colors__array = _proto__сolorSelection(colors, foundItems, GLOBAL);   //  Получение ссылок на подходящие предметы.
                    var coi = 0;
                    for (var g in colors__array) {
                        if (colors__array.hasOwnProperty(g)) {
                            coi++;
                        }
                    }
                    LogActions.addToLog("Found " + coi + " suitable items.",GLOBAL);
                    //  Выводим время ответа сервера.
                    if (GLOBAL["SETTINGS"]["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                        LogActions.addToLog("Waiting time for response: " + (forced * 50) + " ms.",GLOBAL);
                    }
                    _proto__actionsOnItemPage(colors__array, foundItems, size, GLOBAL);
                }
                if (forced > GLOBAL["TIMEOUT"]) {    //  Если ожидание слишком долгое.
                    LogActions.addToLog("<b class='error'>The page's wait period has expired.</b>",GLOBAL);
                    clearInterval(waiting);
                    return false;
                }
                forced++;
            }, GLOBAL["INTERVAL"]);
        }
    }
    
    /**
     * Функция находит все цвета предмета, выбирает нужный и возвращает массив с цветами.
     * @param {string} selectedColor    Строка указанных цветов.
     * @param {object} foundItems   Массив объектов найденных предметов после поиска по имени.
     * @returns {object} Массив цветов, соответствующих условию поиска.
     */
    сolorSelection(selectedColor, foundItems, GLOBAL) {
        //  Строим массив всех существующих цветов.
        var foundColors = {}, colorsAmount = 0;
        for (var i = 0; i < foundItems.length; i++) {
            foundColors[i] = foundItems[i].parentElement.parentElement.children[2].children["0"].innerHTML;
            colorsAmount++;
        }
        
        if (selectedColor !== "Any" && selectedColor !== "" && selectedColor !== " ") {    //  Если список цветов указан.
            //  Разбиваем строку на цвета.
            var f_c = 0, r_c = 0, selected__color = "";  //  Счетчик запрещенных/разрешенных цветов.

            var forbiddenColors = {}, resolvedColors = {};
            for (var i = 0; i < selectedColor.split(",").length; i++) {   //  Перебираем все указанные цвета.
                if ((selectedColor.split(",")[i]).substr(0, 1) === "!") {  //  Запрещенный цвет.
                    forbiddenColors[f_c] = (selectedColor.split(",")[i]).substr(1);
                    f_c++;
                } else {  //  Разрешенный цвет.
                    resolvedColors[r_c] = selectedColor.split(",")[i];
                    r_c++;
                }
            }
            
            //  Берем массив найденных цветов и вычеркиваем запрещенные.
            var colors_arr = new Array();
            var coinc__flag = false;
            for(var i in foundColors){
                if(foundColors.hasOwnProperty(i)){
                    coinc__flag = false;
                    for(var j in forbiddenColors){
                        if(forbiddenColors.hasOwnProperty(j)){
                            if(foundColors[i].toString().replace(/\s/g, '') === forbiddenColors[j].toString().replace(/\s/g, '')){
                                //  Если в найденных предметах есть те, которые запрещены.
                                coinc__flag = true;
                                //console.log(foundColors[i], forbiddenColors[j]);
                                break;
                            }
                        }
                    }
                    if(coinc__flag === false){
                        colors_arr.push(foundColors[i].toString().replace(/\s/g, ''));
                    }
                }
            }
            
            //  Сортируем с приоритетными цветами. Получаем массив только с приоритетными цветами.
            var resolved_plus_finded = new Array();
            coinc__flag = false;
            var only_resolved = new Array();
            for(var k in resolvedColors){   //  Перебираем все приоритетные цвета.
                if(resolvedColors.hasOwnProperty(k)){
                    coinc__flag = false;
                    for(var m in colors_arr){   //  Перебираем все найденные цыета с исключенными запрещенными.
                        if(colors_arr.hasOwnProperty(m)){
                            if(resolvedColors[k].toString().replace(/\s/g, '') === colors_arr[m].toString().replace(/\s/g, '')){
                                //  Помещаем в новый массив.
                                coinc__flag = true;
                            } 
                        }
                    }
                    if(coinc__flag === true){
                        resolved_plus_finded.push(resolvedColors[k].toString().replace(/\s/g, ''));
                        only_resolved.push(resolvedColors[k].toString().replace(/\s/g, ''));
                    }
                }
            }
            
            //  Строим массив всех присутствующих цветов, с приоритетными в начале.
            coinc__flag = false;
            for(var i in colors_arr){   //  Перебираем все приоритетные цвета.
                if(colors_arr.hasOwnProperty(i)){
                    coinc__flag = false;
                    for(var j in resolvedColors){   //  Перебираем все найденные цыета с исключенными запрещенными.
                        if(resolvedColors.hasOwnProperty(j)){
                            if(colors_arr[i].toString().replace(/\s/g, '') === resolvedColors[j].toString().replace(/\s/g, '') && (!colors_arr.hasOwnProperty(j+1))){
                                //  Помещаем в новый массив.
                                coinc__flag = true;
                                break;
                            }
                        }
                    }
                    if(coinc__flag === false){
                        resolved_plus_finded.push(colors_arr[i].toString().replace(/\s/g, ''));
                    }
                    
                }
            }
            
            //  Если указано выбирать любой размер. Первыми проверятся только приоритетные затем все остальные.
            if(GLOBAL["SETTINGS"]["SelectAnyColor"] === 1){
                //  Первые приоритетные, затем все остальные.
                var temp_str = "";
                for(var i in resolved_plus_finded){
                    if(resolved_plus_finded.hasOwnProperty(i)){
                        temp_str += resolved_plus_finded[i] + ",";
                    }
                }
                LogActions.addToLog("Set any size in the settings!", GLOBAL);
                LogActions.addToLog("The first priority, then all the rest: " + temp_str, GLOBAL);
                return resolved_plus_finded;
            }else{  //  Если галочки нет, берем только указанные цвета. Возвращаем массив цветов, только подходящих под условия поиска.
                //  Только присутствующие разрешенные.
                var temp_str = "";
                for(var i in only_resolved){
                    if(only_resolved.hasOwnProperty(i)){
                        temp_str += only_resolved[i] + ",";
                    }
                }
                LogActions.addToLog("Only those present are allowed: " + temp_str, GLOBAL);
                return only_resolved;
            }
        }else{
            // Все цвета.
            var temp_str = "";
            for(var i in foundColors){
                if(foundColors.hasOwnProperty(i)){
                    temp_str += foundColors[i] + ",";
                }
            }
            LogActions.addToLog("Color not selected or color field is empty!", GLOBAL);
            LogActions.addToLog("Any color will be selected: " + temp_str, GLOBAL);
            return foundColors;
        }
    }
}


/**
 * Class contain all operations on checkout page.
 * @type Class
 */
class CheckoutActions{
    /**
     * Функция заполнения поля ввода.
     * @param {string} fieldID  ID поля ввода.
     * @param {string} fieldName    Название поля из в локальном хранилище.
     * @param {string} fieldType    Особые флаги. Определяют положение текста в поле ввода или тип поля.
     * @returns {undefined}
     */
    fillingField(fieldID, fieldName, fieldType) {
        if ((fieldType === "drop-list") || (fieldType === "nonfloating")) {   //  If Drop-down list.
            $("#" + fieldID).val(GLOBAL__CARDS[GLOBAL__CARD_COUNTER][fieldName]);
        } else {  //  Обычное поле.
            if (GLOBAL__CARDS[GLOBAL__CARD_COUNTER][fieldName] !== "") {
                $("#" + fieldID).val(GLOBAL__CARDS[GLOBAL__CARD_COUNTER][fieldName]);
                $("#" + fieldID).addClass("floating");
                $("#" + fieldID).parent("div").children("label").addClass("floating");
            }
        }
    }
    
    
    /**
     * Функция заполнения всех полей на странице checkout.
     * @returns {undefined}
     */
    formFilling() {
        LogActions.addToLog("Filling in the card data.",GLOBAL);
        //  Common.
        this.fillingField("order_billing_name", "fullName");
        this.fillingField("order_email", "email");
        this.fillingField("order_tel", "tel");
        this.fillingField("bo", "address");
        this.fillingField("oba3", "address2");
        this.fillingField("order_billing_address_3", "address3");
        this.fillingField("order_billing_city", "city");
        this.fillingField("order_billing_zip", "postcode");
        this.fillingField("order_billing_country", "country", "drop-list");
        //  Payment.
        this.fillingField("credit_card_type", "cardType", "drop-list");
        this.fillingField("cnb", "cardNumber", "nonfloating");
        this.fillingField("credit_card_month", "cardMonth", "drop-list");
        this.fillingField("credit_card_year", "cardYear", "drop-list");
        this.fillingField("vval", "cardCVV", "nonfloating");
        //  Confirmation terms.
        var selector = document.querySelector('input[name="order[terms]"]');
        BasicFunctions.simulateClick(selector);
    }

    /**
     * Функция эмуляции нажатия кнопки "process payment";
     * @returns {undefined}
     */
    pressProcessPayment() {
        LogActions.addToLog("Send a request for payment.",GLOBAL);
        var selector = document.querySelector('input[name="commit"]');
        BasicFunctions.simulateClick(selector);
    }
    
    /**
     * Функция редиректа на страницу checkout.
     * @returns {undefined}
     */
    goToCheckoutPage() {
        chrome.storage.local.set({"checkout": "start_actions"}, function () {}); // Указываем место, откуда был сделан редирект на страницу checkout.
        LogActions.addToLog("Go to checkout page.",GLOBAL);
        if (GLOBAL["SETTINGS"]["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
            LogActions.addToLog("Waiting time for response: 200 ms.",GLOBAL);
        }
        setTimeout(function () {
            var selector = document.querySelector('a[href="https://www.supremenewyork.com/checkout"]');
            BasicFunctions.simulateClick(selector);
        }, 200);
    }
    
    
    /**
     * Функция обработки страницы chrckout.
     * @returns {undefined}
     */
    checkoutPayment() {
        //  Заполнение формы.
        this.formFilling();
        //console.log(GLOBAL__CARD_COUNTER);
        //console.log(GLOBAL__CARDS[GLOBAL__CARD_COUNTER]);
        var forced = 0;
        var checkbox = $(".icheckbox_minimal");
        var waiting = setInterval(function () {
            if ($(checkbox[1]).hasClass("checked")) {
                clearInterval(waiting);
                if (GLOBAL["SETTINGS"]["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                    LogActions.addToLog("Waiting time for response: " + (forced * 50) + " ms.",GLOBAL);
                }
                //  Проводим платежную операцию.
                // CheckoutActions.prototype.pressProcessPayment();
                 LogActions.showLogPage();
                
                //  Ожидание ответа сервера.
                var forced_p = 0;
                var waiting_p = setInterval(function () {
                    //  Ожидание загрузки страницы.
                    if (document.querySelector('div[id="confirmation"]') !== null) {
                        clearInterval(waiting_p);
                        LogActions.addToLog("Payment request was successfully sent.",GLOBAL);
                        if (GLOBAL["SETTINGS"]["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                            LogActions.addToLog("Payment timeout: " + (forced_p * 50) + " ms.",GLOBAL);
                        }
                        // Читаем ответ сервера.
                        var response = $("#confirmation").children("p");
                        LogActions.addToLog($(response[0]).text(),GLOBAL);

                        //  Расчет времени выполнения.
                        if (GLOBAL["SETTINGS"]["CalculateTotalTime"] === 1) {
                            var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
                            LogActions.addToLog("The end value of the stopwatch. Timestamp: " + timeStampInMs,GLOBAL);
                            chrome.storage.local.get("timestamp", function (stor) {
                                var time_diff = Math.floor(timeStampInMs - stor["timestamp"]);
                                LogActions.addToLog("Total execution time: " + (time_diff / 1000) + " sec.",GLOBAL);
                                LogActions.showLogPage();
                                // Удаляем 
                                chrome.storage.local.remove("operations", function () {});
                                return true;
                            });
                        }
                    }
                    if (forced > GLOBAL["TIMEOUT"]) {    //  Если ожидание слишком долгое.
                        LogActions.addToLog("<b class='error'>Payment timeout expired.</b>",GLOBAL);
                        clearInterval(waiting);
                        return false;
                    }
                    forced_p++;
                }, GLOBAL["INTERVAL"]);
                
            }
            if (forced > GLOBAL["TIMEOUT"]) {    //  Если ожидание слишком долгое.
                LogActions.addToLog("<b class='error'>The payment page is not responding.</b>",GLOBAL);
                clearInterval(waiting);
                return false;
            }
            forced++;
        }, GLOBAL["INTERVAL"]);
    }
    
    
}


/**
 * Class contain all operations with log.
 * @type Class
 */
class LogActions{
    /**
     * Функция добавления записи о совершенном действии в лог.
     * @param {string} note 
     * @returns {undefined}
     */
    addToLog(note,GLOBAL) {
        console.log(note);
        GLOBAL["LOG"].push(note);
    }

    /**
     * Функция перехода на конечную страницу вывода результата работы.
     * @returns {undefined}
     */
    showLogPage(GLOBAL) {
        this.addToLog("Show log page..." ,GLOBAL);
        //console.log(GLOBAL__LOG);
        //  Переносим все записи лога в локальное хранилище.
        chrome.storage.local.set({"log": GLOBAL["LOG"]}, function () {
            if (GLOBAL["SETTINGS"]["LogInNewWindow"] === 1) {   //  Если в настройках указано показать лог по завершению.
                chrome.extension.sendMessage('show__log');  //  Вызываем страницу лога.
            }
        });

    }

    /**
     * Функция очистки лога из локального хранилища.
     * @returns {undefined}
     */
    clearLog() {
        //  Переносим все записи лога в локальное хранилище.
        chrome.storage.local.remove("log", function () {});
    }
}


/*
 * Если было принято сообщение из options.js, редиректим на пришедший в сообщении адрес.
 */



chrome.runtime.onMessage.addListener(function (request, sender) {
    //  Определяем с какой целью было отправлено сообщение в background.
    if((request !== 'show__log') && (request !== 'reload')){
        chrome.tabs.update(sender.tab.id, {url: request.redirect}); //  Первичный редирект на страницу всех предметов на сайте.
        chrome.storage.local.set({"operations": "start_actions"}, function () { }); //  Ставим флаг выполнения автоматических действий.
        
        /*
         * Отключаем загрузку лишних скриптов, дабы ускорить загрузку страницы.
         */
        chrome.storage.local.get("settings", function (resp) {
            if(resp["settings"]["DisableSomeScripts"] === 1){
                chrome.webRequest.onBeforeRequest.addListener(
                    function() { return {cancel: true}; },
                    {urls: [
                        "*://www.google-analytics.com/ga.js",
                        "*://connect.facebook.net/en_US/fp.js",
                        "*://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"]},
                    ["blocking"]
                );
            }
        });
        
        /*
         * Вешаем обработчик на перезагрузку таба.
         * Отбираем нужный таб, определяем его состояние после перезагрузки, применяем действия.
         * Обрабатывается 2 состояния таба:
         * 1. Сайт лежит(error 500).
         * 2. Сайт корректно работает.
         * Алгоритм является рекурсивным, выход только при успешном получении контента страницы.
         * Задержка между перезагрузками равняется 500 мс(без учета таймаута ответа сервера).
         * Задержка может варьироваться, усходя из требуемой злости алгоритма.
         */
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
            //console.info("This is the url of the tab = " + tab.url);
            //console.log(changeInfo, tab);
            setTimeout(function () {
                if((tab.url === "http://www.supremenewyork.com/shop/all/") && (tab.status === "complete")){
                    if(tab.title === "www.supremenewyork.com"){
                        //  Неудачная загрузка страницы.
                        //console.log(tab.id, request.redirect);
                        chrome.tabs.update(tab.id, {url: request.redirect});
                    }else{
                        if(tab.title === "Supreme"){
                            //  Удачная загрузка страницы.
                            console.log("Go!");
                        }
                    }
                }else{
                    //  Другой домен либо момент загрузки таба.
                    console.log("Another domen or loading page or site is down!");
                }
            }, 500);
        });
        
        /*
         * Ожидание загрузки первичного таба(стартовая страница, на которой размещен весь дроп).
         * Определение состояния данной страницы и выполнение сообветствующих действий.
         * Либо перезагрузка, либо продолжение нормальной работы.
         * @returns {undefined}
         */
        setTimeout(function () {
            var tab;
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                tab = tabs[0];
                console.log("Reloading!");
                console.log(tab.url);
                console.log(tab.status);
                if ((tab.url === "http://www.supremenewyork.com/shop/all/") && (tab.status === "complete")) {
                    if (tab.title === "www.supremenewyork.com") {
                        //  Неудачная загрузка страницы.
                        chrome.tabs.update(tab.id, {url: request.redirect});    //  Перезагружаем таб.
                    } else {
                        if (tab.title === "Supreme") {
                            //  Удачная загрузка страницы.
                            console.log("Go!");
                        }
                    }
                } else {
                    //  Другой домен либо момент загрузки таба.
                    console.log("Another domen!");
                }
            });
        }, 1000);
        
    }else{  //  Если подана определенная команда.
        if(request === 'show__log'){   //  Если подана команда вывести лог.
            //  Создание нового таба лога.
            chrome.windows.create({
                url: "log.html",
                type: "popup",
                height: 800,
                width: 500,
                focused: false
            }, function (newWindow) {});
        }else{
            //  Другие команды...
        }
    }
});




/**
 * При загрузке выполняется чтение локального хранилища, достаются массивы: корзины и настроек.
 * Массив корзины перестраивается по первичному ключу id карты.
 * Добавляется массив сопоставления ключа и id карты.
 */


window.onload = function(){
    
    console.log("Loaded!");
    //  Когда пользователь подтверждает покупку выбраннных предметов.
    
    /*var old_mark = $("#container article:first-child() div a").attr("href");  //  First item href.
    old_mark = old_mark.toString().replace(/\s/g, '');
    chrome.storage.local.set({"start_mark": old_mark, "redirect_counter": 0, "check_drop": "check"}, function () {});
    */
    
    //  Команда подается за 5 секунд до дропа и удаляется при успешном поиске новых предметов.
    /*
    chrome.storage.local.get(function (storage) {
        if(storage["check_drop"] === "check"){    //  Если есть команда на обновление дроплиста.
            //  Определение обновления списка предметов. Проверка осуществляется примерно каждую секунду.
            var mark = $("#container article:first-child() div a").attr("href");  //  Берем метку первого предмета.
            //  Очень злой рекурсивный алгоритм.
            mark = mark.toString().replace(/\s/g, '');


            var maximum__attempts = 10;

                if(storage["redirect_counter"] < maximum__attempts){ //  Максимальное количество попыток.
                    if( (mark.substr(0,6) === "/shop/") && (mark !== storage["start_mark"]) ){  //  Если формат ссылки похож на правду и метка не равна предыдущей.
                    //if( (mark.substr(0,6) === "/shop/") && (mark === storage["start_mark"]) ){  //  Если формат ссылки похож на правду и метка не равна предыдущей.    
                        //  Стираем команду обновления страницы.
                        chrome.storage.local.set({"check_drop": ""}, function () {});   //  Завершение автоматического обновления.
                        
                        if (storage["operations"] === "start_actions") {    //  Если есть команда на покупку предметов.
                            //  Начинаем автоматические действия.
                            console.log("Auto actions start!");
                            main();
                        }
                    }else{
                        //  Перезагружаем до тех пор, пока страница не станет доступна/ не появятся новые предметы, или пока не привысим количество попыток.
                        console.log("Try again. Reloading... Attempt #" + storage["redirect_counter"]);
                        evilRedirect(storage);
                    }
                }else{
                    console.log("The maximum number of attempts has been exceeded!");
                }
        }else{
            if (storage["operations"] === "start_actions") {    //  Если есть команда на покупку предметов.
                //  Начинаем автоматические действия.
                console.log("Auto actions start!");
                main();
            }
        }
        
    });*/
};




function evilRedirect(storage){
    chrome.storage.local.set({"redirect_counter": (storage["redirect_counter"] + 1)}, function () {});
    window.location.href = "http://www.supremenewyork.com/shop/all/"; // Redirect.
}



function main(){
    BasicFunctions = new BasicFunctions;
    ItemsActions = new ItemsActions;
    CheckoutActions = new CheckoutActions;
    LogActions = new LogActions;
    
    //  Убираем лишнии скрипты.(Ускоряем загрузку страницы)
    chrome.storage.local.get("settings", function (resp) {
        if (resp["settings"]["HideAllAnimations"] === 1) {   //  Hide all animations on supreme site.
            if (window.location.href !== "https://www.supremenewyork.com/checkout") {
                //  Ускоряем операции на странице, все анимации убираем, все opacity 1.
                var restyle = chrome.extension.getURL("css/restyle-style.css");
                var link = document.createElement("link");
                link.setAttribute("rel", "stylesheet");
                link.setAttribute("type", "text/css");
                link.setAttribute("href", restyle);
                document.getElementsByTagName("head")[0].appendChild(link);
            }
        }
        //  Добавляем блок "Не используйте навигационные кнопки".
        if(resp["settings"]["ShowWarnings"] === 1){
            var warningBlock = document.createElement("div");
            warningBlock.setAttribute("class", "warningBlock");
            document.getElementsByTagName("body")[0].appendChild(warningBlock); 
            $(".warningBlock").html('<b>Do not use navigation buttons when bot works!</b>'); 
        }
        //  Другие настраиваемые действия с оформлением сайта supreme.
        //  ...
    });
    
    chrome.storage.local.get(function (storage) {   //  Reading local storage.
        //  Чтение GLOBAL - массив с глобальными переменными.
        var GLOBAL = storage["GLOBAL"];
        
        
        
        
        //  Если перешли на страницу типа предмета.
        if(window.location.href === GLOBAL["NEW_LOCATION"]){
            if(storage["operations"] === "start_actions"){
                LogActions.addToLog("Actions on type page.",GLOBAL);
                console.log("Actions on type page.");
                var CURRENT__ITEM = GLOBAL["ITEMS_ARRAY"][GLOBAL["MATCHING_ARRAY"][GLOBAL["CARD_COUNTER"]]][GLOBAL["ITEMS_COUNTER"]];
                LogActions.addToLog("Processing of the object: " + CURRENT__ITEM["name"],GLOBAL);

                ItemsActions.actionsOnTypePage({
                    "name": CURRENT__ITEM["name"],
                    "type": CURRENT__ITEM["type"],
                    "size": CURRENT__ITEM["size"],
                    "colors": CURRENT__ITEM["color"]
                },GLOBAL);
            }
            
        }else{
            //  Если перешли на страницу checkout.
            if (window.location.href === "https://www.supremenewyork.com/checkout") {   //  Если это страница checkout.
                if (storage["checkout"] !== undefined) {    //  Определяем откуда открыта страница.
                    GLOBAL["SETTINGS"] = storage["settings"];
                    //  Переносим лог на эту страницу.
                    for (var note in storage["log"]) {
                        if (storage["log"].hasOwnProperty(note)) {
                            GLOBAL["LOG"].push(storage["log"][note]);
                            console.log(storage["log"][note]);
                        }
                    }
                    // Перестройка массива с платежными картами.
                    GLOBAL["CARD_COUNTER"] = storage["currentCard"];
                    var cardsArray = storage["card"];
                    var card_counter = 0;
                    for (var card in cardsArray) {
                        if (cardsArray.hasOwnProperty(card)) {
                            GLOBAL["CARDS"][card_counter] = cardsArray[card];
                            card_counter++;
                        }
                    }
                    CheckoutActions.checkoutPayment();
                } else {
                    console.log("No auto checkout!");
                }
                chrome.storage.local.remove("checkout", function () {
                    //console.log('Operations array removed');
                });
            } else {
                if (storage["operations"] === "start_actions") {  //  Определяем откуда была открыта страница. Скрипт запускается только при редиректе со страницы options.
                    //  Удаление старых логов.
                    GLOBAL["LOG"] = new Array();
                    chrome.storage.local.set({"GLOBAL": GLOBAL}, function () {   // Запысываем изменения в логе.
                        // Делаем метку времени, на ее основании вычислим полное время выполнения операций.
                        var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
                        LogActions.addToLog("Initialize total running stopwatch. Timestamp: " + timeStampInMs,GLOBAL);
                        chrome.storage.local.set({"timestamp": timeStampInMs}, function () {
                            // Инициализация лога.
                            LogActions.addToLog("Initialize log page.",GLOBAL);
                            LogActions.clearLog();
                            LogActions.addToLog("Reading cart and arranging the arrays.",GLOBAL);
                            GLOBAL["SETTINGS"] = storage["settings"];
                            var cardsArray = storage["card"];

                            // Перестройка массива с платежными картами.
                            var card_counter = 0;
                            for (var card in cardsArray) {
                                if (cardsArray.hasOwnProperty(card)) {
                                    GLOBAL["CARDS"][card_counter] = cardsArray[card];
                                    card_counter++;
                                }
                            }
                            console.log(GLOBAL["CARDS"]);

                            var cart = storage["cart"], cardItems__counter = {};
                            for (var item in cart) {
                                if (cart.hasOwnProperty(item)) {
                                    // Сортировка по id карты.
                                    if (cardItems__counter[cart[item]["card"]] !== undefined) {
                                        cardItems__counter[cart[item]["card"]] += 1;
                                    } else {
                                        cardItems__counter[cart[item]["card"]] = 0;
                                    }
                                    if (GLOBAL["ITEMS_ARRAY"][cart[item]["card"]] !== undefined) {   //  Если в глобальном массиве уже есть эта карта.
                                        GLOBAL["ITEMS_ARRAY"][cart[item]["card"]][cardItems__counter[cart[item]["card"]]] = {
                                            name: cart[item]["name"],
                                            type: cart[item]["type"],
                                            size: cart[item]["size"],
                                            color: cart[item]["color"]
                                        };
                                    } else {
                                        GLOBAL["ITEMS_ARRAY"][cart[item]["card"]] = {
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
                            for (var card in GLOBAL["ITEMS_ARRAY"]) {
                                if (GLOBAL["ITEMS_ARRAY"].hasOwnProperty(card)) {
                                    GLOBAL["MATCHING_ARRAY"][matching_counter] = card;
                                    console.log(card);
                                    matching_counter++;
                                }
                            }
                            LogActions.addToLog("Start auto actions on page.",GLOBAL);
                            BasicFunctions.startActions(GLOBAL);
                        });
                    });
                } else {  //  Ничего не делаем. На страницу зашли не из под расширения.
                    console.log("Inactivity.");

                }
            }
        }
        
    });
    //  Удаление массива операций, сделано для того, чтобы при каждом посещении страницы магазина самопроизвольно не запускался скрипт расширения.
    //chrome.storage.local.remove("operations", function () {});
    chrome.storage.local.set({'operations': ""},function(){});
    
}
    //});