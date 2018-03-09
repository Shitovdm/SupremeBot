
/*Drug and drop*/
//  Re-calculating function.


function recalculation(){
    //  get all items in all cards;
    var conteiners = $(".cardItemsContainer");
    var cardWriteOffSum = {};
    for(var t = 0; t < $(conteiners).length; t++){
        cardWriteOffSum[t] = 0;
        var item = $(conteiners[t]).children("div");
        //console.log($(item[0]).children("span").text());
        for(var it = 0; it < $(conteiners[t]).children("div").length; it++){
            cardWriteOffSum[t] += Number(($(item[it]).children("span").text()).split("$")[0]);
            console.log(Number(($(item[it]).children("span").text()).split("$")[0]));
        }
        //console.log(t,"AMOUNT: ",$(conteiners[t]).children("div").length);
        $("#writeOffFromCard-" + t).text(cardWriteOffSum[t]);
    }
    console.log(cardWriteOffSum);
    
}
/*
$(function(){
    $('#card-q').sortable({
        connectWith: '#card-w'
    });
    $('#card-w').sortable({
        connectWith: '#card-q'
    });

    $('.cardItemsContainer').sortable({
        revert: 100,
        placeholder: 'emptySpace',
        receive: function(event, ui){
            //  re-calculate current prices and regrooping items into cards.
            recalculation();
        }
    });
    
});
*/


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
                items[i] = {
                    "name": $(itemsName[i]).children("h5").text(),
                    "img": $(imgCont).attr("src"),
                    "price": $(itemsPrices[i]).text()
                }; 
                //  Build content.
                var newItem = document.createElement("div");
                newItem.setAttribute("class", "item-container");
                newItem.innerHTML = '<div class="item-img no-select">'+
                                        '<img src="https://www.supremecommunity.com' + $(imgCont).attr("src") + '" width="95%">'+
                                    '</div>'+
                                    '<div class="item-title">'+
                                        '<h5>' + $(itemsName[i]).text() + '</h5>'+
                                    '</div>'+
                                    '<div class="item-other">'+
                                        '<div class="item-price">'+
                                            '<span>' + $(itemsPrices[i]).text() + '</span>'+
                                        '</div>'+
                                        '<div class="item-addToCart" id="item-' + i + '">'+
                                            '<span>Add to Cart</span>'+
                                        '</div>'+
                                    '</div>';
                document.getElementById("items-content").appendChild(newItem);
            }
            //  When items uploaded. Show droplist block.
            $("#content-droplist").fadeIn(1000);
            // Save items to local storage.
            chrome.storage.local.set({ 'items' : items} , function(){});
            //  Add listeners on adding items to cart.
            for(var prop in items) {
                if(items.hasOwnProperty(prop)){
                    document.getElementById("item-" + prop).addEventListener("click", function(prop){
                        var itemID = "";
                        if(prop.target.localName === "span"){
                            itemID = prop.target.parentElement.id;
                        }else{
                            if(prop.target.localName === "div"){
                                itemID = prop.target.id;
                            }
                        }
                        //  Fint cart in local storage. if cart not found, add cart.
                        chrome.storage.local.get( function(result){
                            var issetCart = false;
                             for(var prop in result) {
                                if((result.hasOwnProperty(prop)) && (prop == "cart")){
                                    issetCart = true;
                                    break;
                                }
                            }
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
                                data[len] = itemID;
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
        }
    };
}

document.addEventListener("DOMContentLoaded", function () { //  Дроплист
    /*удалить*/
     buildCart();
     
     
    chrome.storage.local.get(function(cart){
        console.log(cart);
    });
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
            console.log(droplists);
            for(var i = 1; i < $(droplists).length; i++){
                console.log($(droplists[i]).attr("href"));
            }
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
        }
    };

    document.getElementById("cart-preview").addEventListener("click", showCart);
});




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
                        if(sortArray[j]["identificator"] == data[item]){
                            coincFlag = true;
                            break;
                        }
                    }
                }
                counter++;  //  Amount of items in cart.
                if(!coincFlag){
                    sortArray[i] = {
                        identificator:  data[item],
                        amount: 1
                    };
                    i++;
                }else{
                    sortArray[j]["amount"] += 1;
                }
            }
        }
        //  Cart content generator.
        //  Take stored items.
        chrome.storage.local.get( "items", function(items) {
            var object = items["items"];
            var tempArray = {};
            for(var item in object){
                if(object.hasOwnProperty(item)){
                    tempArray[item] = {
                        img: object[item]["img"],
                        name: object[item]["name"],
                        price: object[item]["price"]
                    }; 
                }
            }
            //  Items in cart.
            var totalPrice = 0;
            //  Paste amount of items in cart.
            $("#cart-table").html("<tr><td colspan='5'><b id='amount-items-in-cart-2'></b> items in your basket.</td></tr>"); 
            for(var item in sortArray){
                if(sortArray.hasOwnProperty(item)){
                    var itemNumber = (sortArray[item]["identificator"]).split("-")[1];
                    //  Calculate total price.
                    var splitPrice = (tempArray[itemNumber]["price"]).split("/")[0];
                    splitPrice = (splitPrice).split("$")[1];
                    totalPrice += Number(sortArray[item]['amount']) * Number(splitPrice);
                    //  Generate content.
                    $("#cart-table").append("<tr>" + 
                        "<td><img src='https://www.supremecommunity.com" + tempArray[itemNumber]["img"] + "' width='50px'></td>" +
                        "<td>" + tempArray[itemNumber]["name"] + "</td>" + 
                        "<td>" + Number(splitPrice) + "$</td>" + 
                        "<td><a id='remove-" + sortArray[item]['identificator'] + "'>remove</a></td>" + 
                        "<td>" + sortArray[item]['amount'] + "</td>" + 
                    "</tr>");
                    //  Add event listener to remove button.
                    document.getElementById("remove-" + sortArray[item]['identificator']).addEventListener("click", function(e){
                        var itemID = e.target.id.substring(7);
                        chrome.storage.local.get('cart', function(result){
                            var items = result['cart'];
                            var tempArray = {};
                            var counter = 0;
                            var countRemovedItems = 0;
                            for(var item in items){
                                if(items.hasOwnProperty(item)){
                                    if(items[item] != itemID){  //  Coincidence
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
            if(counter == 0){
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
            
            var counter = 0;
            for(var card in res){
                if(res.hasOwnProperty(card)){
                    console.log("qwerty");
                    //  Build content for card field.
                    console.log(card, res[card]['cardMoney']);
                    
                    $(".card-in-cart").append('<div class="card-block">' +
                        '<table>' +
                            '<tr>' +
                                '<td>' + card + '</td>' +
                                '<td><input id="checkBox" type="checkbox"></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>ballance:</td>' +
                                '<td>' + res[card]['cardMoney'] + '</td>' +
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
            chrome.storage.local.get(function(result){
                var cart = result['cart'];
                var items = result["items"];
                
                for(var item in cart){
                    if(cart.hasOwnProperty(item)){
                        var num = Number(cart[item].split("-")[1]);
                        console.log(items[num]["price"]);
                        //  Algo.
                        console.log(num);
                        $("#card-0").append('<div class="sortable" id="item-min-"' + num + '>' +
                            '<img class="itemImage" src="https://www.supremecommunity.com' + items[num]["img"] + '" width="90%">' +
                            '<span class="itemTitle">117$</span>' +
                        '</div> ');
                        

                    }
                }
                
                for(var prop in items){
                    if(items.hasOwnProperty(prop)){
                        //console.log(items[0]["price"]);
                    }
                }
                
                
                
            });
            
        });
        
        // Build cards list.
        /*for(var i = 0; i < 2){
            $("#card-in-cart").append(cardBlock[i]);
        }*/
        
        
        //console.log(sortArray);
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