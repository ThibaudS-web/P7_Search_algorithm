class CardRecipe {
    constructor(recipe) {
        this.recipe = recipe
        this.$wrapper = document.createElement('article')
        this.listOfIngredients = []
    }

// let ingredientsElements = this.#ingredientsWrappers.map((wrapper) => { return wrapper.getHTML() })
    insertIngredients() {
        this.recipe.ingredients.forEach(ingredient => {
            let ingredientUnit

            switch (ingredient.unit) {
                case 'grammes':
                    ingredientUnit = 'g'
                    break
                case 'cuillères à soupe':
                    ingredientUnit = 'c.à.s'
                    break
                case 'cuillères à café':
                    ingredientUnit = 'c.à.c'
                    break
                case 'cl': 
                    ingredientUnit = 'cl'
                case 'ml':
                    ingredientUnit = 'ml'
            }

            const ingredientTemplate = `<p><strong>${ingredient.quantity ? ingredient.ingredient + ':' : ingredient.ingredient}</strong> ${ingredient.quantity ? ingredient.quantity
                : ""}${ingredientUnit ? ingredientUnit : ""}</p>`
            this.listOfIngredients.push(ingredientTemplate)
        })

        return this.listOfIngredients.join('')
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
                            ${this.insertIngredients()}
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

export default CardRecipe