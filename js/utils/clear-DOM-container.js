function clearDOMContainer(container) {
    Array.from(container.children).forEach(node => node.remove())
}

export default clearDOMContainer