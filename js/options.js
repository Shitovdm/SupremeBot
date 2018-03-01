
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
    
});

