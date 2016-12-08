---
layout: post
title: A super simple introduction to neural networks
date: 2016-12-05
---

People mention neural networks a lot, both on tech sites and in the mainstream media. So I decided to get a basic understanding of how they work.

After starting to read [chapter 1](http://neuralnetworksanddeeplearning.com/chap1.html) of the book "Neural Networks and Deep Learning" it turned math-heavy very quickly:

![](/img/blog/super-simple-neural-network/math.png)

Not the most straightforward explanation! Maybe I should have read the [about section](http://neuralnetworksanddeeplearning.com/about.html) of the book first :)

This post aims to give an introduction that's a bit more friendly to web developers without a college education.

## Let's solve a simple problem

The article I mentioned above builds a neural network that's able to recognize handwritten digits.

The inputs to the neural network are the pixels of the image containing the number. The output is the number that is represented by the image. ##don't like this sentence

To make building our neural networks easier, let's start by picking a simpler problem. We're going to check if a number written in binary is even.

A few examples (the b suffix means the number is in binary):
In: 001b (1) => Out: Not Even
In: 010b (2)=> Out: Even
In: 101b (5) => Out: Not Even

Yes, there are existing solutions to this problem that don't rely on neural networks. But they won't teach us anything about neural networks!

## What is a neural network?

You can think of a neural network as a function that takes an array as a parameter and returns another array.

For our "isEven" neural network that means we take the binary digits as the input array (e.g. [0, 1, 0]) and return a simple true/false value (e.g. [1]).

If we did handwriting recognition the input array would contain the pixels of the photo, and the return value would be an array with 10 values. The 10 values represent buckets for each digit from 0 to 9. The highest number in the output array is the digit that the network thinks is written in the image.

If you look up [Artificial Neural Network](https://en.wikipedia.org/wiki/Artificial_neural_network) on Wikipedia you'll see this image:

![](/img/blog/super-simple-neural-network/nn.png)

Each column of circles represents something called a layer.

The input layer is the array we're passing into our isEven function. The output layer is the return value... sort of.

While the input value consists of just numbers, the output layer consists of neurons. Neurons take an array of numbers and return a single number. We'll look at them more further down in the article.

So, the return value of our isEven function contains the outputs of the neurons in the output layer. (Which for isEven is just one neuron.)

Between the input layer and the output layer you can have one or more hidden layers, which also consist of neurons.

When we call the isEven function the numbers from the input array propagate through the network left to right. The hidden layer neurons take the input layer as an input. The outputs of the neurons in the hidden layer become the inputs for the neurons in the output layer.

GIF MAYBE?

## How can our network learn to get better?

When programming we normally tell the computer exactly what to do in order to solve a problem. But the point of neural networks is that we don't need to specify the exact rules it should follow.

Specifying the exact rules is easy if you want to check if a number is even. But in order to recognize a hand-written digit manually coding the logic becomes quite difficult.

Instead, for neural networks we only specify a set of ground rules for the network. For example, we need to decide how many neurons are in each layer, and how each neuron should behave.

What we don't specify is the strength of the connections between the different neurons. The weight of each connection is determined through *learning*.

(Following the biological metaphor, the connections are sometimes called synapses.)

In order to learn we need a set of examples to train our neural network. Each example consists of the input to our neural network and the expected output.

How well our network predicts the correct outputs for a given example depends on the weights it uses. During training we gradually adjust the weights in order to improve the network's accuracy.

There's an online [demo on the TensorFlow website](http://playground.tensorflow.org/#activation=tanh&batchSize=10&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2&seed=0.31448&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=false&xSquared=false&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false&hideText=false) that illustrates this really well.

On the demo page you can see two things:

- The connections between the different neurons become stronger or weaker
- As the connections change the prediction of the network becomes more accurate

<div class="youtube-container">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/XsNNg0st9KM" frameborder="0" allowfullscreen></iframe>
</div>

## What do the neurons do?

There are different types of neurons that behave slightly differently.

In the simplest case the neurons just multiply each input value by the weight of the connection and return the sum.

For example:

![](/img/blog/super-simple-neural-network/neuron.png)

You can think of the numbers on the left (5 and 2) as the input layer. We then have a hidden layer with a single neuron.

The outputs of the hidden layer neurons are then passed on to the neurons in the output layer.

We can implement our neuron like this:

{% highlight javascript %}
function Neuron(weights){
    this.weights = weights
}
Neuron.prototype.process = function(inputs){
    var sum = 0
    for (var i=0; i<inputs.length; i++) {
        sum += inputs[i] * this.weights[i]
    }

    return sum
}
{% endhighlight %}

<!-- > fix highlighting -->

We pass the neuron a set of weights when we instantiate it. It can then use input from our training examples to calculate an output.

{% highlight javascript %}
var neuron = new Neuron([4, -2, 6])
var output = neuron.process([1, 0, 1])
// output = 10
{% endhighlight %}

In this example we're using three input values and three weights. A binary number with three digits can only represent values up to 7. When we actually run the network we are going to use 16 digits, letting us represent numbers up to 65535.

## Propagating the input values through the network

YT/gif of bad example, but don't show the actual problem we're trying to solve

First we need a set of weights to start with. We'll just pick random weights. Our weights object will have weights for the neurons in the hidden layer and in the output layer.

If we have two neurons in the hidden layer `weights.hiddenLayer` might look like this:

    [
        [1.5, -2.4, 3.8],
        [0.3, -1.1, -2.3]
    ]

Each hidden layer neuron needs exactly as many weights as there are values in the input layer.

The hidden layer also needs as many weights as there are values in the layer before it. Since the hidden layer has two neurons that means we get two output values, and we need 2 weights for each neuron in the output layer.

{% highlight javascript %}
function predict(inputLayer, weights){
    var neuronLayers = [
        weights.hiddenLayer.map(neuronWeights => new Neuron(neuronWeights)),
        weights.outputLayer.map(neuronWeights => new Neuron(neuronWeights))
    ]

    var previousLayerResult = inputLayer;

    neuronLayers.forEach(function(layer){
        previousLayerResult = layer.map(neuron => neuron.process(previousLayerResult))
    })

    return previousLayerResult
}
{% endhighlight %}

EXPLAIN THE CODE ABOVE MORE

The code for generating the random weights isn't very interesting, but you can find the [full example code here](https://github.com/mattzeunert/super-simple-neural-network/blob/master/nn.js).

So let's get our network to make a prediction. Is 3 an even number? We convert the number to binary 011b before we pass it into the network.

{% highlight javascript %}
var prediction = predict([0, 1, 1], getRandomWeights())
console.log(prediction)
// [ 47.915576800891444 ]
{% endhighlight %}

What does that mean? We need to interpret the result of our network somehow. 

I'm going to decide that a number greater than 0 means the number is even.

But since 47.9 is greater than 0 that means or network is saying 3 is an even number! It isn't!

So in order to make a correct prediction we need training data and tweak our weights accordingly.

## Training data

Normally training data needs to be obtained manually. To do handwriting recognition, you ask someone to write a number (lets say "5") and use the result as the input to the neural network. After the network has predicted the number that's represented in the image you compare it to the correct response, which should be 5.

Conveniently, checking if a number is even is already a solved problem, so we'll just write a `generateTestData` function to generate the example data for us.

If we go through all our training examples and check what percentage of them is correct we can find a way to compare different sets of weights, which allows us to find the configuration that makes our network most performant.

## Training our network

So let's try some weights and see what works best!

This is the brute force solution. We'll just pick random weights, see how well they work, and keep track of the weights that worked best.

We're going to do this 20,000 times. If the random set of weights is better than any other weights we had before we store them in `bestWeights` and show the new best correctness in the console.

{% highlight javascript %}
var trainingExamples = generateTestData(0, 100)

var weights, bestWeights
var bestCorrectness = -1

for (var i=0; i<ITERATIONS; i++){
    weights = getRandomWeights()
    var correctness = getCorrectness(weights, trainingExamples)

    if (correctness > bestCorrectness) {
        console.log("New best correctness:", correctness * 100, "%")
        bestCorrectness = correctness
        bestWeights = cloneObject(weights)
    }
}
{% endhighlight %}

And the output:

    New best correctness: 47 %
    New best correctness: 50 %
    New best correctness: 56 %
    New best correctness: 65 %
    New best correctness: 71 %
    New best correctness: 81 %
    New best correctness: 84 %
    New best correctness: 86 %
    New best correctness: 90 %
    New best correctness: 95 %
    New best correctness: 96 %

Nice! Our network correctly determines if a number is even in 96% of cases!

# There's a problem with how we measure the performance of our network

When we calculate correctness we're checking what percentage of training examples is predicted correctly. But is that a good way to measure how well our network is doing?

Out network should be able to predict whether any given number is even. But right now we are only checking how well it does for the numbers it has been trained with. 

If we just look at that value we risk that our network effectively just memorizes the existing data or we have rather than developing a deeper understanding.

// hmm, sorta...it's not exacty memorization, more like a wrong model 

To figure out how good the network really is we need a set of example data that's separate from the training set that we use to determine the weights.

That's called a test set. Every time we think we found a better set of weights, lets check how accurate our network is actually predicting evenness.

{% highlight javascript %}
var testSet = generateTestData(10000, 11000)

// ...

    if (correctness > bestCorrectness) {
        // ...

        var testCorrectness = getCorrectness(weights, testSet)
        console.log("Correctness in test set: ", testCorrectness * 100, "%\n")
    }

{% endhighlight %}

Console output:

    New best correctness in training (test) set: 47% (44.8%)
    New best correctness in training (test) set: 50% (50.0%)
    New best correctness in training (test) set: 56% (54.8%)
    New best correctness in training (test) set: 65% (56.2%)
    New best correctness in training (test) set: 71% (51.9%)
    New best correctness in training (test) set: 81% (73.6%)
    New best correctness in training (test) set: 84% (76.9%)
    New best correctness in training (test) set: 86% (81.6%)
    New best correctness in training (test) set: 90% (74.8%)
    New best correctness in training (test) set: 95% (54.4%)
    New best correctness in training (test) set: 96% (80.5%)    

It turns out that for numbers we didn't train for our network is performing less well. Still, 80.5% is still way better than random chance!

One problem with this particular dataset is that the numbers we use for traingin weren't randomly selected from our sample data. We arbitrarily picked the numbers from 0 to 99. The test set contains numbers from 10,000 to 10,999. All these numbers are different from the training set, in that they are much larger.

So one way to improve the accuracy of our network would be to randomly select some numbers for training and some for testing.

## Backpropagation, or why people use math

It may surprise you to hear that our approach isn't very efficient. :)

That's why in practive people use maths to gradually determine tweak the weights. 

![](/img/blog/super-simple-neural-network/math-formula-highlighted.png)

If you take another look at the screenshot from above you can see that the formula at the bottom shows how to change a weight w<sub>k</sub> to a better weight w<sub>k</sub>'.

The algorithm that's used to determine the improved set of weights is called backpropagation.

## Other simplifications

There are a few things I've simplified for this article:

- Instead of measuring correctness (correct/incorrect) normal neural network calculate a more nuanced error that indicates just how far off the networks predictions was.
- I'm using an object model, but normally these calculations are done with matrices.
- Neurons use an something called an activation function and something called a bias.

Keep in mind that I don't have the best understanding of neural networks myself. But I hope I could give you a more accessible version.

If you have a bunch of extra time, go read [the article I mentioned earlier](http://neuralnetworksanddeeplearning.com/chap1.html). It's good, just a bit to hard for me.




todo: update github code to use > 0 rather than > 0.5 to say if even or not... really? might make stuff later more confusing

todo: rename "examples" to "set" 