/**
 * 
 * @param {string} tagName 
 * @param {object} attributes 
 * 
 * @return {HTMLElement}
 */
export function createElement(tagName, attributes ={}){
    const elt = document.createElement(tagName);
    for (const [key, value] of Object.entries(attributes)) {
        if(value !== null){
            elt.setAttribute(key, value);
        }
    }
    return elt;
}