import React, { useState } from 'react';
import { ITodo } from '../utils/ITodo';
import { useTodos } from '../utils/TodoContext';

const ToDoInputForm = () => {
    const [id, setId] = useState(null);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState("low");

    const { addTodo, editTodo, todo } = useTodos();

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if(id === null){
            addTodo(title, desc, priority, false);
        }else {
            editTodo(id, title, desc, priority);
        }
        clearFields();
    }

    if(todo && todo.id !== id){
        setId(todo.id);
        setTitle(todo.title);
        setDesc(todo.desc);
        setPriority(todo.priority);
    }

    const clearFields = () => {
        setId(null);
        setTitle("");
        setDesc("");
        setPriority("low");
    }


    return (
		<div className="col-xs-12 col-md-4 text-center">
			<form>
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						type="text"
						className="form-control"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="desc">Description</label>
					<textarea
						className="form-control"
						id="desc"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="priority">Priority</label>
					<select
						className="form-control"
						id="priority"
						value={priority}
						onChange={(e) => setPriority(e.target.value)}
					>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</div>
				<button type="submit" className="btn btn-primary mt-2" onClick={submitForm}>
					{ id === null ? "Add Item" : "Update Item" }
				</button>
			</form>
		</div>
	);
}

export default ToDoInputForm;