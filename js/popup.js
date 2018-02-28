
function settings(e) {
    console.log("Setings");
}
function information(e) {
    console.log("information");
}
function turnOff(e) {
    console.log("turnOff");
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("settings").addEventListener("click", settings);
    document.getElementById("information").addEventListener("click", information);
    document.getElementById("turnOff").addEventListener("click", turnOff);
});