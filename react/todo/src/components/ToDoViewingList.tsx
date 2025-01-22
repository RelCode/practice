import React from "react";
import { useTodos } from "../utils/TodoContext";
import "../css/ToDoViewingList.css";
import { ITodo, Priority } from "../utils/ToDo";

const ToDoViewingList = () => {
    const { todos, selectTodo, toggleTodo } = useTodos();

    const getFontColor = (priority: string) => {
        if(priority === Priority.LOW){
            return "text-success";
        }else if(priority === Priority.MEDIUM){
            return "text-warning";
        }
        return "text-danger";   
    }

    return (
        <div className="col-xs-12 col-md-8 d-flex flex-column">
            <h1>List of Items</h1>
            { todos.length === 0 ? (
                <h4>No Items Found on the List</h4>
            ) : todos.map((todo: ITodo, i: number) => {
                return (
                    <div className="itemDiv" key={i}>
                        <p><strong className={getFontColor(todo.priority) + " fs-4"}>{todo.title}</strong> : <i className="fs-5">{todo.desc}</i></p>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check p-3">
                                <input className="form-check-input" type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
                                <label className="form-check-label">Completed</label>
                            </div>
                            <button className="btn btn-warning" onClick={() => selectTodo(todo.id)}>Edit</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ToDoViewingList;