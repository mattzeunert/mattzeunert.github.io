var babel = require("babel-core")
var template = require("babel-template")
var debounce = require('lodash.debounce');

window.require = function(module){
    if (module === "babel-template") {
        return template;
    }
}


var pluginCodeErrors = document.querySelector("#plugin-code-errors")
var uncompiledCodeErrors = document.querySelector("#uncompiled-code-errors")

var pluginCodeTextarea = document.querySelector("#plugin-code");
var uncompiledCodeTextarea = document.querySelector("#uncompiled-code");
var compiledCodeTextarea = document.querySelector("#compiled-code")

var pluginCodeEditor = CodeMirror.fromTextArea(pluginCodeTextarea, {
    mode: "javascript",
    lineNumbers: true
});
pluginCodeEditor.setSize({
    width: "100%",
    height: "100%"
})
pluginCodeEditor.on("change", function(){
    run();
})

var uncompiledCodeEditor = CodeMirror.fromTextArea(uncompiledCodeTextarea, {
    mode: "javascript",
    lineNumbers: true,
    change: function(){
        run()
    }
});
uncompiledCodeEditor.on("change", function(){
    run();
})

var compiledCodeEditor = CodeMirror.fromTextArea(compiledCodeTextarea, {
    mode: "javascript",
    lineNumbers: true,
    readOnly: true
});


window.run = function(){
    var pluginCode = pluginCodeEditor.getValue();
    var uncompiledCode = uncompiledCodeEditor.getValue();

    try {
        checkCodeIsValid(pluginCode)
        var plugin = getPlugin(pluginCode)    
    } catch (err) {
        setError("plugin-code-errors", err.toString())
        return;
    }

    try {
        checkCodeIsValid(uncompiledCode) 
    } catch (err) {
        setError("uncompiled-code-errors", err.toString())
        return;
    }
    
    try {
        var compiledCode = babel.transform(uncompiledCode, {plugins: plugin}).code    

    } catch (err) {
        setError("plugin-code-errors", err.toString())
        return;
    }
    setError(null)
    

    compiledCodeEditor.setValue(compiledCode);
}

function checkCodeIsValid(code){
    babel.transform(code, {plugins: []})
}

function getPlugin(pluginCode){
    var module = {};
    eval(pluginCode);
    return module.exports
}
function setError(type, message){
    console.log("setError", type, message)
    pluginCodeErrors.textContent = "";
    pluginCodeErrors.setAttribute("style", "")
    uncompiledCodeErrors.textContent = "";
    uncompiledCodeErrors.setAttribute("style", "")

    if (type !== null){
        document.querySelector("#" + type).innerHTML = message.replace(/\n/g, "<br>").replace(/  /g, "&nbsp;&nbsp;")
        document.querySelector("#" + type).setAttribute("style", "display: block");
    }
}

run = debounce(run, 300)

run()