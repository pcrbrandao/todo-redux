import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { getVisibleTodos, todoApp } from './todos.js';

// runAllTests();
// import { runAllTests, todoApp } from './todos.js';

// const store = createStore(todoApp);
let nextTodoId = 0;

const Link = ({
    active,
    children,
    onClick
}) => {
    if (active) {
        return <span>{children}</span>;
    }

    return (
        <a href="#"
            onClick={e => {
                e.preventDefault();
                onClick();
            }}>
            {children}
        </a>
    );
};

class VisibleTodoList extends Component {
    componentDidMount() {
        const { store } = this.props;
        this.unsubscribe = store.subscribe(() =>
            this.forceUpdate()
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        // const props = this.props;
        const { store } = props;
        const state = store.getState();

        return (
            <TodoList 
                todos={
                    getVisibleTodos(
                        state.todos,
                        state.visibilityFilter
                    )
                }
                onTodoClick={id =>
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    })
                }
            />
        );
    }
}

class FilterLink extends Component {
    componentDidMount() {
        const { store } = this.props;
        this.unsubscribe = store.subscribe(() =>
            this.forceUpdate()
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const { store } = props;
        const state = store.getState();

        return (
            <Link
                active={
                    props.filter ===
                    state.visibilityFilter
                }
                onClick={() =>
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter: props.filter
                    })
                }
            >
                {props.children}
            </Link>
        );
    }
}

const Footer = ({ store }) => (
    <p>
        Show: {' '} 
        <FilterLink 
            filter="SHOW_ALL"
            store={store}
            >All</FilterLink>
        {' '} 
        <FilterLink 
            filter="SHOW_ACTIVE" 
            store={store}
            >Active</FilterLink>
        {' '} 
        <FilterLink 
            filter="SHOW_COMPLETED"
            store={store}
            >Completed</FilterLink>
    </p>
);

const Todo = ({
    onClick,
    completed,
    text
}) => (
    <li 
        onClick={onClick}
        style={{
            textDecoration: completed ? 
                'line-through' :
                'none'
        }}>
        {text}
    </li>
);

const TodoList = ({
    todos,
    onTodoClick
}) => (
    <ul>
        {todos.map(todo =>
            <Todo
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
            />
        )}
    </ul>
);

const AddTodo = ({ store }) => {
    let input;

    return (
        <div>
            <input ref={node => {
                input = node;
            }} />
            <button onClick={() => {
                store.dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text: input.value
                })
                input.value = '';
            }}>
                Add Todo
            </button>
        </div>
    );
};

const TodoApp = ({ store }) => (
    <div>
        <AddTodo store={store} />
        <VisibleTodoList store={store} />
        <Footer store={store} />
    </div>
);

ReactDOM.render(
    <TodoApp store={createStore(todoApp)} />,
    document.getElementById('root')
);

registerServiceWorker();
