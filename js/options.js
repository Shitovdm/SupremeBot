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
});



/******************* Функции для форм ********************/

function saveCard(){
    //  Получаем данные всех полей.
    var cardData = {};
    cardData.fullName = $("#full-name").val();
    
    
    alert(cardData["fullName"]);
    
    for(var prop in cardData) {
        if(cardData.hasOwnProperty(prop)){
                    
        }               
    }
    //  Проверяем поля на заполненность.
    /*for(var i = 0; i < $(cardData).length; i++){
        
    }*/
    if(cardData.fullName == ""){
        console.log("Empty");
    }else{
        alert(cardData.fullName);
    }
    
    
    //  Сохраняем данные.
    /*chrome.storage.local.set({'cardNumber': '7894 7894 1236 4512', 'CVV': '789'}, function(){ 
        console.log("Saved!");
    }); */
}

function deleteCard(){
    chrome.storage.local.get(['foo', 'cardNumber'], function(items) {
        console.log('Settings retrieved', items);
    });
}

function clearStorage(){
    chrome.storage.local.clear(function(items) {
        console.log('Storage cleared', items);
    });
}

document.addEventListener("DOMContentLoaded", function () { //  Дроплист
    document.getElementById("save-button").addEventListener("click", saveCard);  //  
    document.getElementById("delete-button").addEventListener("click", deleteCard);  //  
    document.getElementById("clear-button").addEventListener("click", clearStorage);  // 
});