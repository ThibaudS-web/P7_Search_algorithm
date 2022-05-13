function textFormattingInFilter(text) {
    let capitalize =  text.charAt(0).toUpperCase() + text.slice(1)
    let onlyLetters = capitalize.replace(/[(0-9)-._]/gi, '')

    return onlyLetters
}

export default textFormattingInFilter

