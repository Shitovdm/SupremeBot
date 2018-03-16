//  Словарь языков.
var dictionary = {
    "en": {
        "common-settings": "Common",
        "purchase-settings": "Purchase",
        "support-settings": "Support",
        
        "EnableTimeSynchronization-label": "Enable time synchronization",
        "LabelSoldOutItems-label": "Label sold out items in droplist"
    },
    "ru": {
        "common-settings": "Общие",
        "purchase-settings": "Покупки",
        "support-settings": "Поддержка",
        
        "EnableTimeSynchronization-label": "Автоматическая синхронизация времени",
        "LabelSoldOutItems-label": "Помечать распроданные вещи"
    }
};



//  Загрузка языка из локального хранилища.
chrome.storage.local.get('settings',function(settings){
    var lang = settings["settings"]["InterfaceLanguage"];
    console.log(lang);
    //  Заполнение всех текстовых форм.
    for(var text in dictionary[lang]){
        if(dictionary[lang].hasOwnProperty(text)){
            console.log(text);
             $("#" + text).text(dictionary[lang][text]);
        }
    }
    //  Заполнение формы выбора языка.
    for(var lang in dictionary){
        if(dictionary.hasOwnProperty(lang)){
            $("#InterfaceLanguage").append("<option>" + lang + "</option>");
        }
    }
    
    
});

