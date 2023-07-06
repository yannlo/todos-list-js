import { TodoList } from "./components/TodoList.js";
import { fetchJSON } from "./functions/api.js";
import { createElement } from "./functions/dom.js";

const container = document.querySelector("#todolist");

try {
    // const todos = await fetchJSON('https://jsonplaceholder.typicode.com/todos?_limit=5');
    const todosInStorage = localStorage.getItem('todos')
    const todos  = todosInStorage !== null ? JSON.parse(todosInStorage) : []
    const list = new TodoList(todos);
    list.appendTo(container);
} catch (e) {
    const alertElt = createElement('div',{
        class: "alert alert-danger m-2",
        role: "alert"
    });
    alertElt.innerText= 'Impossible de charger les elements.'   
    container.prepend(alertElt);
    console.error(e);
}