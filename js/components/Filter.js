class Filter {

    onClick = () => {
        console.log("onClick listener is not defined")
    }

    constructor(title, value, itemList, color) {
        this.title = title
        this.value = value
        this.$wrapper = document.createElement('nav')
        this.color = color
        this.itemList = itemList
        this.isOpen
    }

    getHTML() {
        const searchBarTemplate = `
            <div class="measure-specific-search-container" >
				<input value="${this.value}" type="text" />
					<ul>
                      
					</ul>
			</div >
        `
        this.$wrapper.innerHTML = searchBarTemplate

        const input = this.$wrapper.querySelector('input')
        const ul = this.$wrapper.querySelector('ul')

        input.style.background = this.color
        ul.style.background = this.color

        input.addEventListener('click', () => {
            this.displaySearchBar()
        })

        this.itemList.forEach(item => {
            ul.innerHTML += `<li>${item}</li>`
        })

        return this.$wrapper
    }

    displaySearchBar() {
        const ul = this.$wrapper.querySelector('ul')
        const inputContainer = this.$wrapper.querySelector(`.measure-specific-search-container`)
        const input = this.$wrapper.querySelector('input')
        ul.style.display = "none"

        if (!this.isOpen) {
            input.value = ''
            input.setAttribute(
                'placeholder',
                `Rechercher un ${this.value.toLowerCase()
                    .substring(0, this.value.length - 1)}`
            )
            inputContainer.classList.add('arrow-up')
            inputContainer.style.width = "auto"
            ul.style.display = "block"
            this.isOpen = true
            console.log('if')
        } else {
            input.value = this.value
            input.removeAttribute('placeholder')
            inputContainer.classList.remove('arrow-up')
            inputContainer.style.width = "170px"
            ul.style.display = "none"
            this.isOpen = false
            console.log('else')
        }
    }
}


export default Filter
