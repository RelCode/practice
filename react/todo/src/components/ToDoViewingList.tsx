import React, { useState } from "react";
import { useTodos } from "../utils/TodoContext";
import "../css/ToDoViewingList.css";
import { ITodo } from "../utils/ITodo";

const ToDoViewingList = () => {
    const { todos, selectTodo } = useTodos();

    return (
        <div className="col-xs-12 col-md-8 d-flex flex-column">
            <h1>List of Items</h1>
            { todos.length === 0 ? (
                <h4>No Items Found on the List</h4>
            ) : todos.map((todo: ITodo, i: number) => {
                return (
                    <div className="itemDiv" onClick={() => selectTodo(todo.id)} key={i}>
                        <p><strong className="fs-4">{todo.title}</strong> : <i className="fs-5">{todo.desc}</i></p>
                        <span>{todo.completed ? "Yes" : "No"}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default ToDoViewingList;