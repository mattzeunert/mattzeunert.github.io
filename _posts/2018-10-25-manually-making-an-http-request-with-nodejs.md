---
layout: post
title: "Manually making an HTTP requests in Node.js"
date: 2018-10-25
---

This post will show how to make an HTTP request using the [`net`](https://nodejs.org/api/net.html) module, rather than something more high-level like [`http`](https://nodejs.org/api/http.html) or [`request`](https://github.com/request/request#readme). So we build on top of the existing TCP connection support. It turns out basic HTTP requests are pretty straightforward!

## Creating a socket

To connect to a server we need to create a TCP socket and point it to a certain endpoint. Once we have a TCP connection we can put data into the socket and hopefully get something back 🙂. 

{% highlight javascript %}
var net = require("net");
var client = new net.Socket();
client.connect(
  80,
  "example.com",
  function() {
    console.log("Connected");
    client.write(`Hello!`);
  }
);

client.on("data", function(data) {
  console.log("Received " + data.length + " bytes\n" + data);
});

client.on("close", function() {
  console.log("Connection closed");
});
{% endhighlight %}

We're already getting an HTML response!

```
Connected
Received 516 bytes
 HTTP/1.0 501 Not Implemented
Content-Type: text/html
Content-Length: 357
Connection: close
Date: Thu, 25 Oct 2018 15:56:54 GMT
Server: ECSF (lga/1373)

<?xml version="1.0" encoding="iso-8859-1"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
         "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<title>501 - Not Implemented</title>
	</head>
	<body>
		<h1>501 - Not Implemented</h1>
	</body>
</html>

Connection closed
```

A 501 HTTP error means that ["the request method is not supported by the server"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501). Which makes sense since "Hello!" isn't a valid HTTP method.

Let's try sending one:

{% highlight javascript %}
client.write(`GET / HTTP/1.0`);
{% endhighlight %}

Now our Node process just hangs for a long time and then our request times out:

```
Connected
Received 590 bytes
 HTTP/1.0 408 Request Timeout
Content-Type: text/html
Content-Length: 431
Connection: close
Date: Thu, 25 Oct 2018 15:59:10 GMT
Server: ECSF (lga/13A1)

<?xml version="1.0" encoding="iso-8859-1"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
         "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<title>408 - Request Timeout</title>
	</head>
	<body>
		<h1>408 - Request Timeout</h1>
		<div>Server timeout waiting for the HTTP request from the client.</div>
	</body>
</html>
```

What's going on here? The server notices we're making an HTTP request. All is looking fine, but it seems like we never finish making our request.

We need a line break after the the request line, followed by another empty line:

{% highlight javascript %}
client.write(`GET / HTTP/1.0

`);
{% endhighlight %}

The request is made successfully, but the server can't find what we're looking for yet:

(Note how the response headers also end on two line breaks.)

```
Connected
Received 497 bytes
 HTTP/1.0 404 Not Found
Content-Type: text/html
Date: Thu, 25 Oct 2018 16:04:03 GMT
Server: ECS (lga/13A4)
Content-Length: 345
Connection: close

<?xml version="1.0" encoding="iso-8859-1"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
         "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<title>404 - Not Found</title>
	</head>
	<body>
		<h1>404 - Not Found</h1>
	</body>
</html>

Connection closed
```

We're connecting to example.com, so it would make sense if return the example.com page.

However, Node is resolving the example.com domain name before making the request, so we contact the server using the IP address. So it doesn't know what website to serve. While some servers may only serve one website, it's very common for a server to be used for a bunch of sites. For example, think of cloud hosting.

What we need to do is send an [HTTP `Host` header](https://tools.ietf.org/html/rfc7230#section-5.4).

> The "Host" header field in a request provides the host and port information from the target URI, enabling the origin server to distinguish among resources while servicing requests for multiple host names on a single IP address.

{% highlight javascript %}
client.connect(
  80,
  "example.com",
  function() {
    console.log("Connected");
    client.write(`GET / HTTP/1.0
Host: example.com

`);
  }
);
{% endhighlight %}

(Side note: HTTP servers don't like whitespace before the headers.)

And here we go!

```
Connected
Received 1448 bytes
 HTTP/1.0 200 OK
Cache-Control: max-age=604800
Content-Type: text/html; charset=UTF-8
Date: Thu, 25 Oct 2018 16:14:49 GMT
Etag: "1541025663+ident"
Expires: Thu, 01 Nov 2018 16:14:49 GMT
Last-Modified: Fri, 09 Aug 2013 23:54:35 GMT
Server: ECS (lga/1372)
Vary: Accept-Encoding
X-Cache: HIT
Content-Length: 1270
Connection: close

<!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        (...a whole bunch of CSS)
    </style>
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is established to be used for illustrative examples in documents. You may use this
    domain in example
Received 163 bytes
 s without prior coordination or asking for permission.</p>
    <p><a href="http://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
</html>

Connection closed
```

We've got two chunks, one 1448 bytes and the other 163 bytes. I'm going to assume that's two TCP packets, since the largest practical TCP packet size [seems to be around 1500 bytes](https://stackoverflow.com/questions/2613734/maximum-packet-size-for-a-tcp-connection). However, each data chunk does not always map to one TCP packet, for example due to [TCP coalescing](https://github.com/nodejs/node-v0.x-archive/issues/15443).

## Keeping the connection alive

We can re-use our connection by adding another header:

{% highlight javascript %}
client.write(`GET / HTTP/1.0
Host: example.com
Connection: keep-alive

`);
{% endhighlight %}

This way we don't get a "close" event, and we need to detect the response end using the `Content-Length` response header.

## How does post data work?

Post data is the request message body. It works in a similar way to the response body.

1. You add a `Content-Length` request header
2. After the headers and the two line breaks you write your message body

The server keeps reading from the socket until the content length is reached.

## Enabling Gzip

We can enable gzip by adding an `Accept-Encoding` header. (This assumes it's supported by the server, otherwise the header will be ignored.)

{% highlight javascript %}
client.write(`GET / HTTP/1.0
Host: example.com
Accept-Encoding: gzip\n\n`);
{% endhighlight %}

And now the response body is compressed (notice how the Content-Length was cut in half):

```
HTTP/1.0 200 OK
Content-Encoding: gzip
Cache-Control: max-age=604800
Content-Type: text/html; charset=UTF-8
Date: Thu, 25 Oct 2018 18:20:42 GMT
Etag: "1541025663+gzip"
Expires: Thu, 01 Nov 2018 18:20:42 GMT
Last-Modified: Fri, 09 Aug 2013 23:54:35 GMT
Server: ECS (lga/13AD)
Vary: Accept-Encoding
X-Cache: HIT
Content-Length: 606
Connection: close

;�R�TA��0
         ��W�ri]��S�V @���1k��Z��$�6���q۽���@+���l�I�I��s�PzUe���Bf
                                                                    �'��+�>���+�OF	�I4h��^@^
<�|ԅߎP���P�-�6�O��$}�Jl)ǰ_,�4yU�rQazw�r���t
                                           .�s���3�
                                                   z�_������2�Mel
                                                                  ϋ5����%�t
                                                                           뫪R���t3
��:�|�Q��]���
             V-z�|�Y3*���rKp�5th��"��C���NH����v��OOyޣ�xs�����V��$��X�6�BR�b�C��PqE���K�<�	�G�כ7����E(17Vx2�U��S��
%	x��)�d�����e��O&�4/䤘���~��Oi�s�X�dW�7��#�u�"��y\$]j<�L�r�˻'�ɪ�Vg?Kr {=��΋]E��^x;�ƱX
�$�G�	��4�n�8���㊄+c���E�hA��X�������L��RIt�[4\o����                                      TU��]�[�{��s+�e���9�g���]����H�4���#�KA��'�Z�����*r�
```

## Protocol timeline

They all have drafts and papers published years earlier (IPv6 only became finalized in 2017), but here's a rough timeline:

1974 TCP  
1978 IPv4 (standardized in 1981)  
1991 HTTP/0.9  
1994 HTTPS (standardized in 2000)  
1996 HTTP/1.0 (adds headers, methods other than GET)   
1999 HTTP/1.1 (re-usable connections)  
2015 HTTP/2  

## Line breaks

The spec says you should use CRLF (`\r\n`) rather than just the line feed (`\n`) character, but I got away with it.
