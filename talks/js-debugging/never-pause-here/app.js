function launchApplication(){
    loadAjaxData(function(data){
        initApp(data);
    });
}

function initApp(data){
    try {
        startApp(data);
    } catch (err) {
        reportErrorToServer(err);
        throw err;
    }
}