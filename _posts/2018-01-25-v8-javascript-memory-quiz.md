---
layout: post
title: V8 memory quiz
date: 2018-01-25
---

V8 is the JavaScript engine that Chrome and Node use to run JavaScript code. Take this quiz to discover
some interesting implementation details about how V8 stores values in memory.

Reading this probably won't help you fix any performance issues you encounter day-to-day.


{% comment %}

<script>

var MAGIC_ARRAY_LENGTH = 1304209



const questions = [
    {
        question: "How much memory is used per array element? (Divide total program memory by array length)",
        totalBytes: 10433720,
        correctAnswer: "8 bytes",
        answerOptions: ["1 byte", "4 bytes", "8 bytes", "16 bytes", "24 bytes", "35 bytes"],
        code: `
            var a = []
            // You'll see why we're using magic array length later on.
            // MAGIC_ARRAY_LENGTH is a number over one million, so
            // total memory consumption is dominated by array elements
            for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
                a.push(<b>Math.random()</b>)
            }
            holder.a = a
        `,
        explanation: `
        <p>
            JavaScript numbers are 64-bit floating point values. There are 8 bits per byte, so each number
            takes up 64/8=8 bytes.
        </p>    
        `
    },
    {
        question: "How much memory is used per array element?",
        answerInBytes: 36518096,
        correctAnswer: "24 bytes",
        answerOptions: ["2 bytes", "4 bytes", "8 bytes", "16 bytes", "24 bytes", "35 bytes"],
        code: `
            var a = []
            for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
                a.push(Math.random())
            }
            <b>a.push("this is a string")</b>
            holder.a = a
        `,
        explanation: `
            <p>Here the JavaScript engine encounters a problem: the array countains two different types of data,
            numbers and strings.</p>
            <p>
                We want to store a reference to a string in the array.
                A reference is just a memory location (where the actual characters of the string are).
                A memory location is just a number.
                You can think of you system memory as huge array, where the reference is an array index.
            </p>
            <p>
                So a string reference is a number, and a number is also a number. How can we tell which is which?
            </p>
            <p>
                The answer is called a "boxed value".
                We wrap each number in an object and store the object reference in the array.
                Now each array element can be a reference.
            </p>
            <p>
                For each number in the array we now have to store two things:
            </p>
            <ul>
                <li>reference to the object (8 bytes)</li>
                <li>the boxed number object (16 bytes)</li>
            </ul>
            <p>
                Why is the number object 16 bytes large?
                First, it needs to store the number value itself (that 64-bit floating point value).
                Each JavaScript object also has an internal type called a "hidden class", which is another
                reference value.
            </p>
            <p>
                Why does it take 8 bytes to store a reference? Remember how system memory is like an array?
                If you have a 32 bit address you can represent array indices up to 2^32.
                If you store one byte at each array index you can then address up to 2^32/(1024*1024*1024)=4GB
                of memory. Since most computers today have more than 4GB of memory you need to go one step further
                to 64 bit addresses (8 bytes per address).
                <br>
                The above is more of a common sense explanation, I'm pretty sure there's more nuance to this.
            </p>
        `
    },
    {
        question: "How much memory is used per array element?",
        answerInBytes: 83469424,
        correctAnswer: "64 bytes",
        answerOptions: ["8 bytes", "16 bytes", "32 bytes", "64 bytes", "128 bytes", "156 bytes"],
        /* 
        1404210 => 94286456 (67.15)
1300000 => 83233720 (64.02593846153846)
1304209 => 83469424 (64)
*/
        code: `
            var a = []
            for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
                <b>a.push({})</b>
            }
            holder.a = a
        `,
        explanation: `
            <p>
                How much space should V8 allocate for an empty object? It${"'"}s a tricky question. Presumably the
            object won${"'"}t stay empty forever.
            </p>
            <p>
            In short, this is what V8 stores:
            </p>
            <ul>
                <li>hidden class reference (8 bytes)</li>
                <li>4 empty slots to store property values (32 bytes)</li>
                <li>empty slot for a reference to an overflow object, in case you assign more than 4 properties (8 bytes)</li>
                <li>empty slot for an object that stores values for numeric property indices(8 bytes)</li>
            </ul>
            <p>
            I${"'"}ve previously written a <a href="http://www.mattzeunert.com/2017/03/29/v8-object-size.html">longer explanation of V8 object sizes</a>.
            </p>
            <p>
                So the answer is: 56 bytes per object, plus the 8 byte reference to the object inside the array.
            </p>
        `
    },
    {
        question: "How much memory is used per array element?",
        answerInBytes: 41740312,
        correctAnswer: "32 bytes",
        answerOptions: ["8 bytes", "16 bytes", "32 bytes", "64 bytes", "128 bytes", "156 bytes"],
        code: `
            <b>var Obj = function(){}</b>
            var a = []
            for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
                <b>a.push(new Obj())</b>
            }
            holder.a = a
        `,
        explanation: `
            <p>
                Again we have empty objects, but this time we use a constructor to create them. V8 can observe
                what happens during execution and it learns that Obj objects don${"'"}t have any members.
            </p>
            <p>
            So we can skip the empty slots for new properties and just have three 8 byte properties:
            </p>
            <ul>
                <li>hidden class reference</li>
                <li>slot for storing extra properies</li>
                <li>slot for numeric indices</li>
            </ul>
        `
    },
    {
        question: "How much memory is used per array element?",
        answerInBytes: -1,
        correctAnswer: "8 bytes",
        answerOptions: ["8 bytes", "16 bytes", "32 bytes", "64 bytes", "128 bytes", "156 bytes"],
        code: `
            var a = []
            for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
                <b>a.push("Hello")</b>
            }
            holder.a = a
        `,
        explanation: `
            <p>
                Each array element needs to hold a 64-bit memory reference to the string value.
                V8 will only create one string instance with the value "Hello", so given we have a large array
                the string size doesn${"'"}t matter.
            </p>
        `

    },
    {
        question: "How much memory is used per array element?",
        answerInBytes: -1,
        correctAnswer: "8 bytes",
        answerOptions: ["1 byte", "2 bytes", "4 bytes", "8 bytes", "16 bytes", "32 bytes"],
        code: `
            var a = []
            for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
                <b>a.push(true)</b>
            }
            holder.a = a
        `,
        explanation: `
            <p>
            <code>true</code> is stored as an object reference just like a string. So again all we need to store is a 64 bit 
            memory location. <code>false</code>, <code>undefined</code> and <code>null</code> are treated the same way.
            </p>
        `
    },
    // {
    //     answerInBytes: -1,
    //     correctAnswer: "48 ssbytes",
    //     answerOptions: [],
    //     code: `
    //         var a = []
    //         for (var i=0; i&lt;MAGIC_ARRAY_LENGTH;i++) {
    //             // Each string is 20 characters long
    //             a.push(Math.random().toFixed(18))
    //         }
    //         holder.a = a
    //     `,
    //     explanation: `
    //         As before, we need 8 bytes to store the reference to the string. But as each string here is different
    //         we now also need to store 

    //     i do not know the answer... it is a one byte string so probs my guess with 2 bytes per char is wrong
    //         Here each string is different, so it${"'"}s a bit more tricky.

    //         8 bytes obj reference




    //         references to the strings: 8 bytes each

    //         each string shallow and retained is both 40 bytes

    //         retained size in array for each str listed as 48

    //         hypothesis: utf 16 -> 2 bytes per char -> 15 chars means 30 bytes, extra byte for 0 terminated, extra 8 bytes for hidden class reference


    //         anyway, could just give a ballpark number

    //     `

    // },
    {
        question: "What is the total memory consumption of this program?",
        answerInBytes: 10433720,
        correctAnswer: "10MB",
        answerOptions: ["2MB", "4MB", "8MB", "10MB", "16MB", "24MB"],
        code: `
            var a = []
            for (var i=0; <b>i&lt;1024 * 1024</b>; i++) {
                <b>a.push(Math.random())</b>
            }
            holder.a = a
        `,
        explanation: `
        <p>
            We're storing a bit over one million numbers, and each number takes 8 bytes. So
            we should expect an array length of 8MB.
            </p>
            <p>
            But that's not the case! You can always add more elements to a JavaScript array, but
            V8 doesn't want to resize the array every time you add an element.
            So it leaves some extra empty space at the end of the array.
            </p>
            <p>
            In the previous examples we've been using MAGIC_ARRAY_LENGTH, which is just at the threshold before
            the array is expanded. MAGIC_ARRAY_LENGTH is 1304209, while 1024 * 1024 is 1048576. But in both
            cases the amount of space used by the array is the same.
            </p>
        `
    },
    {
        question: "What is the total memory consumption of this program?",
        answerInBytes: 8388656,
        correctAnswer: "8MB",
        answerOptions: ["2MB", "4MB", "8MB", "10MB", "16MB", "24MB"],
        code: `
            <b>var a = new Array(1024 * 1024)</b>
            for (var i=0; i&lt;1024 * 1024; i++) {
                a[i] = Math.random()
            }
            holder.a = a
        `,
        explanation: `
            <p>
                Here V8 knows how big the array is going to be in the end, so it can allocate just the right amount
                of space.
            </p>
        `

    },
    {
        question: "What is the total memory consumption of this program?",
        answerInBytes: 2097416,
        correctAnswer: "2MB",
        answerOptions: ["2MB", "4MB", "8MB", "10MB", "16MB", "24MB"],
        code: `
            <b>var a = new Int16Array(1024 * 1024)</b>
            for (var i=0; i&lt;1024 * 1024; i++) {
                <b>a[i] = 1</b>
            }
            holder.a = a
        `,
        explanation: `
            <p>
                Our array contains 16-bit integers, which take 2 bytes each. A bit over one million of those
                means we need 2MB.
            </p>
        `
    },
    
];

(function() {    
    
    // function Holder() {}
    // window.holder = new Holder()

    // var question = questions[questions.length - 1 - 2]
    // var code = question.code

/*
1404210 => 94286456 (67.15)
1300000 => 83233720 (64.02593846153846)
1304209 => 83469424 (64)
*/
//     code = `
// var a = []
// for (var i=0; i<MAGIC_ARRAY_LENGTH;i++) {
//     // Each string is 20 characters long
//     a.push(null)
// }
// holder.a = a
//     `
//     console.log("running ", code)
//     eval(code)

    var html = `<style>
        @media screen and (max-width: 720px) {
            pre {
                font-size: 11px;
                line-height: 14px;
            }
        }
        pre {
            max-width: 100%;
            overflow: auto;
        }
        label {
            display: block;
            padding: 10px;
            border: 1px solid #ddd;
            margin-bottom: 1px;
            cursor: pointer;
        }
        label:hover {
            background: #ddd;
        }
        label.correct {
            background: #046704;
            color: white;
        }
        label.incorrect {
            background: #cc0000;
            color: white;
        }
        .explanation {
            position: relative;
            background: #eae9f1;
            padding: 20px;
            margin-top: 10px;
            line-height: 1.7em;
            
        }
        .explanation.show a {
            color: #44a !important;
        }
        .explanation, .explanation * {
            color: transparent !important;
        }
        .explanation:not(.show):before {
            content: 'Click on an answer to read the explanation';

            position: absolute;
            left: 20px;
            top: 20px;
            color: #777;
        }
        .explanation.show, .explanation.show * {
            color: inherit !important;
        }
        #score {
            display: none;
            background: rgb(20, 97, 111);
            color: white;
            padding: 30px;
            font-weight: bold;
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 20px;
        }
    </style>`
    questions.forEach(function(question, i) {
        html += `<h3>${i+1}. ${question.question}</h3>\n`
        html += `
            <pre>${question.code
                // .replace(/>/, "&gt;")
                // .replace(/</, "&lt;")
                .replace("holder.a = a", "")
                .replace(/            /g, "")
                .trim()}</pre>
        `

        html += `<div>
            <form action="" data-question-index="${i}" data-correct-answer="${question.correctAnswer}">
            ${question.answerOptions.map(option => {
                return `<label><input type="radio" name="q${i}" value="${option}"> ${option}</label>`
            }).join("\n")}
            </form>
            <div class="explanation">${question.explanation}</div>
        </div>
        `
    })
    html += `<p id="score">
        
    </p>`
    document.write(html)
    window.html =html
})()



</script>

{% endcomment %}









<div>


<style>
        @media screen and (max-width: 720px) {
            pre {
                font-size: 11px;
                line-height: 14px;
            }
        }
        pre {
            max-width: 100%;
            overflow: auto;
        }
        label {
            display: block;
            padding: 10px;
            border: 1px solid #ddd;
            margin-bottom: 1px;
            cursor: pointer;
        }
        label:hover {
            background: #ddd;
        }
        label.correct {
            background: #046704;
            color: white;
        }
        label.incorrect {
            background: #cc0000;
            color: white;
        }
        .explanation {
            position: relative;
            background: #eae9f1;
            padding: 20px;
            margin-top: 10px;
            line-height: 1.7em;
            
        }
        .explanation, .explanation * {
            color: transparent !important;
        }
        .explanation.show a {
            color: #44a !important;
        }
        .explanation:not(.show):before {
            content: 'Click on an answer to read the explanation';

            position: absolute;
            left: 20px;
            top: 20px;
            color: #777;
        }
        .explanation.show, .explanation.show * {
            color: inherit !important;
        }
        #score {
            display: none;
            background: rgb(20, 97, 111);
            color: white;
            padding: 30px;
            font-weight: bold;
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 20px;
        }
    </style><h3>1. How much memory is used per array element? (Divide total program memory by array length)</h3>

            <pre>var a = []
// You'll see why we're using magic array length later on.
// MAGIC_ARRAY_LENGTH is a number over one million, so
// total memory consumption is dominated by array elements
for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
    a.push(<b>Math.random()</b>)
}</pre>
        <div>
            <form action="" data-question-index="0" data-correct-answer="8 bytes">
            <label><input type="radio" name="q0" value="1 byte"> 1 byte</label>
<label><input type="radio" name="q0" value="4 bytes"> 4 bytes</label>
<label><input type="radio" name="q0" value="8 bytes"> 8 bytes</label>
<label><input type="radio" name="q0" value="16 bytes"> 16 bytes</label>
<label><input type="radio" name="q0" value="24 bytes"> 24 bytes</label>
<label><input type="radio" name="q0" value="35 bytes"> 35 bytes</label>
            </form>
            <div class="explanation">
        <p>
            JavaScript numbers are 64-bit floating point values. There are 8 bits per byte, so each number
            takes up 64/8=8 bytes.
        </p>    
        </div>
        </div>
        <h3>2. How much memory is used per array element?</h3>

            <pre>var a = []
for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
    a.push(Math.random())
}
<b>a.push("this is a string")</b></pre>
        <div>
            <form action="" data-question-index="1" data-correct-answer="24 bytes">
            <label><input type="radio" name="q1" value="2 bytes"> 2 bytes</label>
<label><input type="radio" name="q1" value="4 bytes"> 4 bytes</label>
<label><input type="radio" name="q1" value="8 bytes"> 8 bytes</label>
<label><input type="radio" name="q1" value="16 bytes"> 16 bytes</label>
<label><input type="radio" name="q1" value="24 bytes"> 24 bytes</label>
<label><input type="radio" name="q1" value="35 bytes"> 35 bytes</label>
            </form>
            <div class="explanation">
            <p>Here the JavaScript engine encounters a problem: the array countains two different types of data,
            numbers and strings.</p>
            <p>
                We want to store a reference to a string in the array.
                A reference is just a memory location (where the actual characters of the string are).
                A memory location is just a number.
                You can think of you system memory as huge array, where the reference is an array index.
            </p>
            <p>
                So a string reference is a number, and a number is also a number. How can we tell which is which?
            </p>
            <p>
                The answer is called a "boxed value".
                We wrap each number in an object and store the object reference in the array.
                Now each array element can be a reference.
            </p>
            <p>
                For each number in the array we now have to store two things:
            </p>
            <ul>
                <li>reference to the object (8 bytes)</li>
                <li>the boxed number object (16 bytes)</li>
            </ul>
            <p>
                Why is the number object 16 bytes large?
                First, it needs to store the number value itself (that 64-bit floating point value).
                Each JavaScript object also has an internal type called a "hidden class", which is another
                reference value.
            </p>
            <p>
                Why does it take 8 bytes to store a reference? Remember how system memory is like an array?
                If you have a 32 bit address you can represent array indices up to 2^32.
                If you store one byte at each array index you can then address up to 2^32/(1024*1024*1024)=4GB
                of memory. Since most computers today have more than 4GB of memory you need to go one step further
                to 64 bit addresses (8 bytes per address).
                <br>
                The above is more of a common sense explanation, I'm pretty sure there's more nuance to this.
            </p>
        </div>
        </div>
        <h3>3. How much memory is used per array element?</h3>

            <pre>var a = []
for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
    <b>a.push({})</b>
}</pre>
        <div>
            <form action="" data-question-index="2" data-correct-answer="64 bytes">
            <label><input type="radio" name="q2" value="8 bytes"> 8 bytes</label>
<label><input type="radio" name="q2" value="16 bytes"> 16 bytes</label>
<label><input type="radio" name="q2" value="32 bytes"> 32 bytes</label>
<label><input type="radio" name="q2" value="64 bytes"> 64 bytes</label>
<label><input type="radio" name="q2" value="128 bytes"> 128 bytes</label>
<label><input type="radio" name="q2" value="156 bytes"> 156 bytes</label>
            </form>
            <div class="explanation">
            <p>
                How much space should V8 allocate for an empty object? It's a tricky question. Presumably the
            object won't stay empty forever.
            </p>
            <p>
            In short, this is what V8 stores:
            </p>
            <ul>
                <li>hidden class reference (8 bytes)</li>
                <li>4 empty slots to store property values (32 bytes)</li>
                <li>empty slot for a reference to an overflow object, in case you assign more than 4 properties (8 bytes)</li>
                <li>empty slot for an object that stores values for numeric property indices(8 bytes)</li>
            </ul>
            <p>
            I've previously written a <a href="http://www.mattzeunert.com/2017/03/29/v8-object-size.html">longer explanation of V8 object sizes</a>.
            </p>
            <p>
                So the answer is: 56 bytes per object, plus the 8 byte reference to the object inside the array.
            </p>
        </div>
        </div>
        <h3>4. How much memory is used per array element?</h3>

            <pre><b>var Obj = function(){}</b>
var a = []
for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
    <b>a.push(new Obj())</b>
}</pre>
        <div>
            <form action="" data-question-index="3" data-correct-answer="32 bytes">
            <label><input type="radio" name="q3" value="8 bytes"> 8 bytes</label>
<label><input type="radio" name="q3" value="16 bytes"> 16 bytes</label>
<label><input type="radio" name="q3" value="32 bytes"> 32 bytes</label>
<label><input type="radio" name="q3" value="64 bytes"> 64 bytes</label>
<label><input type="radio" name="q3" value="128 bytes"> 128 bytes</label>
<label><input type="radio" name="q3" value="156 bytes"> 156 bytes</label>
            </form>
            <div class="explanation">
            <p>
                Again we have empty objects, but this time we use a constructor to create them. V8 can observe
                what happens during execution and it learns that Obj objects don't have any members.
            </p>
            <p>
            So we can skip the empty slots for new properties and just have three 8 byte properties:
            </p>
            <ul>
                <li>hidden class reference</li>
                <li>slot for storing extra properies</li>
                <li>slot for numeric indices</li>
            </ul>
        </div>
        </div>
        <h3>5. How much memory is used per array element?</h3>

            <pre>var a = []
for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
    <b>a.push("Hello")</b>
}</pre>
        <div>
            <form action="" data-question-index="4" data-correct-answer="8 bytes">
            <label><input type="radio" name="q4" value="8 bytes"> 8 bytes</label>
<label><input type="radio" name="q4" value="16 bytes"> 16 bytes</label>
<label><input type="radio" name="q4" value="32 bytes"> 32 bytes</label>
<label><input type="radio" name="q4" value="64 bytes"> 64 bytes</label>
<label><input type="radio" name="q4" value="128 bytes"> 128 bytes</label>
<label><input type="radio" name="q4" value="156 bytes"> 156 bytes</label>
            </form>
            <div class="explanation">
            <p>
                Each array element needs to hold a 64-bit memory reference to the string value.
                V8 will only create one string instance with the value "Hello", so given we have a large array
                the string size doesn't matter.
            </p>
        </div>
        </div>
        <h3>6. How much memory is used per array element?</h3>

            <pre>var a = []
for (var i=0; i&lt;MAGIC_ARRAY_LENGTH; i++) {
    <b>a.push(true)</b>
}</pre>
        <div>
            <form action="" data-question-index="5" data-correct-answer="8 bytes">
            <label><input type="radio" name="q5" value="1 byte"> 1 byte</label>
<label><input type="radio" name="q5" value="2 bytes"> 2 bytes</label>
<label><input type="radio" name="q5" value="4 bytes"> 4 bytes</label>
<label><input type="radio" name="q5" value="8 bytes"> 8 bytes</label>
<label><input type="radio" name="q5" value="16 bytes"> 16 bytes</label>
<label><input type="radio" name="q5" value="32 bytes"> 32 bytes</label>
            </form>
            <div class="explanation">
            <p>
            <code>true</code> is stored as an object reference just like a string. So again all we need to store is a 64 bit 
            memory location. <code>false</code>, <code>undefined</code> and <code>null</code> are treated the same way.
            </p>
        </div>
        </div>
        <h3>7. What is the total memory consumption of this program?</h3>

            <pre>var a = []
for (var i=0; <b>i&lt;1024 * 1024</b>; i++) {
    <b>a.push(Math.random())</b>
}</pre>
        <div>
            <form action="" data-question-index="6" data-correct-answer="10MB">
            <label><input type="radio" name="q6" value="2MB"> 2MB</label>
<label><input type="radio" name="q6" value="4MB"> 4MB</label>
<label><input type="radio" name="q6" value="8MB"> 8MB</label>
<label><input type="radio" name="q6" value="10MB"> 10MB</label>
<label><input type="radio" name="q6" value="16MB"> 16MB</label>
<label><input type="radio" name="q6" value="24MB"> 24MB</label>
            </form>
            <div class="explanation">
        <p>
            We're storing a bit over one million numbers, and each number takes 8 bytes. So
            we should expect an array length of 8MB.
            </p>
            <p>
            But that's not the case! You can always add more elements to a JavaScript array, but
            V8 doesn't want to resize the array every time you add an element.
            So it leaves some extra empty space at the end of the array.
            </p>
            <p>
            In the previous examples we've been using MAGIC_ARRAY_LENGTH, which is just at the threshold before
            the array is expanded. MAGIC_ARRAY_LENGTH is 1304209, while 1024 * 1024 is 1048576. But in both
            cases the amount of space used by the array is the same.
            </p>
        </div>
        </div>
        <h3>8. What is the total memory consumption of this program?</h3>

            <pre><b>var a = new Array(1024 * 1024)</b>
for (var i=0; i&lt;1024 * 1024; i++) {
    a[i] = Math.random()
}</pre>
        <div>
            <form action="" data-question-index="7" data-correct-answer="8MB">
            <label><input type="radio" name="q7" value="2MB"> 2MB</label>
<label><input type="radio" name="q7" value="4MB"> 4MB</label>
<label><input type="radio" name="q7" value="8MB"> 8MB</label>
<label><input type="radio" name="q7" value="10MB"> 10MB</label>
<label><input type="radio" name="q7" value="16MB"> 16MB</label>
<label><input type="radio" name="q7" value="24MB"> 24MB</label>
            </form>
            <div class="explanation">
            <p>
                Here V8 knows how big the array is going to be in the end, so it can allocate just the right amount
                of space.
            </p>
        </div>
        </div>
        <h3>9. What is the total memory consumption of this program?</h3>

            <pre><b>var a = new Int16Array(1024 * 1024)</b>
for (var i=0; i&lt;1024 * 1024; i++) {
    <b>a[i] = 1</b>
}</pre>
        <div>
            <form action="" data-question-index="8" data-correct-answer="2MB">
            <label><input type="radio" name="q8" value="2MB"> 2MB</label>
<label><input type="radio" name="q8" value="4MB"> 4MB</label>
<label><input type="radio" name="q8" value="8MB"> 8MB</label>
<label><input type="radio" name="q8" value="10MB"> 10MB</label>
<label><input type="radio" name="q8" value="16MB"> 16MB</label>
<label><input type="radio" name="q8" value="24MB"> 24MB</label>
            </form>
            <div class="explanation">
            <p>
                Our array contains 16-bit integers, which take 2 bytes each. A bit over one million of those
                means we need 2MB.
            </p>
        </div>
        </div>
        <p id="score">
        
    </p>
</div>
















<script>
var answeredQuestions = {}
var didClickOnce = false
window.onJQueryReady = function(){
    $("html").on("change", "input[type='radio']", function(){
        if (!didClickOnce) {
            didClickOnce = true
            ga("send", "event", "V8 Memory Quiz", "Started Quiz");
        }
        
        var form = $(this).parents('form')
        var correctAnswer = form.data("correctAnswer")
        var questionIndex = form.data("questionIndex")

        var $explanation = form.parent().find(".explanation")
        var isCorrect = $(this).val() === correctAnswer

        var alreadyAnsweredQuestion = answeredQuestions[questionIndex] !== undefined

        if (isCorrect) {
            answeredQuestions[questionIndex] = true
        } else {
            $(this).parents('label').addClass("incorrect")
            answeredQuestions[questionIndex] = false
        }

        if (!alreadyAnsweredQuestion) {
            ga("send", "event", "V8 Memory Quiz", "Answered Question", isCorrect);
        }

        var correctInput = form.find("input").filter(function() {
            return $(this).val() === correctAnswer
        })

        $explanation.addClass('show')

        $(correctInput).parents("label").addClass("correct")

        
        var totalQuestions = $(".explanation").length
        var answeredQuestionsCount = Object.keys(answeredQuestions).length

        if (totalQuestions === answeredQuestionsCount) {
            var correctAnswers = 0
            Object.keys(answeredQuestions).forEach(function(key){
                if (answeredQuestions[key] == true) {
                    correctAnswers++
                }
            })
            $("#score").html("You're done! You got " + correctAnswers + " out of " + totalQuestions + " questions right!")    
            $("#score").show()
            ga("send", "event", "V8 Memory Quiz", "Finished quiz", correctAnswers);
        }

        
    })
}

</script>

If you're interested in playing around with this in Chrome DevTools, it can be useful to wrap the value you're
interested in in a `Holder` class that you can then search for.

{% highlight javascript %}
function Holder() {}
var holder = new Holder()
var MAGIC_ARRAY_LENGTH = 1304209
var a = []
for (var i=0; i<MAGIC_ARRAY_LENGTH;i++) {
    a.push(null)
}
holder.a = a
{% endhighlight %}
{% comment %}jekyll is being weird>{% endcomment %}

![](/img/blog/v8-memory-quiz/devtools-memory.png)

I've been trying unsuccessfully to figure out how V8 strings work in memory. If you can figure that out I'd love to read a blog post about it!
