import { dataBaseClient } from "./database/databaseClient.js"
import CardRecipe from "./templates/CardRecipe.js"
import Filter from "./components/Filter.js"
import textFormattingInFilter from "./utils/data-formatting.js"
import clearDOMContainer from "./utils/clear-DOM-container.js"

//All recipes from json file
const recipes = [...new Set(dataBaseClient.getRecipes())]

let ingredientsList
let appliancesList
let ustensilsList

//Contains the recipes
const recipesContainer = document.querySelector('#recipe-card-container')
//Contains the filters
const filtersContainer = document.querySelector('#specific-search-container')

function init() {
    displayRecipes(recipes)
    setFiltersValues(recipes)
    displayFilters(ingredientsList, appliancesList, ustensilsList)
}

init()

//Setlist of ingredients, appiances and ustensils
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
    filtersContainer.appendChild(new Filter('ingredient', 'Ingredients', indredients, '#3282f7').getHTML())
    filtersContainer.appendChild(new Filter('appliance', 'Appareils', appiances, '#68d9a4').getHTML())
    filtersContainer.appendChild(new Filter('ustensils', 'Ustensiles', ustensiles, '#ed6454').getHTML())
}

const searchInput = document.querySelector('#general-search')

let filteredList = false

searchInput.addEventListener('input', () => {

    if (searchInput.value.length >= 3) {
        updateRecipes(searchInput.value.toLowerCase())
        filteredList = true
    } else if (filteredList) {
        filteredList = false
        clearDOMContainer(recipesContainer)
        displayRecipes(recipes)
        updateFilters(recipes)
    }
})

function updateRecipes(search) {

    clearDOMContainer(recipesContainer)

    let filteredRecipes = recipes.filter(recipe => {

        let filteredValues = [recipe.name, recipe.description].concat(recipe.ingredients.map(ingredient => ingredient.ingredient))

        return filteredValues.map(property => property.toLowerCase()).some(property => property.includes(search))
    })

    displayRecipes(filteredRecipes)
    updateFilters(filteredRecipes)
}

function updateFilters(dataFromfilteredRecipes) {

    clearDOMContainer(filtersContainer)
    setFiltersValues(dataFromfilteredRecipes)
    displayFilters(ingredientsList, appliancesList, ustensilsList)
}

