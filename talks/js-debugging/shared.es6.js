// compile with `6to5 shared.es6.js > shared.js`
var demoList = [
        {
            id: "async-call-stack",
            title: "Async Call Stack",
            path: "clock/index.html"
        },
        {
            id: "blackboxing",
            title: "Library Blackboxing",
            path: "blackboxing/blackboxing.html"
        },
        {
            id: "restart-frame",
            title: "Restart Frame",
            path: "restart-frame/index.html"
        },
        {
            id: "behavior-bp",
            title: "Behaviour-based Breakpoints",
            path: "backbone-todomvc/index.html"
        },
        {
            id: "never-pause-here",
            title: "Never Pause Here",
            path: "never-pause-here/index.html"
        },
        {
            id: "object-formatters",
            title: "Custom Object Formatters",
            path: "object-formatters/index.html"
        },
        {
            id: "console",
            title: "Console Logging",
            path: "console/index.html"
        }
    ];
    
function initHeader(demoId){
    

    demoList.forEach(function(demo, i){
        demo.index = i;
    });

    var currentDemo = demoList.filter((demo) => demo.id === demoId)[0];
    var previousDemo = demoList[currentDemo.index - 1];
    var nextDemo = demoList[currentDemo.index + 1];

    var nextButton = "";
    var prevButton = "";
    var numberOfButtonsToShow = 1; // home button
    if (previousDemo) {
        numberOfButtonsToShow++;
        prevButton = `<a class="header__btn" href="${"../" + previousDemo.path}">
            &#10094;
        </a>`
    }
    if (nextDemo) {
        numberOfButtonsToShow++;
        nextButton = `<a class="header__btn" href="${"../" + nextDemo.path}">
            &#10095;
        </a>`
    }


    document.getElementById("header").innerHTML = `
    <meta name="viewport" content="width=device-width, initial-scale=1">

        
        <style>
            .page-content {
                padding: 10px;
            }
            #header {
                overflow: hidden;
                background: #1D1D98;
                color: white;
                margin-bottom: 10px;
            }
            #header * {
                box-sizing: border-box;
            }
            .header__btn {
                width: 75px;
                height: 50px;
                float: left;
                font-size: 32px;
                padding-top: 9px;
                padding-bottom: 9px;
                cursor: pointer;
                text-align: center;
                color: white;
                text-decoration: none;
            }
            .header__btn:hover {
                background: red;
            }
            .header__content {
                padding-top: 10px;
                padding-bottom: 10px;
                float: left;
                width: calc(100% - ${numberOfButtonsToShow * 75}px);
                text-align: center;
                font-size: 20px;
            }

            body {
                font-size: 20px;
                font-family: Arial;
                line-height: 1.5em;
                margin: 0;
            }
            .btn-demo {
                font-size: 20px;
                padding: 10px;
            }

        </style>
        <div>
            ${prevButton}
            <a class="header__btn" href="../index.html">
                &#8679;
            </a>
            <div class="header__content">
                ${currentDemo.title}
            </div>
            ${nextButton}
        </div>
    `
}


    setTimeout(`
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-39253677-1', 'auto');
  ga('send', 'pageview');

  var aTags = document.getElementsByTagName("a");
  for (var i=0;i<aTags.length;i++) {
    aTags[i].addEventListener("click", function(){
        var url = this.href;
        if (url.indexOf("mattzeunert.com") === -1 && url.indexOf("localhost") === -1) {
            ga("send", "event", "External link click", url, location.pathname);
        }
    })
  }
`, 500);