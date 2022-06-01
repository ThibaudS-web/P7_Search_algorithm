import {
    dataBaseClient
} from "./database/databaseClient.js"
import RecipeViewDataWrapper from "./UI/RecipeViewDataWrapper.js"
import Tag from './models/Tag.js'
import textFormattingInFilter from "./utils/data-formatting.js"
import clearDOMContainer from "./utils/clear-DOM-container.js"
import Filter from "./models/Filter.js"
import FilterViewDataWrapper from './UI/FilterViewDataWrapper.js'


//All recipes from json file
const recipes = dataBaseClient.getRecipes()

let currentSearch = null

//Contains the recipes
const recipesContainer = document.querySelector('#recipe-card-container')
//Contains the filters
const filtersContainer = document.querySelector('#specific-search-container')
//Contains the tags
const tagsContainer = document.querySelector('#tag-container')
const notFoundRecipe = document.querySelector('#notfound-recipe')
//Contains the selected tags
const selectedTags = []

function filter(callback, type, filterName) {
    let tagId = 0;

    const names = [
        ...new Set(callback),
    ];

    const tags = names.map((name) => {
        tagId++;
        return new Tag(tagId, name, type);
    });

    const filter = new Filter(filterName, type, tags)

    return [names, tags, filter];
}

function filterUI(filter) {
    const filterWrapper = new FilterViewDataWrapper(filter)
    filterWrapper.setOnTagSelectedListener((wrapper) => {
        // Select ingredient tag
        addNewTag(wrapper)
        updateRecipes()
    })

    filterWrapper.setOnTagUnselectedListener((wrapper) => {
        // Unselect ingredient tag
        removeTag(wrapper.getId())
        updateRecipes()
    })

    return filterWrapper
}

const [ingredientsNames, ingredientsTags, filterIngredients] = filter(
    recipes.flatMap(recipe => recipe.ingredients)
        .filter((ingredient) => ingredient.ingredient.length > 0)
        .map(ingredient => textFormattingInFilter(ingredient.ingredient)),
    'ingredient',
    'Ingrédients'
)

const [appliancesNames, appliancesTags, filterAppliances] = filter(
    recipes.filter((recipe) => recipe.appliance.length > 0)
        .map(recipe => textFormattingInFilter(recipe.appliance)),
    'appliance',
    'Appareils'
)

const [ustensilsNames, ustensilsTags, filterUstensils] = filter(
    recipes.flatMap(recipe => recipe.ustensils)
        .filter((ustensil) => ustensil.length > 0)
        .map(ustensil => textFormattingInFilter(ustensil)),
    'ustensils',
    'Ustensiles'
)

let ingredientsFilterWrapper = filterUI(filterIngredients)
let appliancesFilterWrapper = filterUI(filterAppliances)
let ustensilsFilterWrapper = filterUI(filterUstensils)


function init() {
    updateRecipes()
}

init()

function displayRecipes(recipes) {
    clearDOMContainer(recipesContainer)

    recipes.forEach(recipe => {
        const cardRecipe = new RecipeViewDataWrapper(recipe)
        recipesContainer.appendChild(cardRecipe.getHTML())
    })

    if (recipes.length === 0) {
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
    selectedTags.push(tagWrapper)
}

function removeTag(id) {
    let tagUI = selectedTags.find(tagWrapper => tagWrapper.getId() === id).getSelectedHTML()
    let indexRemovedTag = selectedTags.findIndex(tagWrapper => tagWrapper.getId() === id)
    selectedTags.splice(indexRemovedTag, 1)
    tagsContainer.removeChild(tagUI)
}

const searchInput = document.querySelector('#general-search')

searchInput.addEventListener('input', (event) => {
    currentSearch = event.target.value
    updateRecipes()
})

function searchByText(recipes) {
    if (currentSearch == null) {
        return recipes
    }
    if (currentSearch.length >= 3) {
        return recipes.filter(recipe => {
            let filteredValues = [recipe.name, recipe.description].concat(recipe.ingredients.map(ingredient => ingredient.ingredient))

            return filteredValues.map(property => property.toLowerCase()).some(property => property.includes(currentSearch.toLowerCase()))
        })
    } else {
        return recipes
    }
}

function searchByTag(recipes) {
    return recipes.filter(recipe => {
        let ingredientsName = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase())
        let ingredientsTagSelected = selectedTags.filter(wrapper => {
            return wrapper.isIngredient()
        }).map(wrapper => wrapper.getName().toLowerCase())

        //si les tags selectionnés sont tous présents dans les ingrédients de la recette (every)
        let ingredientsTagValid = ingredientsTagSelected.every(tag => {
            return ingredientsName.includes(tag)
        })

        let appliancesTagSelected = selectedTags.filter(wrapper => {
            return wrapper.isAppliance()
        }).map(wrapper => wrapper.getName().toLowerCase())

        let applianceTagValid = appliancesTagSelected.every(tagName => {
            return recipe.appliance.toLowerCase() === tagName
        })

        let ustensilsTagSelected = selectedTags.filter(wrapper => {
            return wrapper.isUstensil()
        }).map(wrapper => wrapper.getName().toLowerCase())

        let ustensilsTagValid = ustensilsTagSelected.every(tagName => {
            return recipe.ustensils.map(ustensil => ustensil.toLowerCase()).includes(tagName)
        })

        return ingredientsTagValid && applianceTagValid && ustensilsTagValid
    })
}

function updateRecipes() {
    let resultByText = searchByText(recipes)
    let resultByTag = searchByTag(resultByText)

    displayRecipes(resultByTag)
}

