
function settings(e) {
    console.log("Setings");
}
function information(e) {
    console.log("information");
}
function turnOff(e) {
    console.log("turnOff");
}

function digitalWatch() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("LDN-time").innerHTML = hours + ":" + minutes + ":" + seconds;
    setTimeout("digitalWatch()", 1000);
    }

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("settings").addEventListener("click", settings);
    document.getElementById("information").addEventListener("click", information);
    document.getElementById("turnOff").addEventListener("click", turnOff);
    
    //  Synchronize the time and start the timer.
    
    //  11/03/2018 01:40pm
    
    //  Current time;
    function getTime(){
        var date = new Date();
        var h =  date.getUTCHours() - 4;
        var m = date.getUTCMinutes();
        (m < 10) ? ( m = "0" + m) : ( m = m );
        var s = date.getUTCSeconds();
        (s < 10) ? ( s = "0" + s) : ( s = s );
        var time = (h > 12) ? (h-12 + ':' + m + ':' + s + ' pm') : (h + ':' + m + ':' + s + ' am');
        $("#LDN-timeR").text(time);
    }
    

});