
function navbarSwitchOnDroplist(e){ //  Переключение на Droplist.
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

function navbarSwitchOnFormData(e){ //  Переключение на Form Data.
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

document.addEventListener("DOMContentLoaded", function () {
    //  Активная вкладка по умочанию.
    $("#nav-form").css({
        "border-bottom" : "none",
        "background-color" : "inherit"
    }); 
    $("#content-droplist").css("display","block");
    
    // Вешаем на вкладки события переключения.
    document.getElementById("nav-droplist").addEventListener("click", navbarSwitchOnDroplist);
    document.getElementById("nav-form").addEventListener("click", navbarSwitchOnFormData);
    
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
                                        '<div class="item-addToCard">'+
                                            '<span id="item-'+i+'">Add to Card</span>'+
                                        '</div>'+
                                    '</div>';
                document.getElementById("content-droplist").appendChild(newItem);
            }
            //console.log($(itemsName).length);
            //console.log($(itemsImgURL[1]).attr("src"));
        }
    };
});

