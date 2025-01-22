import React, { createContext, useContext, useState } from 'react';
import { ITodo } from './ITodo';

interface ITodoContext {
    todos: ITodo[];
    addTodo: (title: string, desc: string, priority: string) => void;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

const ToDoContext = createContext<ITodoContext|undefined>(undefined);

const ToDoContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [todos, setTodos] = useState<ITodo[]>([]);

    const addTodo = (title: string, desc: string, priority: string, completed: boolean) => {
        let newID = Number(new Date().getTime());
        let newTodos = [...todos, {newID, title, desc, priority, completed}];
        setTodos(newTodos);
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
        <ToDoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
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