import IngredientViewDataWrapper from "./IngredientViewDataWrapper.js"

class RecipeViewDataWrapper {
    
    constructor(recipe) {
        this.recipe = recipe
        this.$wrapper = document.createElement('article')
        this.listOfIngredients = []
        this.ingredientsWrappers = recipe.ingredients.map(ingredient => {
            return new IngredientViewDataWrapper(ingredient)
        })
        this.ingredientsElements = this.ingredientsWrappers.map((wrapper) => { return wrapper.getHTML() })
    }

    getHTML() {
        const cardTemplate = `
            <div id="image"></div>
                <div id="card-content">
                    <div id="card-title">
                        <h2 title="${this.recipe.name}">${this.recipe.name}</h2>
                        <p id="time">
                            <i class="fa-regular fa-clock"></i>
                            ${this.recipe.time} min
                        </p>
                    </div>
                    <div id="card-body">
                        <div id="ingredients">
                            ${this.ingredientsElements.join('')}
                        </div>
                        <div id="description">
                            <p title="${this.recipe.description}">
                               ${this.recipe.description}
                            </p>
                        </div>
                    </div>
                </div>
            `
        this.$wrapper.innerHTML = cardTemplate
        return this.$wrapper
    }
}

export default RecipeViewDataWrapper