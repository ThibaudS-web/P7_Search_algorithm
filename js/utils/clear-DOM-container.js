function clearDOMContainer(container) {
    Array.from(container.children).forEach(node => node.remove())
    console.log(container.children)
}

export default clearDOMContainer