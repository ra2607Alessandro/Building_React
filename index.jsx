const Didact = {createElement, render}




function createElement(type , props , ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === "object"
                ?child : createTextElement(child)
            )
        }
    }

}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            ...children,
        }
    }
}
function createDOM(fiber) {
    const dom = 
    fiber.type == "TEXT_ELEMENT"
    ?document.createTextNode("") : document.createElement(fiber.type)

    const isProperty = 
    key => key !== "children"
    Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name=> { dom[name]=element.props[name]})

    fiber.props.children.forEach(child => render(child, dom))

    container.appendChild(dom)
 }


function render(element, container ) {

    const dom = 
    element.type == "TEXT_ELEMENT"
    ?document.createTextNode("") : document.createElement(element.type)

    const isProperty = 
    key => key !== "children"
    Object.keys(element.props)
    .filter(isProperty)
    .forEach(name=> { dom[name]=element.props[name]})

    element.props.children.forEach(child => render(child, dom))

    return dom 
 }
let nextUnitOfWork = null

function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1

    }
    requestIdCallback(workLoop)
}

requestIdCallback(workLoop)

function performUnitOfWork(nextUnitOfWork) {
    // search for a fiber or create one
    if (!fiber.dom){
        fiber.dom = createDOM(fiber)

    }
    //search id the fiber is a child and append the parent
    if (fiber.parent){
        fiber.parent.dom = appendChild(fiber.dom)

    }

    const elements = fiber.props.children
    let index = 0
    let prevSibling = null
    //make sure we can loop until we find a fiber 
    while (index < elements.length){

        const element = elements[index]
    
        const newFiber = {
            type: element.type, 
            props: element.props,
            parent: fiber,
            dom: null
        }   
    }

    //if there's nothing we create a child
    if (index === 0) {
        fiber.child = newFiber
    } else {
        //if there's a fiber in the fiber tree we create a sibling
        prevSibling.sibling = newFiber
    }
    //as the sibling gets added the index increases
    prevSibling = newFiber
    index++
    
    //if a fiber has a child return the child
    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    //after wee have gathered the child, we create a sibling for that child
    while (nextFiber) {
        //if we already have a sibling we return it 
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        //we also return the previous parent of these fibers siblings
        nextFiber = nextFiber.parent
    }

}
