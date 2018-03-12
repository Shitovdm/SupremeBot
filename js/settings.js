






//  Выставление параметров по умолчанию из локального хранилища.
function setParams(){
    var settingsArray = {
        LabelSoldOutItems : 0,
        ShowSoldOutItems : 1,
        MinimalisticDesign : 0,
        AutoChangeBg : 1,
        InterfaceLanguage : "ru"
    };
    
    chrome.storage.local.set({ 'settings' : settingsArray},function(){
        console.log("OK!");
    });
}
//  Устанавливает параметры записанные в локальном хранилище.
function getParams(){
    chrome.storage.local.get('settings',function(resp){
        var paramArray = resp["settings"];
        console.log(resp);
        for(var param in paramArray){
            if(paramArray.hasOwnProperty(param)){
               if(paramArray[param].length == undefined){   //  Если состояним может быть только 0 или 1.
                    if(paramArray[param] == 1){
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

//  Set settings params functions.
function setParam_LabelSoldOutItems(){
    
}

//  Navigation functions.
function showCommonSettings(){
    $("#purchase-settings-content").css("display","none");
    $("#support-content").css("display","none");
    $("#donate-content").css("display","none");
    $("#common-settings-content").fadeIn(500);
}
function showPurchaseSettings(){
    $("#common-settings-content").css("display","none");
    $("#support-content").css("display","none");
    $("#donate-content").css("display","none");
    $("#purchase-settings-content").fadeIn(500);
}
function showSupport(){
    $("#common-settings-content").css("display","none");
    $("#purchase-settings-content").css("display","none");
    $("#donate-content").css("display","none");
    $("#support-content").fadeIn(500);
}
function showDonate(){
    $("#common-settings-content").css("display","none");
    $("#purchase-settings-content").css("display","none");
    $("#support-content").css("display","none");
    $("#donate-content").fadeIn(500);
}

$(document).ready(function() {
    $("#common-settings-content").fadeIn(500);
    //setParams();
    getParams();
    //  Nav bar button actions.
    document.getElementById("common-settings").addEventListener("click", showCommonSettings); 
    document.getElementById("purchase-settings").addEventListener("click", showPurchaseSettings);
    document.getElementById("support-settings").addEventListener("click", showSupport);
    
    document.getElementById("settings-donate").addEventListener("click", showDonate);

});