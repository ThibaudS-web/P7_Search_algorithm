import Tag from './Tag.js'

class TagViewDataWrapper {

    constructor(tag) {
        this.tag = tag
    }

    init() {
        this.getColor()
        this.getName()
    }


    getColor() {
        this.$wrapper.style.background = this.color
    }

    getName() {
        this.$wrapper.innerHTML = this.value
    }
}

export default TagViewDataWrapper

new TagViewDataWrapper()