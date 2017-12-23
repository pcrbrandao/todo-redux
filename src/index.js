import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';

// import { runAllTests, todoApp } from './todos.js';
// runAllTests();

import { todoApp } from './todos.js';
import { createStore } from 'redux';

const store = createStore(todoApp);
let nextTodoId = 0;

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(
                t => t.completed
            );
        case 'SHOW_ACTIVE':
            return todos.filter(
                t => !t.completed
            );
        default:
            return todos;
    }
}

const FilterLink = ({filter, children}) => {
    return (
        <a href="#"
            onClick={e => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter
                });
            }}>
            {children}
        </a>
    );
};

class App extends Component {
    render() {
        const visibleTodos = getVisibleTodos(
            this.props.todos,
            this.props.visibilityFilter
        );
        return (
        <div>
            <input ref={node => {
                this.input = node;
            }} />
            <button onClick={() => {
                store.dispatch({
                    type: 'ADD_TODO',
                    text: this.input.value,
                    id: nextTodoId++
                });
                this.input.value = '';
            }}>
            Add Todo
            </button>
            <ul>
                {visibleTodos.map(todo => 
                    <li key={todo.id}
                        onClick={() => {
                            store.dispatch({
                                type: 'TOGGLE_TODO',
                                id: todo.id
                            });
                        }}
                        style={{
                            textDecoration: todo.completed ? 
                                'line-through' :
                                'none'
                        }}>
                        {todo.text}
                    </li>
                )}
            </ul>
            <p>
                Show: {' '} <FilterLink filter="SHOW_ALL">All</FilterLink>
                {' '} <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
                {' '} <FilterLink filter="SHOW_ALL">Completed</FilterLink>
            </p>
        </div>
        );
    }
}

const render = () => {
    ReactDOM.render(<App 
        {...store.getState()}/>,
        document.getElementById('root'));
};

store.subscribe(render);

render();
registerServiceWorker();
