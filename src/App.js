import React, { Component } from 'react';
import './App.css';

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

const FilterLink = ({store, filter, children}) => {
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
                this.props.store.dispatch({
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
                            this.props.store.dispatch({
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
                Show: {' '} <FilterLink filter="SHOW_ALL" store={this.props.store}>All</FilterLink>
                {' '} <FilterLink filter="SHOW_ACTIVE" store={this.props.store}>Active</FilterLink>
                {' '} <FilterLink filter="SHOW_ALL" store={this.props.store}>Completed</FilterLink>
            </p>
        </div>
        );
    }
}

export default App;
