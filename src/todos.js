import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { createStore, combineReducers } from 'redux';

const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    };
    const stateAfter = [{
        id: 0,
        text: 'Learn Redux',
        completed: false
    }];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: false
        }
    ];
    const action = {
        type: 'TOGGLE_TODO',
        id: 1
    };
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: true
        }
    ];
    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

export const getVisibleTodos = (
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

export const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

const visibilityFilter = ( state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

export const todoApp = combineReducers({
    todos,
    visibilityFilter
});

function testLog() {
    const store = createStore(todoApp);

    console.log('Inicial state:');
    console.log(store.getState());
    console.log('--------------');

    console.log('Dispatching ADD_TODO');
    store.dispatch({
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    });
    logCurrentState(store);

    console.log('Dispatching ADD_TODO');
    store.dispatch({
        type:'ADD_TODO',
        id: 1,
        text: 'Go shopping'
    });
    logCurrentState(store);

    console.log('Dispatching TOGGLE_TODO.');
    store.dispatch({
        type: 'TOGGLE_TODO',
        id: 0
    });
    logCurrentState(store);

    console.log('Dispatching SET_VISIBILITY_FILTER');
    store.dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: 'SHOW_COMPLETED'
    });
    logCurrentState(store);
}

function logCurrentState(store) {
    console.log('Current state:');
    console.log(store.getState());
    console.log('--------------');
}

export function runAllTests() {
    testAddTodo();
    testToggleTodo();
    testLog();
    console.log('Todos os tests passaram.');
}