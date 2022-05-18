import TagViewDataWrapper from "./TagViewDataWrapper.js"

class FilterViewDataWrapper {
    #filter
    #isOpen
    #tagWrappers

    constructor(filter) {
        this.#filter = filter
        this.$wrapper = document.createElement('nav')
        this.#tagWrappers = filter.tagList.map((tag) => {
            return new TagViewDataWrapper(tag)
        }).sort((a, b) => a.getName().localeCompare(b.getName()))
    }

    setOnTagSelectedListener(onTagSelected) {
        this.#tagWrappers.forEach((wrapper) => {
            let updatedOnTagSelected = (id) => {
                onTagSelected(wrapper)
            }
            wrapper.setOnTagSelectedListener(updatedOnTagSelected)
        })
    }

    setOnTagUnselectedListener(onTagUnselected) {
        this.#tagWrappers.forEach((wrapper) => {
            let updatedOnTagUnselected = (id) => {
                onTagUnselected(wrapper)
            }
            wrapper.setOnTagUnselectedListener(updatedOnTagUnselected)
        })
    }

    getHTML() {
        let tagsElements = this.#tagWrappers.map((wrapper) => { return wrapper.getUnselectedHTML() })

        const searchBarTemplate = `
            <div class="measure-specific-search-container" >
				<input id="search-bar-${this.#filter.type}" value="${this.#filter.title}" type="text" />
					<ul id="tag-list-${this.#filter.type}">
					</ul>
			</div>
        `

        this.$wrapper.innerHTML = searchBarTemplate

        const input = this.$wrapper.querySelector(`#search-bar-${this.#filter.type}`)
        const ul = this.$wrapper.querySelector(`#tag-list-${this.#filter.type}`)

        tagsElements.forEach((elt) => {
            ul.appendChild(elt)
        })
        input.style.background = this.getColor()
        ul.style.background = this.getColor()

        input.addEventListener('click', () => {
            this.displaySearchBar()
        })

        return this.$wrapper
    }

    displaySearchBar() {
        const ul = this.$wrapper.querySelector(`#tag-list-${this.#filter.type}`)
        const inputContainer = this.$wrapper.querySelector(`.measure-specific-search-container`)
        const input = this.$wrapper.querySelector(`#search-bar-${this.#filter.type}`)
        ul.style.display = "none"

        if (!this.#isOpen) {
            input.value = ''
            input.setAttribute(
                'placeholder',
                `Rechercher un ${this.#filter.title.toLowerCase().substring(0, this.#filter.title.length - 1)}`
            )
            inputContainer.classList.add('arrow-up')
            ul.style.display = "block"
            this.#isOpen = true
        } else {
            input.value = this.#filter.title
            input.removeAttribute('placeholder')
            inputContainer.classList.remove('arrow-up')
            ul.style.display = "none"
            this.#isOpen = false
        }
    }

    getColor() {
        let color
        switch (this.#filter.type) {
            case 'ingredient':
                color = '#3282f7'
                break
            case 'appliance':
                color = '#68d9a4'
                break
            case 'ustensils':
                color = '#ed6454'
                break
            default:
                throw 'Type unknown!'
        }

        return color
    }
}


export default FilterViewDataWrapper