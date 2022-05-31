class TagViewDataWrapper {
    //tag is private
    #tag
    #unselectedTagUI
    #selectedTagUI
    #selected
    #onTagSelected = (id) => {
        console.log("onTagUnselected not defined!")
    }
    #onTagUnselected = (id) => {
        console.log("onTagUnselected not defined!")
    }

    constructor(tag) {
        this.#tag = tag
        this.#unselectedTagUI = document.createElement('li')
        this.#selectedTagUI = document.createElement('div')
        this.#selected = false

        this.buildUnselectedUI()
        this.buildSelectedUI()
    }

    buildUnselectedUI() {
        this.#unselectedTagUI.innerHTML = `${this.#tag.name}`
        this.#unselectedTagUI.addEventListener('click', (event) => {
            if (!this.#selected) {
                this.selectTag()
            } else {
                this.unselectTag()
            }
        })
    }

    buildSelectedUI() {
        const tagTemplate = `
			<p class='tag-name'>${this.getName()}</p>
			<svg id="unselect-icon"
				class="close-tag"
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
					fill="white"
					/>
			</svg>
        `

        this.#selectedTagUI.classList.add('tags')
        this.#selectedTagUI.style.backgroundColor = this.getColor()
        this.#selectedTagUI.innerHTML = tagTemplate

        this.#selectedTagUI.querySelector('#unselect-icon').addEventListener('click', () => {
            if (this.#selected) {
                this.unselectTag()
            }
        })
    }

    setOnTagSelectedListener(onTagSelected) {
        this.#onTagSelected = onTagSelected
    }
    setOnTagUnselectedListener(onTagUnselected) {
        this.#onTagUnselected = onTagUnselected
    }

    getSelectedHTML() {
        return this.#selectedTagUI
    }

    getUnselectedHTML() {
        return this.#unselectedTagUI
    }

    getColor() {
        let color
        switch (this.#tag.type) {
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
                throw 'Type unknow!'
        }

        return color
    }

    getName() {
        return this.#tag.name
    }

    getId() {
        return this.#tag.id
    }

    selectTag() {
        this.#unselectedTagUI.classList.add("tag-selected")
        this.#selected = true
        this.#onTagSelected(this.#tag.id)
    }

    unselectTag() {
        this.#unselectedTagUI.classList.remove("tag-selected")
        this.#selected = false
        this.#onTagUnselected(this.#tag.id)
    }
}

export default TagViewDataWrapper