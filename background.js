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
 * GLOBAL__SETTINGS - Array of settings setup on setting page.(file "/settins.js").
 * GLOBAL__CARDS - Array with data on payment cards.
 * GLOBAL__MATCHING_ARRAY - Array with matching data for convert items array by id key.
 * GLOBAL__TIMEOUT - The maximum time to wait for a page response.
 * GLOBAL__INTERVAl - Interval of page access, while waiting for content.
 */
var GLOBAL__ITEMS_COUNTER = 0;
var GLOBAL__CARD_COUNTER = 0;
var GLOBAL__LOG = new Array();
var GLOBAL__LAP_FLAG = false;
var GLOBAL__ITEMS_ARRAY = {};
var GLOBAL__SETTINGS = {};
var GLOBAL__CARDS = {};
var GLOBAL__MATCHING_ARRAY = {};
var GLOBAL__TIMEOUT = 100;  //  Equalse 5000 ms (100 segments of 50ms);
var GLOBAL__INTERVAl = 50;



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
    addToBasket() {
        LogActions.addToLog("Adding to basket.");
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
    toTypePage(sub__href) {
        var what = document.querySelector('a[href="' + sub__href + '"]');
        if (what === null) {  //  Если предмет был добавлен в корзину, то переходим через основную страницу.
            LogActions.addToLog("Go to type page: /shop/all");
            var what = document.querySelector('a[href="http://www.supremenewyork.com/shop/all"]');
            this.simulateClick(what);
        } else {
            LogActions.addToLog("Go to type page: " + sub__href);
            this.simulateClick(what);
        }
    }
    
    /**
     * Прослойка рекурсивного алгоритма обхода всех предметов и карт.
     * Выполняет функцию вызова основного алгоритма перебора и поиска.
     * @returns {undefined}
     */
    stub() {
        console.log(GLOBAL__LAP_FLAG, GLOBAL__CARD_COUNTER, GLOBAL__ITEMS_COUNTER);
        var CURRENT__ITEM = GLOBAL__ITEMS_ARRAY[GLOBAL__MATCHING_ARRAY[GLOBAL__CARD_COUNTER]][GLOBAL__ITEMS_COUNTER];
        LogActions.addToLog("Processing of the object: " + CURRENT__ITEM["name"]);
        ItemsActions.actionsOnTypePage({
            "name": CURRENT__ITEM["name"],
            "type": CURRENT__ITEM["type"],
            "size": CURRENT__ITEM["size"],
            "colors": CURRENT__ITEM["color"]
        });
    }

    /**
     * Функция является частью рекурсивного алгоритма перебора всех предметов в корзине.
     * Выполняет инкрементирующую функцию. Первыми перебираются предметы на карте, затем карты.
     * @returns {Boolean} Если предметов больше нет, возвращает false;
     */
    startActions() {
        if (!GLOBAL__LAP_FLAG) {  //  Вход.
            //  Предусматривает наличие хотя бы 1й карты и 1 предмета на ней.
            this.stub();
            GLOBAL__LAP_FLAG = true;
        } else {  //  Последующие.
            if (GLOBAL__ITEMS_ARRAY[GLOBAL__MATCHING_ARRAY[GLOBAL__CARD_COUNTER]][GLOBAL__ITEMS_COUNTER + 1] !== undefined) {   //  Если есть еще предметы на данной карте.
                GLOBAL__ITEMS_COUNTER++;    //  Переход к следующему предмету на карте.
                this.stub();
            } else {  //  Предметов на карте нет, переходим к оплате. Переход к следующей карте.

                //  Удаление из корзины уже купленных предметов.

                //  Запоминаем все глобальные переменные.

                //  Запоминаем номер карты, с которой производить оплату.
                chrome.storage.local.set({"currentCard": GLOBAL__CARD_COUNTER}, function () {});
                //  Checkout and payment.
                //var checkout_finish = CheckoutActions.goToCheckoutPage();
                // Сохраняем все данные, потому что переменные сбросятся при переходе на формально другую чтраницу.
                chrome.storage.local.set({"log": GLOBAL__LOG}, function () {});


                if (GLOBAL__ITEMS_ARRAY[GLOBAL__MATCHING_ARRAY[GLOBAL__CARD_COUNTER + 1]] !== undefined) {    //  Если есть еще одна карта.

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
    choiceSize(sizes, established__size) {
        var pure__sizes = {};
        //  Если у предмета нет параметров выбора размера. Например кепки или аксессуары.
        if(sizes !== undefined){
            //  Выбор всех размеров со страницы.
            var sizes__array = $(sizes).children("option");
            for (var i = 0; i < $(sizes__array).length; i++) {
                pure__sizes[i] = {
                    label: $(sizes__array[i]).text(),
                    code: $(sizes__array[i]).val()
                };
            }

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
            if (GLOBAL__SETTINGS["SelectAnySize"] === 1) {    //  Если в настройках установлена галочка выбора любого размера.
                LogActions.addToLog("The size is selected based on the settings.");
                return pure__sizes["0"]["code"];
            } else {
                LogActions.addToLog("The size is not selected, because there is no fixed size!");
                return false;
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
    selectItemSize(established__size) {
        //  Выбор размера, установленного пользователем.
        var sizes = document.querySelector('select[name="size"]');
        var item__size__code = ItemsActions.prototype.choiceSize(sizes, established__size);
        if (item__size__code !== false) {   //  Если размер был найден.
            if(item__size__code === true){   //  Если у предмета нет размера.
                LogActions.addToLog("Item does not have a size.");
                return true;
            }else{
                //  Выбираем его на странице.
                $(sizes).val(item__size__code); //  Устанавливаем в выпадающем списке.
                var resp = $(sizes).children('option[value="' + item__size__code + '"]').text();
                LogActions.addToLog("Selected size : " + resp);
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
    actionsOnItemPage(href__array, established__size) {
        var _proto__selectItemSize = ItemsActions.selectItemSize;
        for (var obj in href__array) {    //  Перебираем все найденные предметы.
            if (href__array.hasOwnProperty(obj)) {
                var container = document.querySelector('a[href="' + href__array[obj] + '"]');
                if ($(container).children("div").text().toString().replace(/\s/g, '') !== "soldout") {    //  Проверяем наличие предмета в магазине.
                    //  Действия на странице предмета.
                    BasicFunctions.toSubjectPage(href__array[obj]);   //  Go to the subject page.
                    LogActions.addToLog("Go to item page: " + href__array[obj]);
                    //  Задержка подгрузки страницы.
                    var forced = 0;
                    var waiting = setInterval(function () {   //  Ждем прогрузки контента страницы выбранного предмета.
                        if (document.querySelector('span[itemprop="price"]')) {   //  Если страница загрузилась.
                            clearInterval(waiting);
                            //  Если предмета еще нет в корзине.
                            if (document.querySelector('input[value="add to basket"]')) { //  Если есть кнопка добавления в корзину.
                                //  Выбор размера.
                                var size__flag = ItemsActions.prototype.selectItemSize(established__size);
                                if (size__flag !== false) {
                                    //  Добавление в корзину.
                                    BasicFunctions.addToBasket(href__array[obj]);
                                    setTimeout(function () {
                                        BasicFunctions.startActions(); //  Переход к другим предметам.
                                    }, GLOBAL__INTERVAl);
                                } else {
                                    //  Размер не был выбран.
                                    LogActions.addToLog("Size was not selected.");
                                    BasicFunctions.startActions(); //  Переход к другим предметам.
                                }
                            } else {
                                LogActions.addToLog("<b class='warning'>The item is already in the basket.<b>");
                                BasicFunctions.startActions(); //  Переход к другим предметам.
                            }
                        }
                        if (forced > GLOBAL__TIMEOUT) {    //  Если ожидание слишком долгое.
                            LogActions.addToLog("<b class='error'>The page's wait period has expired.</b>");
                            clearInterval(waiting);
                        }
                        forced++;
                    }, GLOBAL__INTERVAl);
                    break;
                } else {  //  Все экземпляры предмета раскуплены.
                    LogActions.addToLog("<b class='warning'>All copies of the item are sold out.</b>");
                    BasicFunctions.startActions(); //  Переход к другим предметам.
                    break;
                }
            }
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
    actionsOnTypePage(data) {
        var _proto__findItemsByName = this.findItemsByName;
        var _proto__сolorSelection = this.сolorSelection;
        var _proto__actionsOnItemPage = this.actionsOnItemPage;
        var foundItems = {};
        var name = data["name"];
        var type = data["type"];
        var size = data["size"];
        var colors = data["colors"];
        //  Исключение названия типа.
        if (type === "tops") {
            type = "tops_sweaters";
        }
        //  Переходим на страницу типа предмета.
        BasicFunctions.toTypePage("/shop/all/" + type);   //  Go to the subject page.
        if (document.querySelector('span[itemprop="price"]')) {   //  Если переход осуществляется со страницы предмета.
            //  Дожидаемся загрузки страницы.
            var forced_w = 0; //  Счетчик ожидания.
            var waiting = setInterval(function () {   //  Ждем прогрузки контента страницы.
                if (document.querySelector('a[class="current"]') !== null) {
                    clearInterval(waiting);
                    if (GLOBAL__SETTINGS["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                        LogActions.addToLog("Waiting time for response: " + (forced_w * 100) + " ms.");
                    }
                    BasicFunctions.toTypePage("/shop/all/" + type);   //  Go to the subject page.
                    var forced = 0; //  Счетчик ожидания.
                    var InnerWaiting = setInterval(function () {   //  Ждем прогрузки контента страницы.
                        if (document.querySelector('a[class="current"]').href === "http://www.supremenewyork.com/shop/all/" + type) {
                            clearInterval(InnerWaiting);
                            if (GLOBAL__SETTINGS["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                                LogActions.addToLog("Waiting time for response: " + (forced * 100) + " ms.");
                            }
                            //  Parse content.
                            foundItems = _proto__findItemsByName(name); //  Массив объектов отобранных по имени предметов.
                            var href__array = _proto__сolorSelection(colors, foundItems);   //  Получение ссылок на подходящие предметы.
                            var coi = 0;
                            for (var g in href__array) {
                                if (href__array.hasOwnProperty(g)) {
                                    coi++;
                                }
                            }
                            LogActions.addToLog("Found " + coi + " items.");
                            _proto__actionsOnItemPage(href__array, size);
                        }
                        if (forced > GLOBAL__TIMEOUT) {    //  Если ожидание слишком долгое.
                            LogActions.addToLog("<b class='error'>The page's wait period has expired.</b>");
                            clearInterval(InnerWaiting);
                            return false;
                        }
                        forced++;
                    }, GLOBAL__INTERVAl);
                }
                if (forced_w > GLOBAL__TIMEOUT) {    //  Если ожидание слишком долгое.
                    LogActions.addToLog("<b class='error'>The page's wait period has expired.</b>");
                    clearInterval(waiting);
                    return false;
                }
                forced_w++;
            }, GLOBAL__INTERVAl);
        } else {  //  Если переход осуществляется из /all.
            //  Дожидаемся загрузки страницы.
            var forced = 0; //  Счетчик ожидания.
            var waiting = setInterval(function () {   //  Ждем прогрузки контента страницы.
                if (document.querySelector('a[class="current"]').href === "http://www.supremenewyork.com/shop/all/" + type) {
                    clearInterval(waiting);
                    //  Parse content.
                    foundItems = _proto__findItemsByName(name); //  Массив объектов отобранных по имени предметов.
                    var href__array = _proto__сolorSelection(colors, foundItems);   //  Получение ссылок на подходящие предметы.
                    var coi = 0;
                    for (var g in href__array) {
                        if (href__array.hasOwnProperty(g)) {
                            coi++;
                        }
                    }
                    LogActions.addToLog("Found " + coi + " items.");
                    //  Выводим время ответа сервера.
                    if (GLOBAL__SETTINGS["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                        LogActions.addToLog("Waiting time for response: " + (forced * 100) + " ms.");
                    }
                    _proto__actionsOnItemPage(href__array, size);
                }
                if (forced > GLOBAL__TIMEOUT) {    //  Если ожидание слишком долгое.
                    LogActions.addToLog("<b class='error'>The page's wait period has expired.</b>");
                    clearInterval(waiting);
                    return false;
                }
                forced++;
            }, GLOBAL__INTERVAl);
        }
    }
    
    /**
     * Функция находит все цвета предмета, выбирает нужный и возвращает массив с ссылками.
     * @param {string} selectedColor    Строка указанных цветов.
     * @param {object} foundItems   Массив объектов найденных предметов после поиска по имени.
     * @returns {object} Массив ссылок на страницы предметов.
     */
    сolorSelection(selectedColor, foundItems) {
        console.log(selectedColor);
        console.log(foundItems);
        var selectedColors = {};    //  Массив заданных цветов.
        var flag__color = true;    //  True - Любой цвет. False - Заданный.
        if (selectedColor !== "Any") {    //  Если список цветов указан.
            //  Разбиваем строку на цвета.
            var f_c = 0, r_c = 0, selected__color = "";  //  Счетчик запрещенных/разрешенных цветов.
            flag__color = false;
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
        }

        var foundColors = {}, hrefArray = {}, colorsAmount = 0;
        //  Строим массив всех существующих цветов.
        for (var i = 0; i < foundItems.length; i++) {
            foundColors[i] = foundItems[i].parentElement.parentElement.children[2].children["0"].innerHTML;
            colorsAmount++;
        }
        console.log(foundColors);
        //  Выбираем что указано пользователем, а что нет.
        if (flag__color === true) {   //  Выбираем все найденные цвета.
            for (var i = 0; i < foundItems.length; i++) {
                hrefArray[i] = foundItems[i].parentElement.parentElement.children["0"].attributes[1].value;
            }
        } else {  //  Если цвета указаны точно.
            if (forbiddenColors[0] === undefined) {
                if (resolvedColors[0] === undefined) { //  Не указаны ни запрещенные ни разрешенные.
                    return false;
                } else {  //  Разрешенные указаны, запрешенные нет.
                    /**
                     * Перебираем все цвета.
                     * Перебираем указанные цвета.
                     * Ищем в массиве всех цветов, указанные, разрешенные.
                     */
                    var counter = 0;
                    for (var color in foundColors) {    //  Перебираем все найденные цвета.
                        if (foundColors.hasOwnProperty(color)) {
                            for (var resolved__color in resolvedColors) {
                                if (resolvedColors.hasOwnProperty(resolved__color)) {
                                    if (foundColors[color].toString().replace(/\s/g, '') === resolvedColors[resolved__color].toString().replace(/\s/g, '')) {
                                        //  Выбранный цвет найден.
                                        hrefArray[counter] = foundItems[color].parentElement.parentElement.children["0"].attributes[1].value;
                                        counter++;
                                        break;
                                    }
                                }
                            }   
                        }
                    }
                }
            } else {
                if (resolvedColors[0] === undefined) {   //  Разрешенные не указаны, запрещенные указаны.
                    var counter = 0;
                    for (var color in foundColors) {    //  Перебираем все найденные цвета.
                        var c__ = 0, flag = false, contin = true;
                        if (foundColors.hasOwnProperty(color)) {
                            for (var forbidden__color in forbiddenColors) {
                                if (forbiddenColors.hasOwnProperty(forbidden__color) && (contin)) {
                                    if ((foundColors[color].toString().replace(/\s/g, '') === forbiddenColors[forbidden__color].toString().replace(/\s/g, ''))) {
                                        flag = true;
                                        contin = false;
                                        break;
                                    } else {
                                        if (!flag) {
                                            if (c__ === (f_c - 1)) {
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
                } else {  //  Указаны и запрещенные и разрешенные.
                    console.log("Указаны и запрещенные и разрешенные.");
                    //  Добавить алгоритм.
                    /**
                     * Построить массив всех присутствующих цветов.
                     * Оставить только разрешенные цвета.
                     * Запретить к выбору запрещенные цвета.
                     */
                }
            }
        }
        if(hrefArray[0] === undefined){
            LogActions.addToLog("Selected color not found!");
            if(GLOBAL__SETTINGS["SelectAnyColor"] === 1){
                for (var i = 0; i < foundItems.length; i++) {
                    hrefArray[i] = foundItems[i].parentElement.parentElement.children["0"].attributes[1].value;
                }
                LogActions.addToLog("Select any color is checked! Select any color with entered size.");
                return hrefArray;
            }else{
                LogActions.addToLog("<b class='error'>No color selected!</b>");
                return false;
            }
        }else{
            LogActions.addToLog("Selected some colors. Choose the one that has the specified size.");
            return hrefArray;
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
        LogActions.addToLog("Filling in the card data.");
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
        LogActions.addToLog("Send a request for payment.");
        var selector = document.querySelector('input[name="commit"]');
        BasicFunctions.simulateClick(selector);
    }
    
    /**
     * Функция редиректа на страницу checkout.
     * @returns {undefined}
     */
    goToCheckoutPage() {
        chrome.storage.local.set({"checkout": "start_actions"}, function () {}); // Указываем место, откуда был сделан редирект на страницу checkout.
        LogActions.addToLog("Go to checkout page.");
        if (GLOBAL__SETTINGS["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
            LogActions.addToLog("Waiting time for response: 200 ms.");
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
                if (GLOBAL__SETTINGS["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                    LogActions.addToLog("Waiting time for response: " + (forced * 50) + " ms.");
                }
                //  Проводим платежную операцию.
                CheckoutActions.prototype.pressProcessPayment();
                //LogActions.showLogPage();
                
                //  Ожидание ответа сервера.
                var forced_p = 0;
                var waiting_p = setInterval(function () {
                    //  Ожидание загрузки страницы.
                    if (document.querySelector('div[id="confirmation"]') !== null) {
                        clearInterval(waiting_p);
                        LogActions.addToLog("Payment request was successfully sent.");
                        if (GLOBAL__SETTINGS["ServerResponseTime"] === 1) {   //  Если в настройкох установлена галочка, выводить время ответа сервера.
                            LogActions.addToLog("Payment timeout: " + (forced_p * 50) + " ms.");
                        }
                        // Читаем ответ сервера.
                        var response = $("#confirmation").children("p");
                        LogActions.addToLog($(response[0]).text());

                        //  Расчет времени выполнения.
                        if (GLOBAL__SETTINGS["CalculateTotalTime"] === 1) {
                            var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
                            LogActions.addToLog("The end value of the stopwatch. Timestamp: " + timeStampInMs);
                            chrome.storage.local.get("timestamp", function (stor) {
                                var time_diff = Math.floor(timeStampInMs - stor["timestamp"]);
                                LogActions.addToLog("Total execution time: " + (time_diff / 1000) + " sec.");
                                LogActions.showLogPage();
                                // Удаляем 
                                chrome.storage.local.remove("operations", function () {});
                                return true;
                            });
                        }
                    }
                    if (forced > GLOBAL__TIMEOUT) {    //  Если ожидание слишком долгое.
                        LogActions.addToLog("<b class='error'>Payment timeout expired.</b>");
                        clearInterval(waiting);
                        return false;
                    }
                    forced_p++;
                }, GLOBAL__INTERVAl);
                
            }
            if (forced > GLOBAL__TIMEOUT) {    //  Если ожидание слишком долгое.
                LogActions.addToLog("<b class='error'>The payment page is not responding.</b>");
                clearInterval(waiting);
                return false;
            }
            forced++;
        }, GLOBAL__INTERVAl);
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
    addToLog(note) {
        console.log(note);
        GLOBAL__LOG.push(note);
    }

    /**
     * Функция перехода на конечную страницу вывода результата работы.
     * @returns {undefined}
     */
    showLogPage() {
        this.addToLog("Show log page...");
        //console.log(GLOBAL__LOG);
        //  Переносим все записи лога в локальное хранилище.
        chrome.storage.local.set({"log": GLOBAL__LOG}, function () {
            if (GLOBAL__SETTINGS["LogInNewWindow"] === 1) {   //  Если в настройках указано показать лог по завершению.
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
    chrome.tabs.update(sender.tab.id, {url: request.redirect});
    chrome.storage.local.set({"operations": "start_actions"}, function () { });
    // На сообщение из контекста страницы, описанного здесь, ниже.
    if (request === 'show__log') { //проверяется, от того ли окна и скрипта отправлено
        chrome.windows.create({
            url: "log.html",
            type: "popup",
            height: 800,
            width: 500,
            focused: false
        }, function (newWindow) {});
    }
});





/**
 * При загрузке выполняется чтение локального хранилища, достаются массивы: корзины и настроек.
 * Массив корзины перестраивается по первичному ключу id карты.
 * Добавляется массив сопоставления ключа и id карты.
 */
$(document).ready(function () {
    BasicFunctions = new BasicFunctions;
    ItemsActions = new ItemsActions;
    CheckoutActions = new CheckoutActions;
    LogActions = new LogActions;
    
    chrome.storage.local.get("settings", function (resp) {
        if (resp["settings"]["HideAllAnimations"] === 1) {   //  Hide all animations on supreme site.
            if (window.location.href !== "https://www.supremenewyork.com/checkout") {
                //  Ускоряем операции на странице, все анимации убираем, все opacity 1.
                var preloaderUrl = chrome.extension.getURL("css/restyle-style.css");
                var link = document.createElement("link");
                link.setAttribute("rel", "stylesheet");
                link.setAttribute("type", "text/css");
                link.setAttribute("href", preloaderUrl);
                document.getElementsByTagName("head")[0].appendChild(link);
            }
        }
        //  Другие настраиваемые действия с оформлением сайта supreme.
        //  ...
    });


    chrome.storage.local.get(function (storage) {   //  Reading local storage.
        if (window.location.href === "https://www.supremenewyork.com/checkout") {   //  Если это страница checkout.
            if (storage["checkout"] !== undefined) {    //  Определяем откуда открыта страница.
                GLOBAL__SETTINGS = storage["settings"];
                //  Переносим лог на эту страницу.
                for (var note in storage["log"]) {
                    if (storage["log"].hasOwnProperty(note)) {
                        GLOBAL__LOG.push(storage["log"][note]);
                        console.log(storage["log"][note]);
                    }
                }
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
                CheckoutActions.checkoutPayment();
            } else {
                console.log("No auto checkout!");
            }
            chrome.storage.local.remove("checkout", function () {
                //console.log('Operations array removed');
            });
        } else {
            if (storage["operations"] !== undefined) {  //  Определяем откуда была открыта страница. Скрипт запускается только при редиректе со страницы options.
                // Инициализация лога.
                chrome.storage.local.set({"log": {}}, function () {   // Раскоментить 
                    // Делаем метку времени, на ее основании вычислим полное время выполнения операций.
                    var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
                    LogActions.addToLog("Initialize total running stopwatch. Timestamp: " + timeStampInMs);
                    chrome.storage.local.set({"timestamp": timeStampInMs}, function () {
                        LogActions.addToLog("Initialize log page.");
                        LogActions.clearLog();
                        LogActions.addToLog("Reading cart and arranging the arrays.");
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
                        LogActions.addToLog("Start auto actions on page.");
                        BasicFunctions.startActions();
                    });
                });
            } else {  //  Ничего не делаем. На страницу зашли не из под расширения.
                console.log("Inactivity.");
            }
        }

    });
    //  Удаление массива операций, сделано для того, чтобы при каждом посещении страницы магазина самопроизвольно не запускался скрипт расширения.
    chrome.storage.local.remove("operations", function () {});
});