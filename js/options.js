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
    //  Активная вкладка по умочанию.
    $("#nav-droplist").css({
        "border-bottom" : "none",
        "background-color" : "inherit"
    }); 
    $("#content-form").css("display","block");
    
    // Вешаем на вкладки события переключения.
    document.getElementById("nav-droplist").addEventListener("click", navbarSwitchOnDroplist);
    document.getElementById("nav-form").addEventListener("click", navbarSwitchOnFormData);
    /*
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
            for( var i = 0; i < $(itemsName).length; i++){
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
                                        '<div class="item-addToCart">'+
                                            '<span id="item-'+i+'">Add to Cart</span>'+
                                        '</div>'+
                                    '</div>';
                document.getElementById("content-droplist").appendChild(newItem);
            }
            //console.log($(itemsName).length);
            //console.log($(itemsImgURL[1]).attr("src"));
        }
    };
    */
});



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
                        alert(prop + " is empty!");
                        emptyFlag = true;
                        break;
                    }
                }
            }               
        }
        // If not empty fields.
        if(!emptyFlag){
            chrome.storage.local.set({ [cardData.identificator] : cardData} , function(){ 
                console.log("Card saved!");
            });
        }
    } 
}
/*
 * Function delete selected card.
 */
function deleteCard(){
     var cardIdentificator = $('#select-card-list').val();
    chrome.storage.local.remove([cardIdentificator], function() {
        alert("Card <b>" + cardIdentificator + "</b> has been removed!");
    });
}

function clearStorage(){
    chrome.storage.local.clear(function(items) {
        console.log('Storage cleared', items);
    });
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
                alert("Card <b>" + cardData.identificator + "</b> has been addad!");
            });
        }else{
            alert("A card with that name already exists!");
        }
    }else{
        alert("Enter card name!");
    }
}

//  Change card data.
$(document).ready(function() {
    //  Fill cards in list.
    chrome.storage.local.get(function(cardData) {
        console.log(cardData);
        var list = document.getElementById("select-card-list");
        for(var prop in cardData) {
            if(cardData.hasOwnProperty(prop)){
               list.options[list.options.length] = new Option(prop, prop);
            }
        }
     });
    
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
    document.getElementById("clear-button").addEventListener("click", clearStorage);  // 
    document.getElementById("add-card").addEventListener("click", addCard);  //
});