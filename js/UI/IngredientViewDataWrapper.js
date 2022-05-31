class IngredientViewDataWrapper {
    constructor(ingredient) {
        this.ingredient = ingredient
    }

    dataFormatting() {
        let ingredientUnit
        switch (this.ingredient.unit) {
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

        return ingredientUnit
    }

    getHTML() {
        const ingredientTemplate = `
            <p><strong>${this.ingredient.quantity ? this.ingredient.ingredient + ':' : this.ingredient.ingredient}</strong> ${this.ingredient.quantity ? this.ingredient.quantity
                : ""}${this.dataFormatting() ? this.dataFormatting() : ""}
            </p>`
        return ingredientTemplate
    }
}

export default IngredientViewDataWrapper