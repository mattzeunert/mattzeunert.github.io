$(document).ready(function(){
    initializeApp();
})

function initializeApp(){
    setInterval(updateTime, 1000);
}

function padLeft(string, length, padCharacter) {
    while (string.length < length) {
        string = padCharacter + string;
    }
    return string;
}

function getDateString(date){
    var dateString = date.getHours() + ":";
    dateString += padLeft(date.getMinutes().toString(), 2, "0") + ":";
    dateString += padLeft(date.getSeconds().toString(), 2, "0");
    return dateString;
}

function updateTime(){
    var now = new Date();
    var nowString = getDateString(now);
    document.getElementById("clock").innerHTML = nowString;
}