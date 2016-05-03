---
layout: post
title: Node file system access with promises
date: 2014-01-02
---

The functions in [Node's fs package](http://nodejs.org/api/fs.html) allow asynchronous file system reads and data manipulation.
Once the file system operation is complete fs calls a callback to handle the results (e.g. the contents of a file or an error message).
Using promises instead of callbacks allows for cleaner code and handling a dynamic number of file system operations.

## Getting promise-supporting IO functions using promise-io

As the functions in fs don't return promise objects we need to generate functions that do.

[Promised-IO](https://github.com/kriszyp/promised-io) contains a conversion function and also
a copy of the fs package with all functions already generated with promise support.

To install it run `npm install promised-io --save` and then load it in your code like so:

{% highlight javascript %}
var promisedFs = require('promised-io/fs')
{% endhighlight %}

## Using the promise version of fs

Now we can call promisedFs.writeFile and it will return a promise with a `then` function that we
can pass our callback to:

{% highlight javascript %}
promisedFs.writeFile('test.txt').then(function(){
	console.log('Done writing.')
});
{% endhighlight %}

## Combining multiple file system operations

The main advantage of promises over simple callbacks is that the number of operations can be 
dynamic. For example if we have an array with files that we want to create the code for 
1 file and 100 files is the same:

{% highlight javascript %}
var filesToCreate = ['one.txt', 'two.txt', 'three.txt'],
	Promise = require("promised-io/promise"),
	promisedFs = require('promised-io/fs');

var promises = filesToCreate.map(function(fileName, i){
	return promisedFs.writeFile(fileName, i);
});

Promise.all(promises).then(function(){
	console.log('We can use the files now.');
});
{% endhighlight %}

The `Promise` variable contains the `all` function that can be passed an array of promises and will
call `then` when all promises have been resolved.

Also note that we're using `map` instead of `forEach`, allowing us to avoid first creating an 
array to hold the promises and then pushing them on the array individually.