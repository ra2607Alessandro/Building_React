const { type } = require("os")

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


const isEvent = key => key.startsWith("on")
const isProperty = key => key !== "children" && !isEvent(key)
const isNew = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps) {
    Object.keys(prevProps)
    .filter(isEvent)
    .filter(
        key => 
            !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
        const eventType = name
        .toLowerCase()
        .substring(2)

        dom.removeChildListener(
            eventType, 
            prevProps[name]
        )
    })
}
function commitRoot() {
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null

}

function commitWork(fiber) {
    

    if (!fiber) {
        return
    }
    let domParentFiber = fiber.parent
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent
    }
    const domParent = fiber.parent.dom 
    if (
        fiber.effectTag === "PLACEMENT" && fiber.dom != null
    )
    { 
    domParent.appendChild(fiber.dom)}
    else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
        updateDom(
            fiber.dom,
            fiber.alternate.props,
            fiber.props
        )
    }
    else if (fiber.effectTag === "DELETION") {
        commitDeletion(fiber, domParent)
    }
    commitWork(fiber.child)
    commitWork(fiber.sibling)

}

function commitDeletion(fiber, domParent){
    if(fiber.dom){
        deletions.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child, domParent)
    }
}


function render(element, container ) {
    const wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate : currentRoot
    }
    
    deletions = []
    nextUnitOfWork= wipRoot

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
let wipRoot = null 
let currentRoot = null
let deletions = null

function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1

    }
     
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
    requestIdCallback(workLoop)
}

requestIdCallback(workLoop)

function performUnitOfWork(fiber) {
    const isFunctionComponent = 
    fiber.type instanceof Function

    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    }
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

function updateFunctionComponent(fiber) {
    const children = [fiber.type (fiber.props)]
    reconcileChildren(fiber, children)

}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }
    reconcileChildren(fiber, fiber.props, children)
}

function reconcileChildren(wipFiber, elements) {
    let index = 0
    let wipFiber =
    wipFiber && wipFiber.alternate.child
    let prevSibling = null

    while (
        index < elements.length || oldFiber != null
    ) {
        const element = elements[index]
        let newFiber = null
    }

    //We start comparing the old fiber to the element 

    const Sametype =
       oldFiber &&
       element &&
       element.type == oldFiber.type

       if (Sametype) {
        newFiber = {
          type : oldFiber.type,
          props : element.props,
          dom : oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: "UPDATE"
        }
       }

       if ( element && !Sametype) {
        newFiber = {
            type : element.type,
            props: element.props,
            dom: null,
            parent: wipFiber,
            alternate: null,
            effectTag: "PLACEMENT"
        }
       }
       if (oldFiber && !Sametype) {
        oldFiber.effectTag = "DELETE"
        deletion.push(oldFiber)
       }
}
