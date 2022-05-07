import recipes from "../../data/recipes.js"

class DataBaseClient {
    constructor() {
        this.recipes = recipes
    }

    getRecipes() {
        this.errorHandler()
        return recipes
    }

    errorHandler() {
        if (recipes) {
            return
        } else {
            throw 'Recipes not found'
        }
    }
}

export const dataBaseClient = new DataBaseClient()
