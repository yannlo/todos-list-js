import { createElement } from "../functions/dom.js";

/**
 * @typedef {object} Todo
 * 
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */
export class TodoList{

    /** @type {Todo[]} */
    #todos

    /** @type {HTMLUListElement} */
    #list

    /**
     * 
     * @param {Todo[]} todos 
     */
    constructor(todos){
        this.#todos = todos
    }

    /**
     * 
     * @param {HTMLElement} parent 
     * 
     * @return {void}
     */
    appendTo(parent){
        parent.append(cloneTemplate("todolist-layout"));

        const list = parent.querySelector('ul.list-group');
        for (const todo of this.#todos) {
            const task = new TodoListItem(todo);
            list.append(task.elt);
        }

        this.#list = list;

        parent.querySelector('form').addEventListener('submit', (e) =>{this.#onSubmit(e)})

        parent.querySelectorAll('.btn-group button').forEach(btn => {
            btn.addEventListener('click',(e) => this.#onToggleFilter(e));
        })

        list.addEventListener('delete',({detail: todo}) => {
            this.#todos = this.#todos.filter(t => t!== todo)
            this.#onUpdate();
        })

        list.addEventListener('toggle',({detail: todo}) => {
            todo.completed = !todo.completed
        })
    }

    /**
     * 
     * @param {SubmitEvent} e 
     * @returns 
     */
    #onSubmit = (e) =>{
        e.preventDefault();
        const form = e.currentTarget;
        const title =  (new FormData(form)).get("title")
            .toString()
            .trim();
        if(title ===''){
            return;
        }

        const todo={
            id: Date.now(),
            title,
            completed: false
        };

        const task = new TodoListItem(todo);

        this.#list.prepend(task.elt);
        this.#todos.push(todo);

        this.#onUpdate();
        form.reset();
    }
    
    #onUpdate = () => {
        localStorage.setItem('todos', JSON.stringify(this.#todos));
    }

    /**
     * 
     * @param {MouseEvent} e 
     * @returns 
     */
    #onToggleFilter = (e) => {
        e.preventDefault();
        const filter = e.currentTarget.getAttribute('data-filter')
        e.currentTarget.parentElement.querySelector('.active').classList.remove('active');
        e.currentTarget.classList.add("active");
        if(filter ==='todo'){
            this.#list.classList.add('only-todo');
            this.#list.classList.remove('only-done');
        }else if(filter ==='done'){
            this.#list.classList.remove('only-todo');
            this.#list.classList.add('only-done');
        }else{
            this.#list.classList.remove('only-todo');
            this.#list.classList.remove('only-done');
        }
    }
}

/**
 * 
 * @param {string} id 
 * @return {DocumentFragment}
 */
const cloneTemplate = (id) => {
    return document
        .getElementById(id)
        .content.cloneNode(true)
}


class TodoListItem{


    /** @type {HTMLElement} */
    #elt;

    /** @type {Todo} */
    #todo;

    /**
     * 
     * @param {Todo} todo 
     */
    constructor(todo){
        this.#todo = todo;
        const id = `todo-${todo.id}`
        const li = cloneTemplate("todolist-item").firstElementChild;
        this.#elt = li;


        const input = li.querySelector('input')
        input.setAttribute('id', id)
        todo.completed && input.setAttribute('checked', "")


        const label = li.querySelector('label')
        label.setAttribute('for', id)
        label.innerText = todo.title;
        
        const button = li.querySelector('button')

        button.addEventListener('click', (e) => this.#remove(e))

        this.toggle(input, li);
        input.addEventListener("change",(e) => this.toggle(e.currentTarget))

    }

    /**
     * 
     * @param {MouseEvent} e
     * @returns {void} 
     */
    #remove = (e) => {
        e.preventDefault()
        const event = new CustomEvent('delete',{
            detail: this.#todo,
            bubbles :true,
            cancelable:true
        })
    
        this.#elt.dispatchEvent(event)
        this.#elt.remove()
    }

    /**
     * 
     * @param {HTMLInputElement} checkbox
     * @param {HTMLLIElement} task
     * @return {void}
     */
    toggle(checkbox, task = null){
        task ||= this.#elt;

        const event = new CustomEvent('toggle',{
            detail: this.#todo,
            bubbles :true
        })
    
        this.#elt.dispatchEvent(event)

        if(checkbox.checked){
            task.classList.add("is-completed");
            return;
        }
        task.classList.remove("is-completed");
    }

    /**
     * 
     * @return {HTMLElement} 
     */
    get elt(){
        return this.#elt;
    }
}