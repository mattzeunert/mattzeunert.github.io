---
layout: post
title: A super simple introduction to neural networks
date: 2016-12-09
---

Neural networks are a bit topic, both on tech sites and in the mainstream media. I decided to get a learn a bit about how they work.

After starting to read [chapter 1](http://neuralnetworksanddeeplearning.com/chap1.html) of the book "Neural Networks and Deep Learning" quickly turned... very mathy:

![Backpropagation formula](/img/blog/super-simple-neural-network/math.png)

Not the most straightforward explanation! Maybe I should have read the [about section](http://neuralnetworksanddeeplearning.com/about.html) of the book first :)

This article tries to give an introduction to neural network that's more friendly to web developers without a college education.

## Let's solve a simple problem

The article I mentioned above builds a neural network that's able to recognize handwritten digits.

The neural network takes the pixels of the image of the written number as an input. The output is the classification of the digit as a 0, 1, 2, etc.

To save us some work, let's pick a simpler problem. We'll check if a number written in binary is even.

A few examples (numbers with a "b" suffix are in binary):

    Input       Output
    ========================
    001b (1)    0 (Not Even)
    010b (2)    1 (Even)
    101b (5)    2 (Not Even)

Why use a neural network to solve this problem? It's true, there are better solutions. But they won't teach us anything about neural networks!

## What is a neural network?

You can think of a neural network as a function that takes an array as a parameter and returns another array.

For our "isEven" neural network that means we take the binary digits as the input array (e.g. [0, 1, 0]) and return a simple true/false value (e.g. [1]).

If we did handwriting recognition the input array would contain the pixels of the photo. The return value would be an array with 10 values, representing buckets for each digit from 0 to 9. The highest number in the output array shows what digit the network thinks is written in the image.

If you look up [Artificial Neural Network](https://en.wikipedia.org/wiki/Artificial_neural_network) on Wikipedia you'll see this image:

![Neural network diagram](/img/blog/super-simple-neural-network/nn.png)

Each column of circles represents something called a layer.

The input layer is the array we're passing into our isEven function. The output layer is the return value... sort of.

While the input layer consists of just numbers, the output layer consists of neurons. A neuron takes an array of numbers and returns a single number. We'll look at them more in more detail further down in the article.

So, the return value of our isEven function contains the results of the neurons in the output layer. (Which for isEven is only one neuron.)

Between the input layer and the output layer are one or more hidden layers, which also consist of neurons.

When we call the isEven function the numbers from the input array propagate through the network from left to right.

The hidden layer neurons take the input layer as an input.

The outputs from the neurons in the hidden layer become the inputs for the neurons in the output layer.

The image below shows how we progressively calculate the outputs for each layer. The exact values here don't mean anything, we'll look at them later.

![values propagate through the neural network from the input layer to the output layer](/img/blog/super-simple-neural-network/propagation.png)

## How can our network learn to get better?

When programming, we normally tell the computer exactly what to do to solve a problem.

Specifying the exact rules to follow is easy if you want to check if a number is even. But in order to recognize a hand-written digit manually coding the logic becomes quite difficult.

Instead, for neural networks we only specify a set of ground rules. For example, we need to decide how many neurons are in each layer, and how each neuron should behave.

What we don't specify is the strength of the connections between the different neurons. Each connection has a weight that's determined through learning.

In order for it to learn we need a set of example data to train our neural network. Each example consists of the input to our network and the expected output we're hoping for.

How well our network predicts the correct outputs for a given example depends on the weights it uses. During training we gradually adjust the weights in order to improve the network's accuracy.

There's an online [demo on the TensorFlow website](http://playground.tensorflow.org/#activation=tanh&batchSize=10&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2&seed=0.31448&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=false&xSquared=false&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false&hideText=false) that illustrates these weight mutations really well.

There are two important observations to make when running the demo:

- The connections between the different neurons become stronger or weaker
- Gradually the prediction of the network becomes more accurate

<div class="youtube-container">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/XsNNg0st9KM" frameborder="0" allowfullscreen></iframe>
</div>

## What do the neurons do?

There are different types of neurons that behave slightly differently.

In the simplest case a neuron multiplies each input value by the weight of the connection and returns the sum.

For example:

![Neuron and calculation of the output value](/img/blog/super-simple-neural-network/neuron.png)

You can think of the numbers on the left (5 and 2) as the input layer. The circle then represents a hidden layer with a single neuron.

The outputs, 3, is then passed on to the next layer. We'll only have one hidden layer, so the next layer that follows is the output layer.

In JavaScript we can implement our neuron like this:

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

We pass the neuron a set of weights when we instantiate it. The neuron then takes all the values from the previous layer to calculates its output value.

{% highlight javascript %}
var neuron = new Neuron([4, -2, 6])
var output = neuron.process([1, 0, 1])
// output = 10
{% endhighlight %}

In this example we're using three input values and three weights. A binary number with three digits can only represent values up to 7.

When we actually run the network the input layer will contain 16 digits, letting us represent numbers up to 65535.

## Propagating the input values through the network

First, we need a set of weights to start with. We're just going to pick random numbers.

We'll store these numbers in a `weights` object that contains weights for the neurons in the hidden layer and in the output layer.

If we have three neurons in the hidden layer `weights.hiddenLayer` might look like this:

    [
        [ 1.5, -2.4,  3.8],
        [ 0.3, -1.1, -2.3],
        [-3.3, -1.2, -0.5]
    ]

Each hidden layer neuron needs exactly as many weights as there are values in the input layer.

The output layer also needs a weight for every value it receives from the previous layer. Since the hidden layer has three neurons that means we get three output values, and we need three weights for the neuron in the output layer.

This code makes a prediction for a given example input from our training data.

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

I could have called the function `predictIsEven`, but there's nothing problem-specific about the code. What the network ends up predicting will depend on the data we use to train it.

For each layer, the `predict` function takes the result of the previous layer and passes it to the neurons in the current layer.

![Network with correct calculations](/img/blog/super-simple-neural-network/network-with-weights.png)

Let's look at an example. Is 3 an even number? We convert the number to binary 011b before we ask the network to make a prediction.

{% highlight javascript %}
var prediction = predict([0, 1, 1], getRandomWeights())
console.log(prediction)
// [ 6.259452749432459 ]
{% endhighlight %}

What does an output of 6.25 mean? We need to interpret the result of our network somehow. 

I'm going to decide that a number greater than 0.5 means the number is even.

But since 6.25 is greater than 0.5 that means or network is wrongly saying 3 is an even number!

To make a correct prediction we need training data that let's us tweak the weights we're using.

## Training data

Normally, training data needs to be obtained manually. For handwriting recognition you ask lots of people to write down the numbers from 0 to 9. Then you take pictures of each digit and pass the images into the network. Once the network has made a prediction you can compare it to the number the person actually wrote down.

Conveniently, we can determine if a number is even without resorting to neural networks. We can write a `generateTestData` function to generate the training data for us.

If we go through all our training examples and check what percentage of predictions is correct we can find a way to compare different sets of weights. This means we can determine the configuration that makes our network most performant.

## Training our network

So let's try some weights and see what works best!

This is the brute force solution. We'll pick random weights, see how well they work, and keep track of what weights worked best.

We'll do this 20,000 times. If the random set of weights is better than any other weights we had before we store them in `bestWeights` and show the new best correctness in the console.

The exact code for `getRandomWeights` and `getCorrectness` isn't too important, but you can [find the full code on Github](https://github.com/mattzeunert/super-simple-neural-network/blob/master/random-weights.js).

{% highlight javascript %}
var ITERATIONS = 20000
var trainingSet = generateTestData(0, 100)

var weights, bestWeights
var bestCorrectness = -1

for (var i=0; i<ITERATIONS; i++){
    weights = getRandomWeights()
    var correctness = getCorrectness(weights, trainingSet)

    if (correctness > bestCorrectness) {
        console.log("New best correctness:", correctness * 100, "%")
        bestCorrectness = correctness
        bestWeights = cloneObject(weights)
    }
}
{% endhighlight %}

And the console output:

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

Nice! Our network makes a correct prediction in 96% of cases!

# Assessing network performance

But wait... this just tells us the network is predicting our training examples correctly. But we want our network to be able to make a prediction for any number, even if it has never been trained with that exact number.

If we only look at correctness for the training set we can't verify if the network actually learned what we wanted it to learn: how to identify even numbers.

A simple analogy is that the network merely memorizes the training data instead of building a deeper understanding.

We need to verify that the rules our network learned apply not only to the data it was trained with.

To do that we need a set of example data that's separate from the training set that we use to determine the weights.

That's called a test set. Every time we think we found a better set of weights, we'll calculate how well these new weights work for the test set.

{% highlight javascript %}
var testSet = generateTestData(10000, 11000)

// ...

    if (correctness > bestCorrectness) {
        // ...

        var testCorrectness = getCorrectness(weights, testSet)
        console.log("New best correctness in training (test) set:",
             correctness * 100, "%",
             "(" + testSetCorrectness * 100 + "%)"
        )
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

It turns out that for numbers it wasn't trained with our network is performing less well. Still, 80.5% is still way better than random chance!

One problem with this particular dataset is that our training inputs aren't representative of all possible input numbers. We trained the network with the numbers 0 to 99, which all low numbers. However, the test set checks how well the network works for the numbers from 10,000 to 10,999.

Therefore, one way to improve our network would be to randomly select training examples from the full 0 - 65535 range.

## Backpropagation, or why people use math

It may surprise you to hear that our approach isn't very efficient. :)

That's why, in practice, people use math to figure out good ways to tweak the weights. You still start with random weights and then iterate, but the learning process is much more efficient.

![](/img/blog/super-simple-neural-network/math-formula-highlighted.png)

If you take another look at the screenshot from above you can see that the formula at the bottom shows how to go from a weight w<sub>k</sub> to a better weight w<sub>k</sub>'.

The algorithm that's used to determine the improved set of weights is called backpropagation.

## Other simplifications

There are a few things I've simplified for this article:

- Instead of measuring correctness (correct/incorrect) neural networks nornally calculate a more nuanced error that indicates how far off the network's predictions was.
- I'm using an object model, but normally these calculations are done with matrices.
- Neurons have an [activation function](https://en.wikipedia.org/wiki/Activation_function).
- In addition to weights, neurons have a bias (that's what the b<sub>l</sub> is for in the other formula above).

Keep in mind that I don't have the best understanding of neural networks myself. But hopefully you learned something from this article.

If you want to spend more time learning about neural networks, go read [the article I mentioned earlier](http://neuralnetworksanddeeplearning.com/chap1.html). It's good, but it requires a bit more thinking.

<script src="http://localhost:11080/js/pingmeonce.js"></script>
<iframe src="http://localhost:11080/ping/5629499534213120" style="width: 100%; border: none;" pingmeonce></iframe>