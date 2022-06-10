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

/**
 * names for all names by filter type
 * tags for create all tags by filter type
 * filter to instantiate the filter 
 * @param {Function} callback 
 * @param {String} type 
 * @param {String} filterName 
 * @returns
 */
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
/**
 * Setup each filter for add and remove feature.
 * When a tag is deleted, udpateRecipes() is called.    
 * @param {*} filter 
 * @returns 
 */
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
//setup ingredient filter
const [ingredientsNames, ingredientsTags, filterIngredients] = filter(
    recipes.flatMap(recipe => recipe.ingredients)
        .filter((ingredient) => ingredient.ingredient.length > 0)
        .map(ingredient => textFormattingInFilter(ingredient.ingredient)),
    'ingredient',
    'Ingrédients'
)
//setup appliance filter
const [appliancesNames, appliancesTags, filterAppliances] = filter(
    recipes.filter((recipe) => recipe.appliance.length > 0)
        .map(recipe => textFormattingInFilter(recipe.appliance)),
    'appliance',
    'Appareils'
)
//setup ustensil filter
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

//Initialize the app
function init() {
    updateRecipes()
}

init()

/**
 * Clear the current DOM where are the recipes.
 * For each recipe, instantiation of recipes with RecipeViewDataWrapper(),
 * he takes a recipe in parameter.
 * If no recipe exists, then it displays a message on the page.
 * Once the recipes are displayed, the filters are displayed with displayFilters(recipes)
 * @param {*} recipes 
 */
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

/**
 * Clear the current DOM where are the filters.
 * All tags are filtered (ingredients, appliances and ustensils) with the new array of recipes in parameter.
 * After we call the restrictDisplayTags() method. This method sends the tags IDs that the filter should display.
 * Once the filter wrapper knows which tags it should display... We call the getHTML() method to display them.
 * @param {*} recipes 
 */
function displayFilters(recipes) {
    clearDOMContainer(filtersContainer)

    let appliancesFiltered = appliancesTags.filter(tag => {
        let filteredValues = recipes.map(recipe => recipe.appliance)
        return filteredValues.some(appliance => appliance.toLowerCase() === tag.name.toLowerCase())
    })
    console.log(appliancesFiltered)

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

/**
 * Add the tag to the DOM with the getSelectedHTML() method.
 * We push the tag wrapper in selectedTags array.
 * @param {*} tagWrapper 
 */
function addNewTag(tagWrapper) {
    let tagUI = tagWrapper.getSelectedHTML()
    tagsContainer.appendChild(tagUI)
    selectedTags.push(tagWrapper)
}

/**
 * We search for the wrapper of the tag by its ID that we want to remove with the find() method. 
 * We then search for the index corresponding to this wrapper in selectedTags,    
 * then delete it.
 * Do not forget to remove it from the DOM with a removeChild()
 * @param {*} id 
 */
function removeTag(id) {
    let tagUI = selectedTags.find(tagWrapper => tagWrapper.getId() === id).getSelectedHTML()
    let indexRemovedTag = selectedTags.findIndex(tagWrapper => tagWrapper.getId() === id)
    selectedTags.splice(indexRemovedTag, 1)
    tagsContainer.removeChild(tagUI)
}

//The general search bar
const searchInput = document.querySelector('#general-search')

//We listen every time the user types in the input with the addEventlistener changes. Each time the updateRecipes() method is called
searchInput.addEventListener('input', (event) => {
    currentSearch = event.target.value
    updateRecipes()
})

/**
 * If the current search is null, we return all the recipes. 
   If the size of the current search is greater than or equal to 3, we catch the values we want, the name of the recipe, its description and its ingredients. 
   Once all the values of all recipes have been entered, filter based on the current search.
   A new table of filtered recipes is returned.
 * @param {*} recipes 
 * @returns
 */
function searchByText(recipes) {
    if (currentSearch == null) {
        console.log(recipes)
        return recipes
    }
    if (currentSearch.length >= 3) {
        let filteredRecipe = []

        for (let i = 0; i < recipes.length; i++) {
            let name = recipes[i].name.toLowerCase()
            let description = recipes[i].description.toLowerCase()
            let ingredients = []
            let filteredValues = []
            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                ingredients.push(recipes[i].ingredients[j].ingredient.toLowerCase())
            }

            filteredValues = [name, description].concat(ingredients)

            for (let value of filteredValues) {
                if (value.includes(currentSearch.toLowerCase())) {
                    filteredRecipe.push(recipes[i])
                }
            }
        }
       
        console.log(filteredRecipe)
        return filteredRecipe

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
/**
 * 
 */
function updateRecipes() {
    let resultByText = searchByText(recipes)
    let resultByTag = searchByTag(resultByText)

    displayRecipes(resultByTag)
}

