const ul = document.querySelector('ul')
const inputContainer = document.querySelector("#ingredient-search-container")
const input = document.querySelector('#ingredient-search')

let isOpen
ul.style.display = "none"

function displayMenu() {
    if (!isOpen) {
        input.value = ''
        input.setAttribute('placeholder', 'Rechercher un ingrédient')
        inputContainer.classList.add('arrow-up')
        inputContainer.style.width = "auto"
        ul.style.display = "grid"
        isOpen = true
        console.log('if')
    } else {
        input.value = 'Ingredients'
        input.removeAttribute('placeholder')
        inputContainer.classList.remove('arrow-up')
        inputContainer.style.width = "170px"
        ul.style.display = "none"
        isOpen = false
        console.log('else')
    }
}

input.addEventListener('click', displayMenu)