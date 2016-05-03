---
layout: post
title: "Chrome DevTools: Restart Frame"
date: 2016-02-08
---

The Restart Frame feature in Chrome's developer tools allows you to re-run the preceding code after hitting a breakpoint. That means you can time travel within the current call stack (to a limited extent).

If you prefer a video, I made a [screencast about the Restart Frame feature](https://www.youtube.com/watch?v=cwk_ETFC-PQ).

## Example usage of Restart Frame

I've put up this [small example project on Github](https://github.com/mattzeunert/restart-frame-demo).

This is the main bit of code. Unfortunately it's not working.

{% highlight javascript %}
function calculateValue(){
    var value = 6;
    value = subtractTwo(value); // 6 - 2 = 4
    value = multiplyByThree(value); // 4 * 3 = 12
    value = addFour(value); // 12 + 4 = 16

    console.assert(value === 16, "Value wasn't 16.")

    return value;
}
{% endhighlight %}

If you enable ["Pause on uncaught exceptions"](https://developer.chrome.com/devtools/docs/javascript-debugging#pause-on-uncaught-exceptions) Chrome will pause when the `assert` call fails.

![Assert fails because the value is 20 insted of 16](/img/blog/restart-frame/assert-failed.png)

Now we could set a breakpoint at the top of the function and reload the page. But "Restart Frame" actually allows us to simply re-run the function.

To use it, go to the call stack and find the function you want to restart. Then right-click and select "Restart Frame" from the context menu.

![Restart Frame feature in call stack pane](/img/blog/restart-frame/restart-frame.png)

Chrome moves execution to the top of the function.

![Execution is now at the top of the frame](/img/blog/restart-frame/frame-restarted.png)

You can now step through the function as normal. That means you can pinpoint where the value stopped being correct.

By stepping through the function line by line (using "Step Over") we find that the error was introduced by the `multiplyByThree` function:

![After calling multiplyByThree the values is 16 instead of the expected 12.](/img/blog/restart-frame/error-introduced.png)

`value` is now 16, but it should be `(6 - 2) * 3 = 12`.

Now that we know what function isn't working correctly we can use "Restart Frame" again, but this time we'll step into `multiplyByThree` and find the bug.

![After calling multiplyByThree the values is 16 instead of the expected 12.](/img/blog/restart-frame/multiply-by-three.png)

`multiplyByFour` is actually multiplying by three. If you want, you can actually edit the file inside Chrome, save it and continue execution. The app will show the correct result.

## Limitations of Restart Frame

When using Restart Frame Chrome merely moves the execution pointer to the top of the function. It doesn't actually restore the state from when that part of code was running.

For example, if you pass the original `value` into our function and call `calculateValue(6)` Chrome will not reset the value to `6` after restarting the frame:

![Value not being reset](/img/blog/restart-frame/value-not-reset-after-restart-frame.png)

However, you can often get around this by using Restart Frame on the parent function, in this case `onClick`.

