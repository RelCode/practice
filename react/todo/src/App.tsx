import React from "react";
import { ToDoContextProvider } from "./utils/TodoContext";
import "./App.css";
import Header from "./components/Header";
import AddTodo from "./components/AddTodo";

function App() {
	return (
		<ToDoContextProvider>
			<div className="App">
				<Header />
				<AddTodo />
			</div>
		</ToDoContextProvider>
	);
}

export default App;
