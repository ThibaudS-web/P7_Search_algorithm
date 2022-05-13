class CardRecipe {
    constructor(recipe) {
        this.recipe = recipe
        this.$wrapper = document.createElement('article')
        this.listOfIngredients = []
    }

    insertIngredients() {
        this.recipe.ingredients.forEach(ingredient => {

            switch (ingredient.unit) {
                case 'grammes':
                    ingredient.unit = 'g'
                    break
                case 'cuillères à soupe':
                    ingredient.unit = 'c.à.s'
                    break
                case 'cuillères à café':
                    ingredient.unit = 'c.à.c'
                    break
            }

            const ingredientTemplate = `<p><strong>${ingredient.quantity ? ingredient.ingredient + ':' : ingredient.ingredient}</strong> ${ingredient.quantity ? ingredient.quantity
                : ""}${ingredient.unit ? ingredient.unit : ""}</p>`
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