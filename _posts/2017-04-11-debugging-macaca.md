---
layout: post
title: Debugging Macaca end to end tests
date: 2017-04-11
---

When writing end to end tests, being able to set breakpoints and debug is very useful. But while the Macaca documentation mentions [debugging](https://macacajs.github.io/debugging) there's no clear info on how to set breakpoints.

This post describes how to go about that.

## Running the Macaca server and Mocha separately

If you try debugging `macaca run` directly you'll notice it won't pause on your breakpoints. The reason for that is that your test cases in`test.js` aren't executed as part of the main Macaca process, but separately through Mocha.

To run the two separately first run `macaca server`

Then locate the Mocha executable. In my case that was `node_modules/.bin/_mocha`.

Then run Mocha and pass in the test file you'd like to run:

```
node node_modules/.bin/_mocha ./macaca-test/something.test.js
```

## Debugging the Mocha process

You can now debug Mocha and your tests like any other Node module. Here's an example:

The example below uses `devtool`, but you can also use `node --inspect` or `node-debug`:

```
devtool node_modules/.bin/_mocha ./macaca-test/something.test.js
```

Put a debugger statement in the test case, and make sure Mocha doesn't kill your test if you run it for too long:

{% highlight javascript %}
it("Loads a page", function() {
  this.timeout(5 * 60 * 1000);
  return driver
    .get("http://www.example.com")
}
{% endhighlight %}

![](/img/blog/macaca-debugging/debugger-statement.png)

## Running a test case step by step

Webdriver's asynchronous nature makes stepping through a bit more difficult. If you just click on "Step over" the debugger won't pause in the right place.

A workaround is to insert a bunch of debugger statements upfront:

{% highlight javascript %}
it("Loads a page", function() {
  this.timeout(5 * 60 * 1000);
  return driver
    .get("https://www.example.com")
    .then(function(){
      debugger
    })
    .get("http://stackoverflow.com")
    .then(function(){
      debugger
    })
})
{% endhighlight %}

After pausing, click "Resume" to run the next step.

## Manually running commands

When writing a new test case it's helpful to try out commands without re-starting the mocha process and re-running your existing code. 

To manually run commands in the console we need to make sure that the original test doesn't finish and that we can access `driver` in the console:

{% highlight javascript %}
it("Loads a page", function() {
  this.timeout(5 * 60 * 1000);
  global.driver = driver
  return driver
    .sleep(5 * 60 * 1000)
})
{% endhighlight %}

Now you can run custom commands in the console using the global `driver` variable.

{% highlight javascript %}
// Console command 1
driver.get("http://example.com")
// Console command 2
driver.eval("document.body.innerHTML = 'test'")
{% endhighlight %}

![](/img/blog/macaca-debugging/manual-commands.png)


