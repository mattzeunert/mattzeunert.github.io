function loadAjaxData(callback){
    var dataStrings = {
        uiStrings: '{"greeting": "hello world"}',
        pageTitle: 'Never pause here demo',
        user: '{"name": "John Doe", "age": 66}',
        articleDate: "17 March 2016",
        homeUrl: "http://example.com",
        email: "me@example.com",
        accountAge: "23748329",
        lastLogin: "10 March 2016"
    };

    setTimeout(function(){
        var data = {};
        for (var key in dataStrings){
            var value = dataStrings[key];
            if (isJSON(value)){
                data[key] = JSON.parse(value);
            } else {
                data[key] = value;
            }
        }
        callback(data);
    }, 100);
}

function isJSON(string){
    try {
        JSON.parse(string);
        return true;
    } catch (err) {
        return false;
    }
}