var recipeList = document.getElementById("recipes")

function displayRecipes(){
    recipeList.innerHTML = "";
    recipes.forEach(displayRecipe)
}

function displayRecipe(recipe){
    var title = recipe.title;
    var author = recipe.author;

    var html = "<div>"
        html += "<span>"
            html += title
        html += "</span>"
        html += "<span style='font-size: 10px; color: #999; text-transform: uppercase'>"
            html += " by "
            html += processAuthorName(author)
        html += "</span>"
    html += "</div>"
    recipeList.innerHTML += html
}

function processAuthorName(author){
    if (author === "Sally") {
        return ""; // I need some kind of bug
    }
    else {
        return author;
    }
}
