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
function addToCard(){
    alert("RABOTAet");
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
    var url = "https://www.supremecommunity.com/season/spring-summer2018/droplist/2018-03-01/";
    // Получаем и парсим код Steam страницы с предметом
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status === 200) {    //  Если запрос успешно дал ответ.
            // Парсим страницу с последним дропом.
            var el = $("<div></div>");
            el.html(xhr.responseText);
            //  Общие данные.
            var title = $(".container h1",el).text();
            var titleInfo = $(".lead",el).text();
            //  Помещаем общие данные на страницу.
            var droplistNumber = document.createElement("div");
            droplistNumber.setAttribute("class", "droplist-title");
            droplistNumber.innerHTML = "<h1 id='droplist-number'>"+ title +"</h1>";
            var droplistInfo = document.createElement("div");
            droplistInfo.setAttribute("class", "droplist-title");
            droplistInfo.innerHTML = "<h2 id='droplist-info'>"+ titleInfo +"</h2>";
            document.getElementById("content-droplist").appendChild(droplistNumber);
            document.getElementById("content-droplist").appendChild(droplistInfo);
            //  Данные о предметах.
            var itemsName = $(".card__body h5",el); //  Имена предметов.
            var itemsImgURL = $(".masonry__item img",el); //  Части ссылок на изображения предметов.
            var itemsPrices = $(".label-price",el); //  Цены предметов.
            //  Все данные получены, вставляем на страницу.
            //  Создаем контейнеры и наполняем их.
            var items = {};
            for( var i = 0; i < $(itemsName).length; i++){
                //  Build items array.
                items[i] = {
                    "name": $(itemsName[i]).text(),
                    "img": $(itemsImgURL[i]).attr("src"),
                    "price": $(itemsPrices[i]).text()
                }; 
                //  Build content.
                var newItem = document.createElement("div");
                newItem.setAttribute("class", "item-container");
                newItem.innerHTML = '<div class="item-img no-select">'+
                                        '<img src="https://www.supremecommunity.com'+$(itemsImgURL[i]).attr("src")+'" width="95%">'+
                                    '</div>'+
                                    '<div class="item-title">'+
                                        '<h5>'+$(itemsName[i]).text()+'</h5>'+
                                    '</div>'+
                                    '<div class="item-other">'+
                                        '<div class="item-price">'+
                                            '<span>'+$(itemsPrices[i]).text()+'</span>'+
                                        '</div>'+
                                        '<div class="item-addToCart" id="item-'+i+'">'+
                                            '<span>Add to Cart</span>'+
                                        '</div>'+
                                    '</div>';
                document.getElementById("content-droplist").appendChild(newItem);
            }
            //  When items uploaded. Show droplist block.
            $("#content-droplist").fadeIn(1000);
            // Save items to local storage.
            chrome.storage.local.set({ 'items' : items} , function(){});
            //  Add listeners on adding items to cart.
            for(var prop in items) {
                if(items.hasOwnProperty(prop)){
                    //console.log(items[prop]);
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
                                console.log(data,len+1);
                                writeNewCart(data);

                                function writeNewCart(data){
                                    chrome.storage.local.set({ 'cart' : data}, function(){
                                        var itemsAmount = 0;
                                        for(var item in data){
                                            if(data.hasOwnProperty(item)){
                                                itemsAmount++;
                                                console.log("abrakadabre!");
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
    
    
    document.getElementById("cart-preview").addEventListener("click", showCart);
});

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
            console.log(tempArray);
            //  Items in cart.
            var totalPrice = 0;
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
                        "<td><a id='remove-item-" + itemNumber + "'>remove</a></td>" + 
                        "<td>" + sortArray[item]['amount'] + "</td>" + 
                    "</tr>");
                }
            }
            $("#total-price").html("<b>subtotal: " + totalPrice + "$</b>");
            $("#amount-items-in-cart-2").text(counter);
        });
        
        //  Distribution by payment cards.
        
        
        
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
/*
 * Function delete selected card.
 */
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
    updateCardList();   //  Build card list.
    
    // Onchange card action.
    $('#select-card-list').on("change",function() {
        var card = $(this).val();    //  Value of select field.
        console.log(card);
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