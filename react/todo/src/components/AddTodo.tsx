import React, { useState } from 'react';
import { ITodo } from '../utils/ITodo';
import { useTodos } from '../utils/TodoContext';

const AddTodo = () => {
    const [id, setId] = useState(null);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState("low");

    const { addTodo } = useTodos();

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();

        addTodo(title, desc, priority, false);
    }


    return (
        <div className="w-100 row p-3">
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
                    <button type="submit" className="btn btn-primary mt-2" onClick={submitForm}>Add Todo</button>
                </form>
            </div>
            <div className="col-xs-12 col-md-8">
                <h2>Todo List</h2>
            </div>
        </div>
    )
}

export default AddTodo;