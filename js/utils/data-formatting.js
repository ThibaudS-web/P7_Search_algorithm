function textFormattingInFilter(text) {
    let capitalize =  text.charAt(0).toUpperCase() + text.slice(1)

    return capitalize
}

export function normalizeAccent(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export default textFormattingInFilter

