import { dataBaseClient } from "./database/databaseClient.js"
import CardRecipe from "./templates/CardRecipe.js"
import Filter from "./components/Filter.js"
import textFormattingInFilter from "./utils/data-formatting.js"

//All recipes from json file
const recipes = dataBaseClient.getRecipes()

let ingredientsList
let appliancesList
let ustensilsList

console.log(ingredientsList)

//Setlist of ingredients, appiances and ustensils
const recipesContainer = document.querySelector('#recipe-card-container')
const specificSearchBarContainer = document.querySelector('#specific-search-container')

function init() {
    displayRecipes(recipes)
    setFiltersValues(recipes)
    displayFilters(ingredientsList, appliancesList, ustensilsList)
}

init()

function setFiltersValues(recipe) {
    ingredientsList = [...new Set(recipe.flatMap(recipe => recipe.ingredients)
        .map(ingredient => textFormattingInFilter(ingredient.ingredient)))]

    appliancesList = [...new Set(recipe.map(recipe => textFormattingInFilter(recipe.appliance)))]

    ustensilsList = [...new Set(recipe.flatMap(recipe => recipe.ustensils)
        .map(ustensil => textFormattingInFilter(ustensil)))]
}

function displayRecipes(recipes) {
    recipes.forEach(recipe => {
        const cardRecipe = new CardRecipe(recipe)
        recipesContainer.appendChild(cardRecipe.getHTML())
    })
}

function displayFilters(indredients, appiances, ustensiles) {
    specificSearchBarContainer.appendChild(new Filter('ingredient', 'Ingredients', indredients, '#3282f7').getHTML())
    specificSearchBarContainer.appendChild(new Filter('appliance', 'Appareils', appiances, '#68d9a4').getHTML())
    specificSearchBarContainer.appendChild(new Filter('ustensils', 'Ustensiles', ustensiles, '#ed6454').getHTML())
}

console.log(recipes.filter(recipe => recipe.name === 'Shake Banane Kiwi'))

const searchInput = document.querySelector('#general-search')

let filteredList = false

searchInput.addEventListener('input', () => {
    if (searchInput.value.length >= 3) {
        updateRecipes(searchInput.value.toLowerCase())
        filteredList = true
    } else if (filteredList) {
        filteredList = false
        displayRecipes(recipes)
        updateFilters(recipes)
    }
})

function updateRecipes(search) {

    Array.from(recipesContainer.children).forEach(node => node.remove())

    let filteredRecipes = recipes.filter(recipe => {

        let filteredValues = [recipe.name, recipe.description].concat(recipe.ingredients.map(ingredient => ingredient.ingredient))
        console.log(filteredValues)

        return filteredValues.map(property => property.toLowerCase()).some(property => property.includes(search))

    })

    displayRecipes(filteredRecipes)
    updateFilters(filteredRecipes)
}

function updateFilters(dataFromfilteredRecipes) {

    Array.from(specificSearchBarContainer.children).forEach(node => node.remove())

    setFiltersValues(dataFromfilteredRecipes)

    displayFilters(ingredientsList, appliancesList, ustensilsList)
}
