import {
    dataBaseClient
} from "./database/databaseClient.js"
import CardRecipe from "./UI/CardRecipe.js"
import Tag from './models/Tag.js'
import textFormattingInFilter from "./utils/data-formatting.js"
import clearDOMContainer from "./utils/clear-DOM-container.js"
import Filter from "./models/Filter.js"
import FilterViewDataWrapper from './UI/FilterViewDataWrapper.js'
import TagViewDataWrapper from "./UI/TagViewDataWrapper.js"

//All recipes from json file
const recipes = dataBaseClient.getRecipes()


let ingredientsNames
let appliancesNames
let ustensilsNames

//Contains the recipes
const recipesContainer = document.querySelector('#recipe-card-container')
//Contains the filters
const filtersContainer = document.querySelector('#specific-search-container')
//Contains the tags
const tagsContainer = document.querySelector('#tag-container')
//Contains the selected tags
const selectedTags = new Map()

function init() {
    updateRecipes(null)
}

init()

function displayRecipes(recipes) {
    clearDOMContainer(recipesContainer)
    recipes.forEach(recipe => {
        const cardRecipe = new CardRecipe(recipe)
        recipesContainer.appendChild(cardRecipe.getHTML())
    })

    displayFilters(recipes)
}

function displayFilters(recipes) {
    clearDOMContainer(filtersContainer)

    ingredientsNames = [...new Set(recipes.flatMap(recipe => recipe.ingredients)
        .map(ingredient => textFormattingInFilter(ingredient.ingredient)))]

    appliancesNames = [...new Set(recipes.map(recipe => textFormattingInFilter(recipe.appliance)))]

    ustensilsNames = [...new Set(recipes.flatMap(recipe => recipe.ustensils)
        .map(ustensil => textFormattingInFilter(ustensil)))]

    let tagId = 0

    let ingredientsTags = ingredientsNames.map(item => {
        tagId++
        return new Tag(tagId, item, 'ingredient')
    })

    let appliancesTags = appliancesNames.map(item => {
        tagId++
        return new Tag(tagId, item, 'appliance')
    })

    let ustensilsTags = ustensilsNames.map(item => {
        tagId++
        return new Tag(tagId, item, 'ustensils')
    })

    let filterIngredients = new Filter('Ingrédients', 'ingredient', ingredientsTags)

    let filterAppliances = new Filter('Appareils', 'appliance', appliancesTags)

    let filterUstensils = new Filter('Ustensiles', 'ustensils', ustensilsTags)

    let ingredientsFilterWrapper = new FilterViewDataWrapper(filterIngredients)
    ingredientsFilterWrapper.setOnTagSelectedListener((wrapper) => {
        // Select ingredient tag
        addNewTag(wrapper)
    })
    ingredientsFilterWrapper.setOnTagUnselectedListener((wrapper) => {
        // Unselect ingredient tag
        removeTag(wrapper.getId())
        console.log(wrapper.getId())
    })
    let appliancesFilterWrapper = new FilterViewDataWrapper(filterAppliances)
    appliancesFilterWrapper.setOnTagSelectedListener((wrapper) => {
        // Select appliance tag
        addNewTag(wrapper)
    })
    appliancesFilterWrapper.setOnTagUnselectedListener((wrapper) => {
        // Unselect appliance tag
        removeTag(wrapper.getId())
    })
    let ustensilsFilterWrapper = new FilterViewDataWrapper(filterUstensils)
    ustensilsFilterWrapper.setOnTagSelectedListener((wrapper) => {
        // Select ustensil tag
        addNewTag(wrapper)
    })
    ustensilsFilterWrapper.setOnTagUnselectedListener((wrapper) => {
        // Unselect ustensil tag
        removeTag(wrapper.getId())
    })

    filtersContainer.appendChild(ingredientsFilterWrapper.getHTML())
    filtersContainer.appendChild(appliancesFilterWrapper.getHTML())
    filtersContainer.appendChild(ustensilsFilterWrapper.getHTML())
}

function addNewTag(tagWrapper) {
    let tagUI = tagWrapper.getSelectedHTML()
    tagsContainer.appendChild(tagUI)
    selectedTags.set(tagWrapper.getId(), tagUI)
}

function removeTag(id) {
    let tagUI = selectedTags.get(id)
    tagsContainer.removeChild(tagUI)
    console.log(selectedTags.get(id))
}


const searchInput = document.querySelector('#general-search')

let filteredList = false

searchInput.addEventListener('input', () => {

    if (searchInput.value.length >= 3) {
        updateRecipes(searchInput.value.toLowerCase())
        filteredList = true
    } else if (filteredList) {
        filteredList = false
        updateRecipes(null)
    }
})

function updateRecipes(search) {
    let filteredRecipes
    if (search == null) {
        filteredRecipes = recipes
    } else {
        filteredRecipes = recipes.filter(recipe => {

            let filteredValues = [recipe.name, recipe.description].concat(recipe.ingredients.map(ingredient => ingredient.ingredient))
            
            return filteredValues.map(property => property.toLowerCase()).some(property => property.includes(search))
        })
    }

    displayRecipes(filteredRecipes)
}
