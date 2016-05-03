---
layout: post
title: How to manually take an Angular directive out of the DOM
date: 2014-11-03
---

When using Angular UI components are normally added and removed from the UI automatically.

The [ng-if directive](https://docs.angularjs.org/api/ng/directive/ngIf) allows you to take a directive out of the DOM when it's not needed.

Sometimes however, you want to dynamically insert an Angular component into the DOM, for example to dynamically decide what directive you want to use.

(Note: 'Sometimes' does not include cases where you merely want to avoid rerunning heavy calculations on each digest, if that's the case use a scope variable rather than a function and only update the variable when necessary.)

You can dynamically insert a directive using the [`$compile` service](https://docs.angularjs.org/api/ng/service/$compile), and then remove it again by calling the element scope's [`$destroy`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$destroy) function.

In this post I'll show how to best go about this.

## Setup and adding the directive to the DOM.

First set up the HTML. All we need is a button to add and remove the directive and a placeholder where the directive's element can go.

{% highlight html %}
<body ng-app="app">
    <div ng-controller="MainController">
        <button ng-click="toggleStage()">{{stage}}</button>
        <div class="my-directive-placeholder"></div>
    </div>
</body>
{% endhighlight %}

Also make sure that the jQuery and Angular libraries are loaded.

Now add the `MainController`: 

{% highlight javascript %}
var app = angular.module('app', []);
app.controller('MainController', function($scope, $compile, $element){
    $scope.stage = 'Add';

    $scope.toggleStage = function(){
        if ($scope.stage === 'Add'){
            $scope.stage = 'Remove';
        } else {
            $scope.stage = 'Add';
        }
    }
})
{% endhighlight %}

This adds a stage variable to the scope that alternates between "Add" and "Remove" when clicked. [Try clicking on the button in this jsFiddle](http://jsfiddle.net/fmhghhcg/).

Next we'll add a directive we can put in the placeholder later. For now it can just be empty and just show a message.

{% highlight javascript %}
app.directive('myDirective', function($interval){
    return {
        template: '</b>Directive content</b>',
        link: function(scope, el, attrs){

        }
    }
});
{% endhighlight %}

### Adding the directive

You can see in the controller that we've included the `$compile` service in the MainController dependencies. $compile allows us to generate an element containing an instance of the directive.

When we call this compiler with "<div my-directive></div>" it will effectively return a template function that in turn returns a DOM element.

The function returned by $compile takes a scope as it's parameter. The scope that's passed in can then be accessed from inside the directive.

Here's the MainController code for adding the directive:

{% highlight javascript %}
$scope.stage = 'Add';
var childScope;

$scope.toggleStage = function(){
    if ($scope.stage === 'Add'){
        $scope.stage = 'Remove';

        childScope = $scope.$new();
        var compiledDirective = $compile('<div my-directive></div>');
        var directiveElement = compiledDirective(childScope);
        $('.my-directive-placeholder').append(directiveElement);
    } else {
        $scope.stage = 'Add';
    }
}
{% endhighlight %}

The code includes a childScope variable that we use to keep track of the scope that's passed into $compile. To create this scope, and make it a child of the controller scope, we call the `$new` function on MainController's scope.

The element is the added to the DOM. You can [see it working here](http://jsfiddle.net/fmhghhcg/1/).

## Removing the compiled directive

Now that the directive is created only two lines are needed to remove it again:

{% highlight javascript %}
childScope.$destroy();
$('.my-directive-placeholder').empty();
{% endhighlight %}

The second line simply removes the directive element from the placeholder, but the first line is the interesting one.

Calling $destroy on scope of the dynamically added element will prevent any Angular event handlers from firing, as well as broadcasting a "$destroy" event on the scope and all its child scopes.

Let's make three changes to the code:

1. Add the $interval service and use it to broadcast a 'tick' message every half second
2. In the directive, react to this 'tick' message by modifying the DOM
3. Add a handler to the directive scope's "$destroy" event

The $destroy handler currently only shows an alert box, but we could use it to prevent a $timeout function from being called after the directive has been taken out.

{% highlight javascript %}
var app = angular.module('app', []);
app.controller('MainController', function($scope, $compile, $element, $interval){
    $scope.stage = 'Add';
    var childScope;

    $interval(function(){
        $scope.$broadcast('tick');
    }, 500);

    $scope.toggleStage = function(){
        if ($scope.stage === 'Add'){
            $scope.stage = 'Remove';

            childScope = $scope.$new();
            var compiledDirective = $compile('<div my-directive></div>');
            var directiveElement = compiledDirective(childScope);
            $('.my-directive-placeholder').append(directiveElement);
        } else {
            childScope.$destroy();
            $('.my-directive-placeholder').empty();
            $scope.stage = 'Add';
        }
    }
})

app.directive('myDirective', function(){
    return {
        template: '</b>Directive content</b>',
        link: function(scope, el, attrs){
            scope.$on('tick', function(){
                el.append('-');
            });

            scope.$on('$destroy', function(){
                alert('Put unbind handlers for timers etc. here')
            })
        }
    }
});
{% endhighlight %}

[Try the complete demo.](http://jsfiddle.net/fmhghhcg/2/)

Without `$destroy`ing the scope the tick handler would continue firing even after the directive element has been removed.

This approach allows us to take out the element without memory leaks or phantom events.
