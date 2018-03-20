
//  Выставление параметров по умолчанию, если ранее они не были установлены.
function setDefaultParams(){
    chrome.storage.local.get(function(resp){
        console.log(resp);
        if(resp["settings"] === undefined){  //  Если в локальном хранилище еще нет сохраненных настроек.
            var settingsArray = {
                LabelSoldOutItems : 0,
                ShowSoldOutItems : 1,
                HideSoldOutItemsOnSupreme : 1,
                EnableTimeSynchronization : 0,
                
                MinimalisticDesign : 0,
                OneStaticPicture: 0,
                AutoChangeBg : 1,
                InterfaceLanguage : "ru",
                
                AutomaticPurchaseItems : 0,
                
                SelectAnySize : 0,
                SelectAnyColor : 0,
                
                AutoFillPaymentForm : 1,
                MaintainFullLog : 1,
                OutputResponseInLog: 1,
                LogInNewWindow: 1,
                ServerResponseTime: 1,
                CalculateTotalTime: 1
            };
            chrome.storage.local.set({ 'settings' : settingsArray},function(){
                console.log("Настройки сохранены в локальном хранилище.");
                getParams();
            });
        }else{
            console.log("Параметры уже были сохранены.");
        }
    });
}

function removeAllParams(){
    chrome.storage.local.remove( "settings", function() {
        console.log('All settings removed!');
    });
}

//  Устанавливает параметры записанные в локальном хранилище.
function getParams(){
    chrome.storage.local.get('settings',function(resp){
        var paramArray = resp["settings"];
        for(var param in paramArray){
            if(paramArray.hasOwnProperty(param)){
               if(paramArray[param].length === undefined){   //  Если состояним может быть только 0 или 1.
                    if(paramArray[param] === 1){
                        $("#" + param).attr("checked","");   
                    }else{
                        $("#" + param).attr("checked");   
                    }
                }else{  //  Если состояние описывается не 0 или 1.
                    $("#" + param).val(paramArray[param]);
                }  
            }
        }
    });
}

//  Изменяет значение параметра в локальном хранилище.
function changeParam(param){
    console.log();
    var state = 0;
    var newParamArray = {};
    if($("#" + param).attr("type") === "checkbox"){  //  Работа с checkbox.
        if($("#" + param).attr("checked") === undefined){    //  Устанавливаем галочку.
            $("#" + param).attr("checked","");
            state = 1;
        }else{  //  Снимаем галочку.
            state = 0;
            $("#" + param).removeAttr("checked");
        }
    }else{  //  Работа с select.
        state = $("#" + param).val();
    }
    chrome.storage.local.get('settings', function(result){
        var storedArray = result["settings"];
        var newValue = 0;
        for(var prop in storedArray){
            if(storedArray.hasOwnProperty(prop)){
                newValue = storedArray[prop];   //  Copy old value;
                if(prop === param){
                    newValue = state;   //  Paste new value;
                }
                newParamArray[prop] = newValue;
            }
        }
        //  Записываем параметр в локальное хранилище.
        chrome.storage.local.set({ 'settings' : newParamArray},function(){
            console.log("Параметр " + param + " был изменен.");
        });
    });
}

//  Navigation.
function showPage(pageId){
    var params = $(".settings-page-link").children("a");
    for(var i = 0; i < $(params).length; i++){
        if(params[i].id !== pageId){
            $("#" + params[i].id + "-content").css("display","none");
        }
    }
    $("#" + pageId + "-content").fadeIn(500);
}

$(document).ready(function() {
    $("#common-settings-content").fadeIn(500);
    //  Проверяем присутствие дефолтных настроек.
    setDefaultParams();
    //  Загружаем ранее установленные настройки из локального хранилища.
    getParams();
    //  Вешаем на все чекбоксы и селекты лиснеры.
    var tunings = $(".tuning");
    for(var i = 0; i < $(tunings).length; i++){
       document.getElementById(tunings[i].id).addEventListener("click", function(t){
            changeParam(t.target.id);
        });
    }
    //  Nav bar button actions.
    document.getElementById("common-settings").addEventListener("click", function(){showPage("common-settings");}); 
    document.getElementById("purchase-settings").addEventListener("click", function(){showPage("purchase-settings");});
    document.getElementById("support-settings").addEventListener("click", function(){showPage("support-settings");});
    document.getElementById("RemoveAllSettings").addEventListener("click", function(){removeAllParams();});
    
});