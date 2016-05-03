(function(){
    var post = {
        title: "Logging values to the console",
        metadata: {
            createdAt: new Date(),
            tags: [
                new Tag({
                    id: 55,
                    title: "JavaScript",
                    createdAt: new Date(2016, 2, 2),
                    createdBy: "Sally Green"
                }),
                new Tag({
                    id: 89,
                    title: "HTML",
                    createdAt: new Date(2015, 5, 3),
                    createdBy: "John Doe"
                }),
                new Tag({
                    id: 15,
                    title: "CSS",
                    createdAt: new Date(2010, 5, 2),
                    createdBy: "Sally Green"
                }),
                new Tag({
                    id: 13,
                    title: "JS",
                    createdAt: new Date(2016, 2, 1),
                    createdBy: "Sally Green"
                }),
                new Tag({
                    id: 27,
                    title: "Debugging",
                    createdAt: new Date(2015, 5, 2),
                    createdBy: "John Doe"
                }),
                new Tag({
                    id: 16,
                    title: "Chrome DevTools",
                    createdAt: new Date(2010, 6, 2),
                    createdBy: "Bob Orange"
                })
            ]
        }
    }

    console.log("Post:", post);
})();