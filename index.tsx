const Didact = {createElement,}

interface Element {
    type: string
    props: []
   
}


function createElement(type: Element["type"], props:Element["props"], children: []) {
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

function createTextElement(text: []) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        }
    }
}
