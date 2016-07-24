---
layout: post
title: How much memory do JavaScript arrays take up in Chrome?
date: 2016-07-24
---

My code was using too much memory, so I had a look at how much memory a bunch of strings, objects, numbers and arrays take up.

Here are the results:

![Memory taken up by different arrays](/img/blog/javascript-memory/array-memory-chart.png)

I think my main takeaway from this data is that even empty arrays and lists are relatively chunky.

The particular problem I was running into was that I created lots of empty lists, rather than re-using the same empty list every time.

<style>
    .js-memory-post-table td, .js-memory-post-table th{
        min-width: 90px;
        text-align: right;
        padding: 4px;
        border: 1px solid black;
    }
    .js-memory-post-table td:first-child{
        text-align: left;
    }
    .js-memory-post-table {
        border-collapse: collapse;
    }
</style>
<table class="js-memory-post-table">
    <thead>
        <tr>
            <th></th>
            <th>Total MB</th>
            <th>Bytes Each</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Empty Fields</td>
            <td>7.63</td>
            <td>8.00</td>
        </tr>
        <tr>
            <td>Booleans</td>
            <td>9.27</td>
            <td>9.72</td>
        </tr>
        <tr>
            <td>Numbers</td>
            <td>9.27</td>
            <td>9.72</td>
        </tr>
        <tr>
            <td>Identical Strings</td>
            <td>9.27</td>
            <td>9.72</td>
        </tr>
        <tr>
            <td>Arrays</td>
            <td>39.79</td>
            <td>41.72</td>
        </tr>
        <tr>
            <td>Empty Objects</td>
            <td>62.68</td>
            <td>65.72</td>
        </tr>
    </tbody>
</table>

I don't fully understand these results. They depend on the internals of the JavaScript engine.

The size for empty fields makes sense. Each item takes up exactly 8 bytes. (The whole array actually takes up 8,000,048 bytes, so we've got 48 bytes of overhead for the array itself.)

However, my expectations don't match up for the numbers array. JavaScript uses double-precision (64-bit) floating point numbers. 64 bits are 8 bytes, but each number actually takes up an average of 9.7 bytes.

Likewise, Chrome shows the size of each individual empty array as 32 bytes and the size of each empty object as 56 bytes. The whole array however gives an average size of 39.8 and 62.7 respectively.

My guess is that part of this discrepancy comes from V8 storing metadata (e.g. type) for the array items. Also, not all arrays are the same internally in V8. I tried to get a better understanding, but didn't manage to make much sense of [the code](https://cs.chromium.org/chromium/src/v8/src/objects.h?type=cs&q=jsarra&sq=package:chromium&l=10334). [This blog post](https://wingolog.org/archives/2011/05/18/value-representation-in-javascript-implementations) from 2011 could also be interesting.

If you want to play with the memory profiler in Chrome you can use [this CodePen](http://codepen.io/anon/pen/AXaoGr) or get the code from [Github](https://github.com/mattzeunert/javascript-array-memory-consumption).

![Memory profiler in Chrome](/img/blog/javascript-memory/memory-profiler.png)

It's also interesting to see what the table looks like with only item in each array:

<table class="js-memory-post-table">
    <thead>
        <tr>
            <th></th>
            <th>Total Array Size</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Empty Field</td>
            <td>56</td>
        </tr>
        <tr>
            <td>Boolean</td>
            <td>184</td>
        </tr>
        <tr>
            <td>Number</td>
            <td>184</td>
        </tr>
        <tr>
            <td>String</td>
            <td>216</td>
        </tr>
        <tr>
            <td>Array</td>
            <td>216</td>
        </tr>
        <tr>
            <td>Empty Object</td>
            <td>240</td>
        </tr>
    </tbody>
</table>
