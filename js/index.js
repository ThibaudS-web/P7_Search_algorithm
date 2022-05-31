import {
    dataBaseClient
} from "./database/databaseClient.js"
import CardViewDataWrapper from "./UI/CardViewDataWrapper.js"
import Tag from './models/Tag.js'
import textFormattingInFilter from "./utils/data-formatting.js"
import clearDOMContainer from "./utils/clear-DOM-container.js"
import Filter from "./models/Filter.js"
import FilterViewDataWrapper from './UI/FilterViewDataWrapper.js'


//All recipes from json file
const recipes = dataBaseClient.getRecipes()

let filteredRecipes
let currentSearch

let ingredientsNames
let appliancesNames
let ustensilsNames

//Contains the recipes
const recipesContainer = document.querySelector('#recipe-card-container')
//Contains the filters
const filtersContainer = document.querySelector('#specific-search-container')
//Contains the tags
const tagsContainer = document.querySelector('#tag-container')
const notFoundRecipe = document.querySelector('#notfound-recipe')
//Contains the selected tags
const selectedTags = new Map()

ingredientsNames = [...
    new Set(recipes.flatMap(recipe => recipe.ingredients)
        .filter((ingredient) => ingredient.ingredient.length > 0)
        .map(ingredient => textFormattingInFilter(ingredient.ingredient)))
]

appliancesNames = [...
    new Set(recipes
        .filter((recipe) => recipe.appliance.length > 0)
        .map(recipe => textFormattingInFilter(recipe.appliance)))
]

ustensilsNames = [...
    new Set(recipes.flatMap(recipe => recipe.ustensils)
        .filter((ustensil) => ustensil.length > 0)
        .map(ustensil => textFormattingInFilter(ustensil)))
]

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


//All possible tags displayed
let filterIngredients = new Filter('Ingrédients', 'ingredient', ingredientsTags)

let filterAppliances = new Filter('Appareils', 'appliance', appliancesTags)

let filterUstensils = new Filter('Ustensiles', 'ustensils', ustensilsTags)

let ingredientsFilterWrapper = new FilterViewDataWrapper(filterIngredients)
ingredientsFilterWrapper.setOnTagSelectedListener((wrapper) => {
    // Select ingredient tag
    addNewTag(wrapper)
    updateRecipes(wrapper.getName().toLowerCase())
})
ingredientsFilterWrapper.setOnTagUnselectedListener((wrapper) => {
    // Unselect ingredient tag
    removeTag(wrapper.getId())
    updateRecipes(null)

    Array.from(tagsContainer.children).forEach(child => {
        console.log(child.querySelector('.tag-name').innerHTML)
        updateRecipes(child.querySelector('.tag-name').innerHTML.toLowerCase())
    })
})

let appliancesFilterWrapper = new FilterViewDataWrapper(filterAppliances)
appliancesFilterWrapper.setOnTagSelectedListener((wrapper) => {
    // Select appliance tag
    addNewTag(wrapper)
    updateRecipes(wrapper.getName().toLowerCase())
})
appliancesFilterWrapper.setOnTagUnselectedListener((wrapper) => {
    // Unselect appliance tag
    removeTag(wrapper.getId())
    updateRecipes(null)

    Array.from(tagsContainer.children).forEach(child => {
        console.log(child.querySelector('.tag-name').innerHTML)
        updateRecipes(child.querySelector('.tag-name').innerHTML.toLowerCase())
    })
})

let ustensilsFilterWrapper = new FilterViewDataWrapper(filterUstensils)
ustensilsFilterWrapper.setOnTagSelectedListener((wrapper) => {
    // Select ustensil tag
    addNewTag(wrapper)
    updateRecipes(wrapper.getName().toLowerCase())
})
ustensilsFilterWrapper.setOnTagUnselectedListener((wrapper) => {
    // Unselect ustensil tag
    removeTag(wrapper.getId())
    updateRecipes(null)

    //récupérer les tags (pas l'UI)

    Array.from(tagsContainer.children).forEach(child => {
        console.log(child.querySelector('.tag-name').innerHTML)
        updateRecipes(child.querySelector('.tag-name').innerHTML.toLowerCase())
    })
})

function init() {
    updateRecipes(null)
}

init()

function displayRecipes(recipes) {
    clearDOMContainer(recipesContainer)

    recipes.forEach(recipe => {
        const cardRecipe = new CardViewDataWrapper(recipe)
        recipesContainer.appendChild(cardRecipe.getHTML())
    })

    if (recipesContainer.children.length === 0) {
        notFoundRecipe.style.display = 'block'
    } else {
        notFoundRecipe.style.display = 'none'
    }

    displayFilters(recipes)
}

//appliquer une fonction pour chaque rubrique de displayFilters
function displayFilters(recipes) {
    clearDOMContainer(filtersContainer)

    let appliancesFiltered = appliancesTags.filter(tag => {
        let filteredValues = recipes.map(recipe => recipe.appliance)
        return filteredValues.some(appliance => appliance.toLowerCase() === tag.name.toLowerCase())
    })

    let ingredientsFiltered = ingredientsTags.filter(tag => {
        let filteredValues = recipes.flatMap(recipe => recipe.ingredients)
            .map(ingredient => ingredient.ingredient)
        return filteredValues.some(ingredient => ingredient.toLowerCase() === tag.name.toLowerCase())
    })

    let ustensilsFiltered = ustensilsTags.filter(tag => {
        let filteredValues = recipes.flatMap(recipe => recipe.ustensils)

        return filteredValues.some(ustensil => ustensil.toLowerCase() === tag.name.toLowerCase())
    })

    ingredientsFilterWrapper.restrictDisplayTags(ingredientsFiltered.map(ingredientTag => ingredientTag.id))
    appliancesFilterWrapper.restrictDisplayTags(appliancesFiltered.map(applianceTag => applianceTag.id))
    ustensilsFilterWrapper.restrictDisplayTags(ustensilsFiltered.map(ustensilTag => ustensilTag.id))

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
    if (tagsContainer.children.length === 0) {
        updateRecipes(null)
    }
}


//Create the new branch  for boucles natives algo

function updateRecipes(search) {

    if (search === null) {
        filteredRecipes = recipes
    }

    if (tagsContainer.children.length > 1 && search != null) {

        filteredRecipes = filteredRecipes.filter(recipe => {

            let filteredValues = [recipe.name, recipe.description].concat(recipe.ingredients.map(ingredient => ingredient.ingredient))

            return filteredValues.map(property => property.toLowerCase()).some(property => property.includes(search))
        })
    }

    if (tagsContainer.children.length <= 1 && search != null) {

        filteredRecipes = recipes.filter(recipe => {

            let filteredValues = [recipe.name, recipe.description].concat(recipe.ingredients.map(ingredient => ingredient.ingredient))

            return filteredValues.map(property => property.toLowerCase()).some(property => property.includes(search))
        })
    }

    displayRecipes(filteredRecipes)
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


//JAMAIS REGARDER l'UI

//Regarder les tags isSelected pour forEach dans updateRecipes


//Prendre toutes les recettes qui ont le tag sélectionné

