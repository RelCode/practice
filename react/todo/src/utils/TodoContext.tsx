import React, { createContext, useContext, useState } from 'react';
import { ITodo } from './ITodo';

interface ITodoContext {
    todo: ITodo;
    todos: ITodo[];
    addTodo: (title: string, desc: string, priority: string) => void;
    editTodo: (id: number, title: string, desc: string, priority: string) => void;
    selectTodo: (id: number) => void;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

const ToDoContext = createContext<ITodoContext|undefined>(undefined);

const ToDoContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [todo, setTodo] = useState<ITodo|null>(null);

    const addTodo = (title: string, desc: string, priority: string, completed: boolean) => {
        let id = Number(new Date().getTime());
        let newTodos = [...todos, {id, title, desc, priority, completed}];
        setTodos(newTodos);
    }

    const editTodo = (id: number, title: string, desc: string, priority: string) => {
        let index = todos.findIndex((todo) => todo.id === id);
        console.log("Index: ", index);
        todos[index].title = title;
        todos[index].desc = desc;
        todos[index].priority = priority;
        setTodos(todos);
    }

    const selectTodo = (id: number) => {
        let index = todos.findIndex((todo) => todo.id === id);
        setTodo(todos[index]);
    }

    const toggleTodo = (id: number) => {
        let index = todos.findIndex((todo) => todo.id === id);
        if(index !== -1) {
            let newTodos = [...todos];
            newTodos[index].completed = !newTodos[index].completed;
            setTodos(newTodos);
        }
    }

    const deleteTodo = (id: number) => {
        let newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);
    }

    return (
        <ToDoContext.Provider value={{ todo, todos, addTodo, selectTodo, editTodo, toggleTodo, deleteTodo }}>
            { children }
        </ToDoContext.Provider>
    )
}

const useTodos = () => {
    const context = useContext(ToDoContext);

    if(context === undefined){
        throw new Error("useTodos must be used within a ToDoContextProvider");
    }

    return context;
}


export { ToDoContextProvider, useTodos };