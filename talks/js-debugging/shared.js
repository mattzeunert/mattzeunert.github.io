"use strict";

// compile with `6to5 shared.es6.js > shared.js`
var demoList = [
{
    id: "object-formatters",
    title: "Custom Object Formatters",
    path: "object-formatters/index.html"
},{
    id: "async-call-stack",
    title: "Async Call Stack",
    path: "clock/index.html"
}, {
    id: "blackboxing",
    title: "Library Blackboxing",
    path: "blackboxing/blackboxing.html"
}, {
    id: "restart-frame",
    title: "Restart Frame",
    path: "restart-frame/index.html"
}, {
    id: "behavior-bp",
    title: "Behaviour-based Breakpoints",
    path: "backbone-todomvc/index.html"
}, {
    id: "never-pause-here",
    title: "Pause on Exceptions",
    path: "never-pause-here/index.html"
}//,
//{
//     id: "console",
//     title: "Console Logging",
//     path: "console/index.html"
// }
];

function initHeader(demoId) {


    demoList.forEach(function (demo, i) {
        demo.index = i;
    });

    var currentDemo = demoList.filter(function (demo) {
        return demo.id === demoId;
    })[0];
    var previousDemo = demoList[currentDemo.index - 1];
    var nextDemo = demoList[currentDemo.index + 1];

    var nextButton = "";
    var prevButton = "";
    var numberOfButtonsToShow = 1; // home button
    if (previousDemo) {
        numberOfButtonsToShow++;
        prevButton = "<a class=\"header__btn\" href=\"" + ("../" + previousDemo.path) + "\">\n            &#10094;\n        </a>";
    }
    if (nextDemo) {
        numberOfButtonsToShow++;
        nextButton = "<a class=\"header__btn\" href=\"" + ("../" + nextDemo.path) + "\">\n            &#10095;\n        </a>";
    }


    document.getElementById("header").innerHTML = "\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\n        \n        <style>\n            .page-content {\n                padding: 10px;\n            }\n            #header {\n                overflow: hidden;\n                background: #1D1D98;\n                color: white;\n                margin-bottom: 10px;\n            }\n            #header * {\n                box-sizing: border-box;\n            }\n            .header__btn {\n                width: 75px;\n                height: 50px;\n                float: left;\n                font-size: 32px;\n                padding-top: 9px;\n                padding-bottom: 9px;\n                cursor: pointer;\n                text-align: center;\n                color: white;\n                text-decoration: none;\n            }\n            .header__btn:hover {\n                background: red;\n            }\n            .header__content {\n                padding-top: 10px;\n                padding-bottom: 10px;\n                float: left;\n                width: calc(100% - " + numberOfButtonsToShow * 75 + "px);\n                text-align: center;\n                font-size: 20px;\n            }\n\n            body {\n                font-size: 20px;\n                font-family: Arial;\n                line-height: 1.5em;\n                margin: 0;\n            }\n            .btn-demo {\n                font-size: 20px;\n                padding: 10px;\n            }\n\n        </style>\n        <div>\n            " + prevButton + "\n            <a class=\"header__btn\" href=\"../index.html\">\n                &#8679;\n            </a>\n            <div class=\"header__content\">\n                " + currentDemo.title + "\n            </div>\n            " + nextButton + "\n        </div>\n    ";
}


setTimeout("\n          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n\n  ga('create', 'UA-39253677-1', 'auto');\n  ga('send', 'pageview');\n\n  var aTags = document.getElementsByTagName(\"a\");\n  for (var i=0;i<aTags.length;i++) {\n    aTags[i].addEventListener(\"click\", function(){\n        var url = this.href;\n        if (url.indexOf(\"mattzeunert.com\") === -1 && url.indexOf(\"localhost\") === -1) {\n            ga(\"send\", \"event\", \"External link click\", url, location.pathname);\n        }\n    })\n  }\n", 500);
