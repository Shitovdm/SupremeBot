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
    $("#content-droplist").css("display","block");
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
    $("#content-form").css("display","block");
}

function addToCard(){
    alert("RABOTAet");
}

document.addEventListener("DOMContentLoaded", function () { //  Дроплист
    /*удалить*/
    chrome.storage.local.get(function(cart){
                            console.log(cart);
                        });
    //  Активная вкладка по умочанию.
    $("#nav-form").css({
        "border-bottom" : "none",
        "background-color" : "inherit"
    }); 
    $("#content-droplist").css("display","block");
    
    // Вешаем на вкладки события переключения.
    document.getElementById("nav-droplist").addEventListener("click", navbarSwitchOnDroplist);
    document.getElementById("nav-form").addEventListener("click", navbarSwitchOnFormData);
    //  Загрузка дроплиста с крмьюнити.
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
            // Save items to local storage.
            chrome.storage.local.set({ 'items' : items} , function(){ 
                console.log("Items saved!");
            });
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
                        });
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
                                    console.log("adding item", itemID);
                                });
                            } 
                        });
                        
                         /*chrome.storage.local.remove('cart' , function() {
                             console.log("remover");
                         });*/
                        
                        
                        
                    });
                }
            }
        }
    };
    
    
    document.getElementById("show-cart").addEventListener("click", showCart);
});

function hideCart(){
    $(".cart-page").css({position: "relative"});
    $(".cart-page").hide();
    $("#transparent-bg").hide();
    $("#show-cart").show();
}   
//  Функция выезжающей корзины.
function showCart(){
    $(".cart-page").css({position: "fixed"});
    $(".cart-page").fadeIn("fast");
    $("#transparent-bg").fadeIn("fast");
    $("#show-cart").fadeOut("fast");
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
        //  Remove all data about this card.
        chrome.storage.local.remove([cardIdentificator], function() {
            console.log('Card removed');
        });
        //  Get all data into fields.
        var cardData = {};
            cardData.fullName = $("#full-name").val();
            cardData.email = $("#email").val();
            cardData.tel = $("#tel").val();
            cardData.address = $("#address").val();
            cardData.address2 = $("#address-2").val();
            cardData.address3 = $("#address-3").val();
            cardData.city = $("#city").val();
            cardData.postcode = $("#postcode").val();
            cardData.country = $("#country").val();
            cardData.identificator = $("#card-identificator").val();
            cardData.cardType = $("#card-type").val();
            cardData.cardNumber = $("#card-number").val();
            cardData.cardMonth = $("#card-month").val();
            cardData.cardYear = $("#card-year").val();
            cardData.cardCVV = $("#card-cvv").val();
            cardData.cardMoney = $("#card-money").val();

        //  Search empty fields.
        var emptyFlag = false;
        for(var prop in cardData) {
            if(cardData.hasOwnProperty(prop)){
                //console.log(prop);
                if( (prop != "address2") && (prop != "address3") ){
                    if(cardData[prop] == ""){
                        alert(prop + " is empty! But entered data save.");
                        //emptyFlag = true;
                        break;
                    }
                }
            }               
        }
        // If not empty fields.
        //if(!emptyFlag){
            chrome.storage.local.set({ [cardData.identificator] : cardData} , function(){ 
                console.log("Card saved!");
            });
        //}
    } 
}
/*
 * Function delete selected card.
 */
function deleteCard(){
     var cardIdentificator = $('#select-card-list').val();
    chrome.storage.local.remove([cardIdentificator], function() {
        $("#select-card-list").html("<option value='' disabled selected>SELECT CARD</option>");
        updateCardList();
        clearAllFields();
        alert("Card '" + cardIdentificator + "' has been removed!");
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
    //  Get all form fields.
    var cardData = {};
        cardData.fullName = $("#full-name").val();
        cardData.email = $("#email").val();
        cardData.tel = $("#tel").val();
        cardData.address = $("#address").val();
        cardData.address2 = $("#address-2").val();
        cardData.address3 = $("#address-3").val();
        cardData.city = $("#city").val();
        cardData.postcode = $("#postcode").val();
        cardData.country = $("#country").val();
        cardData.identificator = $("#card-identificator").val();
        cardData.cardType = $("#card-type").val();
        cardData.cardNumber = $("#card-number").val();
        cardData.cardMonth = $("#card-month").val();
        cardData.cardYear = $("#card-year").val();
        cardData.cardCVV = $("#card-cvv").val();
        cardData.cardMoney = $("#card-money").val();
    //  If isset card name.
    if(cardData.identificator != ""){
        //  If whis card alredy in list.
        var container = $("#select-card-list").children("option");
        var coincidenceFlag = false;
        for(var i = 1; i < $(container).length; i++){
            if(cardData.identificator == $(container[i]).text()){
                coincidenceFlag = true;
                break;
            }
        }
        if(!coincidenceFlag){   //  No matches found.
            //  Add new card into local srorage and into card list.
            var list = document.getElementById("select-card-list");
            list.options[list.options.length] = new Option(cardData.identificator, cardData.identificator);
            chrome.storage.local.set({ [cardData.identificator] : cardData} , function(){ 
                alert("Card '" + cardData.identificator + "' has been addad!");
            });
        }else{
            alert("A card with that name already exists!");
        }
    }else{
        alert("Enter card name!");
    }
}

function updateCardList(){
    chrome.storage.local.get(function(cardData) {
        var list = document.getElementById("select-card-list");
        for(var prop in cardData) {
            if(cardData.hasOwnProperty(prop)){
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
        chrome.storage.local.get(card, function(cardData) {
            //  Placing data into form.
            $("#full-name").val(cardData[card]["fullName"]);
            $("#email").val(cardData[card]["email"]);
            $("#tel").val(cardData[card]["tel"]);
            $("#address").val(cardData[card]["address"]);
            $("#address-2").val(cardData[card]["address2"]);
            $("#address-3").val(cardData[card]["address3"]);
            
            $("#city").val(cardData[card]["city"]);
            $("#postcode").val(cardData[card]["postcode"]);
            $("#country").val(cardData[card]["country"]);
            
            $("#card-identificator").val(cardData[card]["identificator"]);
            $("#card-type").val(cardData[card]["cardType"]);
            $("#card-number").val(cardData[card]["cardNumber"]);
            $("#card-month").val(cardData[card]["cardMonth"]);
            $("#card-year").val(cardData[card]["cardYear"]);
            $("#card-cvv").val(cardData[card]["cardCVV"]);
            $("#card-money").val(cardData[card]["cardMoney"]);
            
        });
    });
});

document.addEventListener("DOMContentLoaded", function () { //  For Droplist
    document.getElementById("save-button").addEventListener("click", saveCard);  //  
    document.getElementById("delete-button").addEventListener("click", deleteCard);  //  
    document.getElementById("clear-button").addEventListener("click", clearAllFields);  // 
    document.getElementById("add-card").addEventListener("click", addCard);  //
});