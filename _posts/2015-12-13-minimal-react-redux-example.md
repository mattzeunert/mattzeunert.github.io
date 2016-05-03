---
layout: post
title: Minimal React/Redux Example
date: 2015-12-13
---

I put a <a href="https://github.com/mattzeunert/Minimal-React-Redux-Example">minimal React/Redux demo up on Github</a>. This is a walk-through of how it works.

## Initializing the Redux store

{% highlight javascript %}
var defaultState = {
    greeting: "Hello World!"
}
function reducerFunction(state=defaultState, action){
    return state;
}

var store = Redux.createStore(reducerFunction);
{% endhighlight %}

Redux stores are based on reducer functions. They take in the current `state` of the app as well as an `action` that determines how the state should change. The reducer function then returns the new state object.

In the case above we never modify the store's state at all. We completely ignore the action and just return the existing state of our store.

When you do update the state, note that the reducer function should not mutate the state object. Instead of modifying it directly (`state.greeting = "hi"`) you have to create a new object (`{greeting: "hi"}`) and return that.  
Re-creating the whole object manually would be tedious in practice, so you can [use `Object.assign({}, state, {greeting: "hi"})` instead](https://github.com/rackt/redux/blob/master/docs/basics/Reducers.md).

## Creating a React component for the app

{% highlight javascript %}
var App = React.createClass({
    render: function(){
        return <h1>
            {this.props.greeting}
        </h1>
    }
});
{% endhighlight %}

If you've tried React before this is probably straightforward.

The component takes the data in `this.props` and the render method uses it to generate JSX code which then ultimately turns into HTML.

## Describing the connection between the Redux store and your app component

{% highlight javascript %}
App = ReactRedux.connect(function(state){
    return state;
})(App);
{% endhighlight %}

ReactRedux's `connect` method creates a new React component that wraps around your `App` component. (Wrapping around means the new component returns your `<App />` in its render method.)

The `connect` method takes a function called `mapStateToProps` as an argument. This function describes the relationship between your store data (what is returned by `store.getState()`) and the props that are passed into your app.

In this case we simply return the store data directly.

`mapStateToProps` is a good place to compute derived values. For example, if our store data was `{name: "World"}` the mapping function could return `{greeting: "Hello " + state.name}`.

## Rendering the app and passing the store into the app

{% highlight javascript %}
ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <App />
    </ReactRedux.Provider>,
    document.getElementById('app')
);
{% endhighlight %}

Finally we need to pass the store into the component returned by the `connect` function.

This is largely the same as using `<App store={store} />`, but [recommended to use `Provider` instead](https://github.com/rackt/react-redux/blob/master/docs/api.md#provider-store). For example `Provider` also passes in the store's `dispatch` method as a prop.

You can [try the full code on Github](https://github.com/mattzeunert/Minimal-React-Redux-Example).