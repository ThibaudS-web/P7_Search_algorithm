import { dataBaseClient } from "./database/databaseClient.js"
import CardRecipe from "./templates/CardRecipe.js"

function init() {
    addRecipes()
}

const recipes = dataBaseClient.getRecipes()

function addRecipes() {
    const recipesContainer = document.querySelector('#recipe-card-container')
    recipes.forEach(recipe => {
        const cardRecipe = new CardRecipe(recipe)
        recipesContainer.appendChild(cardRecipe.getHTML())
    })
}

init()


console.log(recipes.filter(recipe => recipe.name === 'Shake Banane Kiwi'))