
//  Current time;
function getTime(){
    var date = new Date();
    var h =  date.getUTCHours() - 4;
    var m = date.getUTCMinutes();
    (m < 10) ? ( m = "0" + m) : ( m = m );
    var s = date.getUTCSeconds();
    (s < 10) ? ( s = "0" + s) : ( s = s );
    var time = (h > 12) ? (h-12 + ':' + m + ':' + s + ' pm') : (h + ':' + m + ':' + s + ' am');
    $("#LDN-time").text(time);
    //  Действия по таймеру. Установить значение времени и все.
    /*if(s == 10 || s == 40){
        chrome.runtime.sendMessage({redirect: "http://www.supremenewyork.com/shop/all/"});
    }*/
}
    
    
    
    
//  Accept button availability.
function acceptAvailability(state){
    if(state == 0){
        $(".cart-bottom input").css("background-color","#dddddd");
        $(".cart-bottom input").css("cursor","default");
        document.getElementById("accept-button").removeEventListener("click", acceptCart);
    }else{
        $(".cart-bottom input").css("background-color","#ff0000");
        $(".cart-bottom input").css("cursor","pointer");
        document.getElementById("accept-button").addEventListener("click", acceptCart);
    }
    
}

function recalculation(){
    //  get all items in all cards;
    var break_flag = false;
    var conteiners = $(".cardItemsContainer");
    var cardWriteOffSum = {};
    for(var t = 0; t < $(conteiners).length; t++){  //  Bypassing all cards.
        cardWriteOffSum[t] = 0;
        var item = $(conteiners[t]).children("div");
        //  Обход все предметов привязанных к карте.
        for(var it = 0; it < $(conteiners[t]).children("div").length; it++){
            cardWriteOffSum[t] += Number(($(item[it]).children("span").text()).split("$")[0]);
            for( var im = 0; im < $(conteiners[t]).children("div").length; im++){
                if(it !== im){
                    if($(item[im]).attr("num") === $(item[it]).attr("num")){
                        console.log("Repeat the items on one card!");
                        acceptAvailability(0);
                        break_flag = true;
                    }
                }
            }
        }
        
        $("#writeOffFromCard-" + t).text(cardWriteOffSum[t]);
        
        //  checking all sum.
        if($("#ballance-card-" + t).text() < cardWriteOffSum[t]){
            $("#writeOffFromCard-" + t).addClass("error");
            acceptAvailability(0);
            break;
        }else{
            if(!break_flag){
                $("#writeOffFromCard-" + t).removeClass("error");
                acceptAvailability(1);
            }
        }
        
        
    }
}


/******************* Функции для дроплиста ********************/
//  Переключение на Droplist.
function navbarSwitchOnDroplist(e){ 
    //  Скрываем форму.
    $("#nav-form").css({
        "border-bottom" : "none",
        "background-color" : "inherit"
    }); 
    $("#content-form").css("display","none");
    //  Показываем дроплист.
    $("#nav-droplist").css({
        "border-bottom" : "5px solid #ff0000",
        "background-color" : "#fff"
    });
    $("#content-droplist").fadeIn(1000);
}
//  Переключение на Form Data.
function navbarSwitchOnFormData(e){ 
    //  Скрываем дроплист.
    $("#nav-droplist").css({ 
        "border-bottom" : "none",
        "background-color" : "inherit"
    });
    $("#content-droplist").css("display","none");
    //  Показываем форму. 
    $("#nav-form").css({
        "border-bottom" : "5px solid #ff0000",
        "background-color" : "#fff"
    });
    $("#content-form").fadeIn(1000);
}
function onChangeDroplist(){
    //  Onchange droplist.
    $('#droplist-number').on("change",function() {
         loadDropContent($(this).val());
    });
}

function loadDropContent(droplist){
    var url = "https://www.supremecommunity.com/season/spring-summer2018/droplist/" + droplist;
    // Get sourse code, parse.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status === 200) {
            // Parse page content.
            var doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
            var droplists = doc.getElementsByClassName("block");
            //  Inject common data.
            $("#droplist-info").text("Items releasing on " + droplist + ". Prices are not guaranteed until after drop.");
            $("#items-content").html("");
            //  Items data.
            var itemsName = doc.getElementsByClassName("card__body");
            var itemsImgURL = doc.getElementsByClassName("masonry__item"); //  Части ссылок на изображения предметов.
            var itemsPrices = doc.getElementsByClassName("label-price"); //  Цены предметов.
            //  Все данные получены, вставляем на страницу.
            //  Создаем контейнеры и наполняем их.
            var items = {};
            for( var i = 0; i < $(itemsName).length; i++){
                //  Build items array.
                var imgCont = $(itemsImgURL[i]).context.children["0"].children["0"].children["0"].children["0"];
                var type = ($(itemsImgURL[i]).attr("class").split(" ")[3]).split("-")[1];
                if(type === "t"){
                    var type = ($(itemsImgURL[i]).attr("class").split(" ")[3]).split("-")[1] + "-" + ($(itemsImgURL[i]).attr("class").split(" ")[3]).split("-")[2];
                }
                items[i] = {
                    "name": $(itemsName[i]).children("h5").text(),
                    "img": $(imgCont).attr("src"),
                    "price": $(itemsPrices[i]).text(),
                    "type": type
                }; 
                //  Build content.
                var newItem = document.createElement("div");
                newItem.setAttribute("class", "item-container");
                newItem.innerHTML = '<div class="item-type">' + type + '</div>'+
                                    '<div class="item-img no-select">'+
                                        '<img src="https://www.supremecommunity.com' + $(imgCont).attr("src") + '" width="95%">'+
                                    '</div>'+
                                    '<div class="item-title">'+
                                        '<h5>' + $(itemsName[i]).text() + '</h5>'+
                                    '</div>'+
                                    '<div class="item-other">'+
                                        '<div class="item-price">'+
                                            '<span>' + $(itemsPrices[i]).text() + '</span>'+
                                        '</div>'+
                                        '<div class="item-addToCart" id="item-' + i + '" name="' + $(itemsName[i]).text() + '">'+
                                            '<span>Add to Cart</span>'+
                                        '</div>'+
                                    '</div>';
                            
                document.getElementById("items-content").appendChild(newItem);
                if( ((i+1)%4 === 0) && (i !== 0)){
                    $("#items-content").append("<div class='clear'></div>");
                }
                
            }
            //  When items uploaded. Show droplist block.
            $("#content-droplist").fadeIn(1000);
            // Save items to local storage.
            chrome.storage.local.set({ 'items' : items} , function(){});
            //  Add listeners on adding items to cart.
            var new_data = {};
            for(var prop in items) {
                if(items.hasOwnProperty(prop)){
                    document.getElementById("item-" + prop).addEventListener("click", function(prop){
                        var itemID = "";
                        if(prop.target.localName === "span"){
                            itemID = prop.target.parentElement.id;
                            var parentElem = prop.target.parentElement.parentElement.parentElement;
                        }else{
                            if(prop.target.localName === "div"){
                                itemID = prop.target.id;
                                var parentElem = prop.target.parentElement.parentElement;
                            }
                        }
                        //  Достаем данные о предмете.
                        var itemName = parentElem.children[2].children["0"].innerText;   //  Item name
                        var imageSrc = parentElem.children[1].children["0"].attributes["0"].value;   //  Image src.
                        var itemType = parentElem.children["0"].innerText;   //  Item type.
                        var itemPrice =  parentElem.children[3].children["0"].innerText;   //  Item price.
                        //  Fint cart in local storage. if cart not found, add cart.
                        chrome.storage.local.get( function(result){
                            //  Создана ли корзина.
                            var issetCart = false;
                             for(var prop in result) {
                                if((result.hasOwnProperty(prop)) && (prop == "cart")){
                                    issetCart = true;
                                    break;
                                }
                            }
                            //  Если корзины еще нет, создаем ее.
                            if(!issetCart){
                                //  Add cart into local storage;
                                chrome.storage.local.set({ 'cart' : {}}, function(){ 
                                    console.log("cart added!");
                                });
                            }
                            //  Adding new item into cart.
                            chrome.storage.local.get( 'cart', function(result){
                                var data = result["cart"];
                                var len = 0;
                                for(var prop in data) {
                                    if(data.hasOwnProperty(prop)){
                                        len++;
                                    }
                                }
                                data[len] = {
                                    id: itemID,
                                    size: "Any",
                                    color: "Any",
                                    name: itemName,
                                    img: imageSrc,
                                    price: itemPrice,
                                    type: itemType
                                };
                                
                                writeNewCart(data);
                                function writeNewCart(data){
                                    chrome.storage.local.set({ 'cart' : data}, function(){
                                        var itemsAmount = 0;
                                        for(var item in data){
                                            if(data.hasOwnProperty(item)){
                                                itemsAmount++;
                                            }
                                        }
                                        $("#amount-items-in-cart").text( itemsAmount);
                                        $("#amount-items-in-cart").css({display:"block"});
                                        $("#amount-items-in-cart").css("animation", "itemsAmountScale 0.5s infinite ease-in-out");
                                        setTimeout(function(){
                                            $("#amount-items-in-cart").css("animation", "none");
                                        },1000);
                                    });
                                } 
                            });
                        });
                    });
                }
            }
        }else{
            //alert("ERR_INTERNET_DISCONNECTED");
        }
    };
}


document.addEventListener("DOMContentLoaded", function () { //  Дроплист
    
    
    
    
    chrome.storage.local.get('settings',function(settings){
        var changeBg_FLAG = settings["settings"]["AutoChangeBg"];   //  Флаг слены фона.
        var OneStaticPicture_FLAG = settings["settings"]["OneStaticPicture"];
        var MinimalisticDesign_FLAG = settings["settings"]["MinimalisticDesign"];   //  Флаг упрощенного дизайна.
        if(MinimalisticDesign_FLAG === 1){
            $(".data-options").css("background-image","none");
        }else{
            if(changeBg_FLAG === 1){
               var BgImageCounter = 1;
               //  Background image changer. Every 20 seconds.
                setInterval(function(){
                     // Change bg image.
                     if(BgImageCounter === 5){ BgImageCounter = 1; }
                     $(".data-options").css("background-image","url('/img/store/store-" + BgImageCounter + ".jpg')");
                     BgImageCounter++;
                 }, 20000); 
            }else{
                if(OneStaticPicture_FLAG === 1){
                    $(".data-options").css("background-image","url('/img/store/store-2.jpg')");
                }
            }
        }
        
    });
    //  Удалить!!!
    chrome.storage.local.get(function(resp){
        console.log(resp);
    });
    /*
    chrome.storage.local.remove("cart",function(resp){
        console.log(resp);
    });
    */
     // Timer on start page;
     getTime();
     $("#LDN-time").css("z-index","5");
     setInterval(function(){
         getTime();
     }, 1000);
    
    //  Активная вкладка по умочанию.
    $("#nav-form").css({
        "border-bottom" : "none",
        "background-color" : "inherit"
    }); 
    //  Animations.
    $("#cart-preview").fadeIn(500);
    
    // Вешаем на вкладки события переключения.
    document.getElementById("nav-droplist").addEventListener("click", navbarSwitchOnDroplist);
    document.getElementById("nav-form").addEventListener("click", navbarSwitchOnFormData);
    //  Calculate amount items in cart. Show amount into cart-preview block; 
    chrome.storage.local.get(function(result){
        var issetCart = false;
        var amountItems = 0;
        for (var prop in result) {
            if((result.hasOwnProperty(prop)) && (prop == "cart")) {    //  If cart isset.
                for (var item in result[prop]) {    //  Calculate amount items in basket.
                    if(result[prop].hasOwnProperty(item)){
                        amountItems++;
                    }
                }
                issetCart = true;
                break;
            }
        }
        if(issetCart && amountItems != 0){ //  If the basket is available.
            //  Show amount items in basket.
            $("#amount-items-in-cart").text(amountItems);
            $("#amount-items-in-cart").css({display:"block"});
        }
    });
    //  Download droplist from comunity.
    //  Page with all lists.
    var source = "https://www.supremecommunity.com/season/spring-summer2018/droplists/";
    var source_xhr = new XMLHttpRequest();
    source_xhr.open("GET", source, true);
    source_xhr.send();
    source_xhr.onreadystatechange = function() {
        if (source_xhr.readyState == 4 && source_xhr.status === 200){
            //  Если страница с предметами успешно загрузилась.
            var container = $("<div></div>");
            var a = source_xhr.responseText;
            //console.log(a);
            //container.html(source_xhr.responseText);
            //var droplists = $(".block",a);
            var doc = new DOMParser().parseFromString(source_xhr.responseText, "text/html");
            var droplists = doc.getElementsByClassName("block");
            //  Info.
            $("#droplist-info").html("Items releasing on " + $(droplists[1]).attr("href").split("/")[4] + ". Prices are not guaranteed until after drop.");
            //  Select
            //  Creare select field.
            var droplistSelect = document.createElement("select");
            droplistSelect.setAttribute("id", "droplist-number");
            for(var i = 1; i < $(droplists).length; i++){
                var href = $(droplists[i]).attr("href");
                droplistSelect.innerHTML += "<option value='" + href.split("/")[4] + "'>Droplist " + href.split("/")[4] + "</option>";
            }
            document.getElementById("droplist-title").appendChild(droplistSelect);
            onChangeDroplist();        
                    
            // Loading and inject items data.
            loadDropContent($(droplists[1]).attr("href").split("/")[4]);
        }else{
             /*alert("ERR_INTERNET_DISCONNECTED");
             var errorContainer = document.createElement("div");
             errorContainer.setAttribute("class", "error-container");
             errorContainer.innerHTML = "<h1>Network error!</h1>";
             document.getElementById("items-content").appendChild(errorContainer);
             $("#content-droplist").fadeIn(1000);*/
        }
    };

    document.getElementById("cart-preview").addEventListener("click", showCart);
});


//  Сохраняет измененный цвет или размер.
function saveParam(param,id,value){
    chrome.storage.local.get( "cart", function(result) {
        var cart = result["cart"];
        var data = {};
        var savedParam = id.split("_")[1];
        for(var item in cart){
            if(cart.hasOwnProperty(item)){
                var color = cart[item]["color"];
                var size = cart[item]["size"];
                if(cart[item]["id"] === savedParam){
                    if(param === "size"){
                        size = value;
                    }else{
                        color = value;
                    } 
                }
                data[item] = {
                    id: cart[item]["id"],
                    size: size,
                    color: color,
                    name:  cart[item]["name"],
                    img:  cart[item]["img"],
                    type:  cart[item]["type"],
                    price: cart[item]["price"],
                    amount: cart[item]["amount"]
                };
            }
        }
        chrome.storage.local.set({ 'cart' : data}, function(){});
    });
    
}

//  Cart content builder.
function  buildCart(){
    chrome.storage.local.get( "cart", function(result) {
        var data = result["cart"];
        var sortArray = {};
        var i = 0;
        var counter = 0;    //  Amount of items in cart.
        for(var item in data){
            coincFlag = false;
            if(data.hasOwnProperty(item)){
                //  Sorting items. Association items with same identificator.
                for(var j in sortArray){
                    if(sortArray.hasOwnProperty(j)){
                        if(sortArray[j]["id"] == data[item]["id"]){
                            coincFlag = true;
                            break;
                        }
                    }
                }
                counter++;  //  Amount of items in cart.
                if(!coincFlag){
                    sortArray[i] = {
                        id:  data[item]["id"],
                        size:  data[item]["size"],
                        color:  data[item]["color"],
                        name:  data[item]["name"],
                        img:  data[item]["img"],
                        type:  data[item]["type"],
                        price: data[item]["price"],
                        amount: 1
                    };
                    i++;
                }else{
                    sortArray[j]["amount"] += 1;
                }
            }
        }
        //  Cart content generator.
        //  Items in cart.
        var totalPrice = 0;
        //  Paste amount of items in cart.
        $("#cart-table").html("<tr><td colspan='5'><b id='amount-items-in-cart-2'></b> items in your basket.</td></tr>"); 
        for(var item in sortArray){
            if(sortArray.hasOwnProperty(item)){
                //  Calculate total price.
                if(sortArray[item]["price"] !== ""){
                    var splitPrice = (sortArray[item]["price"]).split("/")[0];
                    splitPrice = (splitPrice).split("$")[1];
                    totalPrice += Number(sortArray[item]['amount']) * Number(splitPrice);
                }else{
                    splitPrice = "NaN";
                }

                //  Generate content.
                $("#cart-table").append("<tr>" + 
                    "<td><img src='" + sortArray[item]["img"] + "' width='50px'></td>" +
                    "<td>" +
                        "<div class='itemName_cart'>" + sortArray[item]["name"] + "</div>" +
                        "<div class='itemParam'>Size: </div>" +
                        "<div class='itemParam fixable' title='Enter keywords separated by commas. For example: Small,XLarge,46,48' contenteditable='true' id='size_" + sortArray[item]['id'] + "'>" + sortArray[item]["size"] + "</div>" +
                        "<div class='clear'></div>" +
                        "<div class='itemParam'>Color: </div>" +
                        "<div class='itemParam fixable' title='Enter keywords separated by commas. For example: Black,Brown' contenteditable='true' id='color_" + sortArray[item]['id'] + "'>" + sortArray[item]["color"] + "</div>" +
                        "<div class='clear'></div>" +
                    "</td>" + 
                    "<td>" + splitPrice + "$</td>" + 
                    "<td><a id='remove-" + item + "'>remove</a></td>" + 
                    "<td>" + sortArray[item]['amount'] + "</td>" + 
                "</tr>");

                //  Тут все не очень хорошо, нет upbind mouseup, поэтому обработчики накапливаются. Исправить.
                //  Add event listener to select size and color.
                document.getElementById("size_" + sortArray[item]['id']).addEventListener("click", function(e){
                    $("#" + e.target.id).css({"border": "1px solid #ccc", "margin-top": "3px", "cursor": "text"});
                    $(document).mouseup(function(t){ // событие клика по веб-документу
                        var div = $("#" + e.target.id); // тут указываем ID элемента
                        if (!div.is(t.target) && div.has(t.target).length === 0){
                            $("#" + e.target.id).css({"border": "none", "margin-top": "5px"});
                            //  Сохраняем изменения.
                            saveParam("size",e.target.id,$("#" + e.target.id).text());
                        }
                    });   
                });
                document.getElementById("color_" + sortArray[item]['id']).addEventListener("click", function(e){
                    $("#" + e.target.id).css({"border": "1px solid #ccc", "margin-top": "3px", "cursor": "text"});
                    $(document).mouseup(function(t){ // событие клика по веб-документу
                        var div = $("#" + e.target.id); // тут указываем ID элемента
                        if (!div.is(t.target) && div.has(t.target).length === 0){
                            $("#" + e.target.id).css({"border": "none", "margin-top": "5px"});
                            //  Сохраняем изменения.
                            saveParam("color",e.target.id,$("#" + e.target.id).text());
                        }
                    }); 
                });

                //  Add event listener to remove button.
                document.getElementById("remove-" + item).addEventListener("click", function(e){
                    var itemID = e.target.id.substring(7);
                    console.log(itemID);
                    chrome.storage.local.get('cart', function(result){
                        var items = result['cart'];
                        var tempArray = {};
                        var counter = 0;
                        var countRemovedItems = 0;
                        for(var item in items){
                            if(items.hasOwnProperty(item)){
                                if(item !== itemID){  //  Coincidence
                                    tempArray[counter] = items[item];
                                    counter++; 
                                }else{
                                    if(countRemovedItems > 0){
                                        tempArray[counter] = items[item];
                                        counter++;
                                    }else{
                                        countRemovedItems++;
                                    }
                                }
                            }
                        }
                        //  Write net items array to cart.
                        chrome.storage.local.set({ 'cart' : tempArray}, function(){
                            //  Update cart.
                            buildCart();
                        });
                    });
                });
            }
        }
        $("#total-price").html("<b>subtotal: " + totalPrice + "$</b>");
        $("#amount-items-in-cart-2").text(counter);
        if(counter === 0){
            $("#cart-table").append("<b id='warning-empty-cart'>To add an item to the basket, select the item on the 'Droplist' page and click 'Add cart'</b>");
            $("#amount-items-in-cart").text("0");
            $("#amount-items-in-cart").css({display:"none"});
        }else{
            $("#amount-items-in-cart").text(counter);
            $("#amount-items-in-cart").css({display:"block"});
        }
    });

    //  Distribution by payment cards.
    chrome.storage.local.get('card', function(result){
        var res = result['card'];
        $(".card-in-cart").html('<div class="card-title"><b>Distribution by payment cards</b></div>');
        var cardMoney = {};
        var counter = 0;
        for(var card in res){
            if(res.hasOwnProperty(card)){
                //  Build content for card field.
                $(".card-in-cart").append('<div class="card-block">' +
                    '<table>' +
                        '<tr>' +
                            '<td colspan="2">' + card + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>ballance:</td>' +
                            '<td id="ballance-card-' + counter + '">' + res[card]['cardMoney'] + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>to write-off:</td>' +
                            '<td id="writeOffFromCard-' + counter + '"></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td colspan="2">' +
                                '<div class="cardItemsContainer" id="card-' + counter + '"></div>' +
                            '</td>' +
                        '</tr>' +
                    '</table>' +
                '</div>');
                cardMoney[counter] = res[card]['cardMoney'];
                counter++; 
            }
        }
        //  Adding sortable actions on all blocks.

        for(var f = 0; f < counter; f++){
            var connectedItems = "";
            for(var h = 0; h < counter; h++){
                if( f != h ){
                    if(connectedItems != ""){
                        connectedItems += ",";
                    }
                    connectedItems += "#card-" + h; 
                }
            }
            $('#card-' + f).sortable({
                connectWith: connectedItems
            });
        }
        $('.cardItemsContainer').sortable({
            revert: 100,
            placeholder: 'emptySpace',
            receive: function(event, ui){
                //  re-calculate current prices and regrooping items into cards.
                recalculation();
            }
        });

        //  Process items in cart.
        //  Расчет стоимости и распределение по картам.
        chrome.storage.local.get(function(result){
            var cart = result['cart'];
            var items = result["items"];
            var purePrice = {}; //  Массив цен предметов.
            var nums = {};
            var priceTotal = 0; //  Общая сумма.
            var averageByCard = 0;  //  Скодлько в идеале должно быть в ячейке.
            var averageItemPrice = 0;   //  Среднее арифметическое значение цены предмета.
            var coi = 0;
            for(var item in cart){
                if(cart.hasOwnProperty(item)){
                    var num = Number(cart[item]["id"].split("-")[1]);
                    purePrice[coi] = Number(((items[num]["price"].split("/")[0]).substr(1)).split("$")[1]);
                    priceTotal += purePrice[coi];

                    //  Algo.
                    /*console.log(num);
                    $("#card-0").append('<div class="sortable" id="item-min-"' + num + '>' +
                        '<img class="itemImage" src="https://www.supremecommunity.com' + items[num]["img"] + '" width="90%">' +
                        '<span class="itemTitle">' + purePrice[coi] + '$</span>' +
                    '</div> ');*/

                    nums[coi] = num;
                    coi++;
                }
            }

            averageItemPrice = priceTotal / coi;
            averageByCard = priceTotal / counter;

            function pasteItemOnCard(j,i,img,price){
                $("#card-" + j).append('<div class="sortable" num="item-min-' + i + '">' +
                    '<img class="itemImage" src="https://www.supremecommunity.com' + img + '" width="90%">' +
                    '<span class="itemTitle">' + price + '$</span>' +
                '</div> ');
            }

            //  Search item with max price;
            var max = 0;
            for(var i = 0; i < coi; i++){
                if( purePrice[i] > max){
                    max = purePrice[i];
                }
            }

            //  Mapping.
            var mappingArray = {};
            for(var i = 0; i < counter; i++){
                mappingArray[i] = 0;
            }
            //  Алгоритм таков: выбираем самые крупные и помещаем сначала их, зате раскидываем мелочь.
            for( var i = 0; i < coi; i++){  //  Перебираем все предметы.
                if( purePrice[i] > averageByCard){  //  Находим такие у которых цена выше чем средняя при распределении по картам.
                    for( var j = 0; j < counter; j++){  //  Перебираем все карты.
                        if(mappingArray[j] == 0){   //  Если карта еще пустая.
                            mappingArray[j] = purePrice[i]; //  Помещаем этот предмет на эту карту.
                            pasteItemOnCard(j,nums[i],items[nums[i]]["img"],purePrice[i]);
                            break;
                        }
                    }
                }else{  //  В оставшуюся ячейку кидаем все остальное.
                    for( var j = 0; j < counter; j++){  //  Перебираем все карты.
                        if(mappingArray[j] < averageByCard){   //  Если карта еще пустая.
                            mappingArray[j] += purePrice[i]; //  Помещаем этот предмет на эту карту.
                            pasteItemOnCard(j,nums[i],items[nums[i]]["img"],purePrice[i]);
                            break;
                        }
                    }
                }
            }

            document.getElementById("accept-button").addEventListener("click", acceptCart);
            recalculation();
        });

    });
    
}


/**
 * The function of confirmation of the contents of the basket.
 * Функция подтверждения распределения предметов по картам
 * @returns {undefined}
 */
function acceptCart(){
    // Distribute items by cards.
    var cards = $(".card-block");
    var dist = new Array();
    for(var i = 0; i < cards.length; i++){  // Перебираем все контейнеры карт.
        var container = $(cards[i]).context.children["0"].children["0"].children[3].children["0"].children["0"];
        if(container.children["0"] !== undefined){  //  Все предметы находящиеся на карте.
            for(var j = 0; j < $(container).find('.sortable').length; j++){
                //console.log(container.id, $(container.children[j]).attr("num"));
                var itemID = "item" + $(container.children[j]).attr("num").substr(8);
                dist.push([container.id, itemID]);
            }
        }
    }
    //  Добавляем каждому предмету в корзину информацию о карте на которой он находится.
    chrome.storage.local.get(function (storage) {   //  Reading local storage.
        var cart = storage["cart"];
        for(var item in cart){  //  Все предметы в корзине.
            if(cart.hasOwnProperty(item)){
                //console.log(cart[item]["id"]);
                for(var i = 0; i < dist.length; i++){ //  Все найденные предметы на странице корзины.
                    //console.log(dist[i][1]);
                    if(cart[item]["id"] === dist[i][1]){
                        cart[item]["card"] = dist[i][0];
                        break;
                    }
                }
            }
        }
        //  Записываем новые дополненные массивы.
        chrome.storage.local.set({ "cart" :  cart} , function(){ 
            console.log("The items are successfully distributed on cards.");
            //  Start auto actions.
            chrome.runtime.sendMessage({redirect: "http://www.supremenewyork.com/shop/all/"});
        });
    });   
}

function hideCart(){
    $(".cart-page").css({position: "relative"});
    $(".cart-page").hide();
    $("#transparent-bg").hide();
    $("#cart-preview").show();
}   
//  Функция выезжающей корзины.
function showCart(){
    buildCart();
    $(".cart-page").css({position: "fixed"});
    $(".cart-page").fadeIn("fast");
    $("#transparent-bg").fadeIn("fast");
    $("#cart-preview").fadeOut("fast");
    //  Build content.
    //buildCart();
    jQuery(function($){
	$(document).mouseup(function (e){ // событие клика по веб-документу
            var div = $(".cart-page"); // тут указываем ID элемента
            if (!div.is(e.target) && div.has(e.target).length === 0){
                hideCart();

            }
	});
    });
}

/******************* Функции для форм ********************/

function saveCard(){
    var cardIdentificator = $('#select-card-list').val();
    if(cardIdentificator == null){
        alert("No card selected!");
    }else{
        //  Read card array from storage;
        chrome.storage.local.get("card", function(data) {
            var newArray = {};
            var tempArray = data["card"];
            for(var key in tempArray){
                if(tempArray.hasOwnProperty(key)){
                    if(key != cardIdentificator){
                        //  Add objects to new array.
                        newArray[key] = tempArray[key];
                    }
                }
            }
            //  Get all data into fields.
            var currentCard = {
                fullName : $("#full-name").val(),
                email : $("#email").val(),
                tel : $("#tel").val(),
                address : $("#address").val(),
                address2 : $("#address-2").val(),
                address3 : $("#address-3").val(),
                city : $("#city").val(),
                postcode : $("#postcode").val(),
                country : $("#country").val(),
                identificator : $("#card-identificator").val(),
                cardType : $("#card-type").val(),
                cardNumber : $("#card-number").val(),
                cardMonth : $("#card-month").val(),
                cardYear : $("#card-year").val(),
                cardCVV : $("#card-cvv").val(),
                cardMoney : $("#card-money").val()
            };
            //  Search empty fields.
            for(var prop in currentCard) {
                if(currentCard.hasOwnProperty(prop)){
                    //console.log(prop);
                    if( (prop != "address2") && (prop != "address3") ){
                        if(currentCard[prop] == ""){
                            alert(prop + " is empty! But entered data save.");
                            break;
                        }
                    }
                }               
            }
            //  Add saved card;
            newArray[$("#card-identificator").val()] = currentCard;
            //  Delete old array.
            chrome.storage.local.remove( "card", function() {
                console.log('Card removed');
            });
            //  Save new array.
            chrome.storage.local.set({ "card" :  newArray} , function(){ 
                console.log("Card saved!");
            });
            
        }); 
    } 
}

//  Function delete selected card.
function deleteCard(){
    var cardIdentificator = $('#select-card-list').val();
    chrome.storage.local.get("card", function(data) {
        var tempArray = data["card"];
        var newArray = {};
        for (var key in tempArray) {
            if (tempArray.hasOwnProperty(key)) {
                if (key != cardIdentificator) {
                    //  Add objects to new array.
                    newArray[key] = tempArray[key];
                }
            }
        }
        chrome.storage.local.set({"card": newArray}, function () {
            $("#select-card-list").html("<option value='' disabled selected>SELECT CARD</option>");
            updateCardList();
            clearAllFields();
            alert("Card '" + cardIdentificator + "' has been removed!");
        });
    });
}

//  Clear all fields.
function clearAllFields(){
    $("#full-name").val("");
    $("#email").val("");
    $("#tel").val("");
    $("#address").val("");
    $("#address-2").val("");
    $("#address-3").val("");
    $("#city").val("");
    $("#postcode").val("");
    $("#country").val("");
    $("#card-type").val("");
    $("#card-number").val("");
    $("#card-month").val("");
    $("#card-year").val("");
    $("#card-cvv").val("");
    $("#card-money").val("");
}

//  Function add new card into local storage.
function addCard(){
    //  Read old array.
    chrome.storage.local.get("card", function(data) {
        var tempArray = data["card"];
        console.log(tempArray);
        //  Get all form fields.
        var cardData = {
            fullName : $("#full-name").val(),
            email : $("#email").val(),
            tel : $("#tel").val(),
            address : $("#address").val(),
            address2 : $("#address-2").val(),
            address3 : $("#address-3").val(),
            city : $("#city").val(),
            postcode : $("#postcode").val(),
            country : $("#country").val(),
            identificator : $("#card-identificator").val(),
            cardType : $("#card-type").val(),
            cardNumber : $("#card-number").val(),
            cardMonth : $("#card-month").val(),
            cardYear : $("#card-year").val(),
            cardCVV : $("#card-cvv").val(),
            cardMoney : $("#card-money").val()
        };
        //  If isset card name.
        if($("#card-identificator").val() != ""){
            //  If whis card alredy in list.
            var container = $("#select-card-list").children("option");
            var coincidenceFlag = false;
            for(var i = 1; i < $(container).length; i++){
                if($("#card-identificator").val() == $(container[i]).text()){
                    coincidenceFlag = true;
                    break;
                }
            }
            if(!coincidenceFlag){   //  No matches found.
                //  Add new card into local srorage and into card list.
                var list = document.getElementById("select-card-list");
                list.options[list.options.length] = new Option($("#card-identificator").val(), $("#card-identificator").val());
                tempArray[$("#card-identificator").val()] = cardData;
                chrome.storage.local.set({ "card" :  tempArray} , function(){ 
                    alert("Card '" + $("#card-identificator").val() + "' has been addad!");
                });
            }else{
                alert("A card with that name already exists!");
            }
        }else{
            alert("Enter card name!");
        }
    }); 
}

//  Build card list.
function updateCardList(){
    chrome.storage.local.get(function(result) {
        var list = document.getElementById("select-card-list");
        for(var prop in result["card"]) {
            if(result["card"].hasOwnProperty(prop)){
               list.options[list.options.length] = new Option(prop, prop);
            }
        }
     });
}

function exportCardsData(){
    chrome.storage.local.get(function (result) {
        var res = JSON.stringify(result["card"], "", 4);
        var timestamp = new Date;
        var obj = {
            "filename": "backup-" + timestamp.getTime() + ".json",
            "url": 'data:application/json;charset=utf-8,' + encodeURIComponent(res),
            "conflictAction": "prompt",
            "saveAs": false
        };
  chrome.downloads.download(obj);
    });
    var result = JSON.stringify(localStorage,"", 4);
    
}

//  Change card data.
$(document).ready(function() {
    //  Fill cards in list.
    updateCardList();   //  Build card list
    // Onchange card action.
    $('#select-card-list').on("change",function() {
        var card = $(this).val();    //  Value of select field.
        //  Loading card data from local storage.
        chrome.storage.local.get("card", function(cardData) {
            //  Placing data into form.
            $("#full-name").val(cardData["card"][card]["fullName"]);
            $("#email").val(cardData["card"][card]["email"]);
            $("#tel").val(cardData["card"][card]["tel"]);
            $("#address").val(cardData["card"][card]["address"]);
            $("#address-2").val(cardData["card"][card]["address2"]);
            $("#address-3").val(cardData["card"][card]["address3"]);
            
            $("#city").val(cardData["card"][card]["city"]);
            $("#postcode").val(cardData["card"][card]["postcode"]);
            $("#country").val(cardData["card"][card]["country"]);
            
            $("#card-identificator").val(cardData["card"][card]["identificator"]);
            $("#card-type").val(cardData["card"][card]["cardType"]);
            $("#card-number").val(cardData["card"][card]["cardNumber"]);
            $("#card-month").val(cardData["card"][card]["cardMonth"]);
            $("#card-year").val(cardData["card"][card]["cardYear"]);
            $("#card-cvv").val(cardData["card"][card]["cardCVV"]);
            $("#card-money").val(cardData["card"][card]["cardMoney"]);
            
        });
    });
});

document.addEventListener("DOMContentLoaded", function () { //  For Droplist
    document.getElementById("save-button").addEventListener("click", saveCard);  //  
    document.getElementById("delete-button").addEventListener("click", deleteCard);  //  
    document.getElementById("clear-button").addEventListener("click", clearAllFields);  // 
    document.getElementById("add-card").addEventListener("click", addCard);  //
    document.getElementById("export-card").addEventListener("click", exportCardsData);  //
    
    // Create card array
     chrome.storage.local.get(function(result) {
         var issetCard = false;
         for(var prop in result){
             if((result.hasOwnProperty(prop)) && (prop == "card")){
                 issetCard = true;
                 break;
             }
         }
         if(!issetCard){
             //  Add cart into local storage;
                chrome.storage.local.set({ 'card' : {}}, function(){ 
                    console.log("Card array added!");
                });
         }
         
     });
     
    
});