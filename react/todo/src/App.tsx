import React from "react";
import { ToDoContextProvider } from "./utils/TodoContext";
import "./App.css";
import Header from "./components/Header";
import ToDoInputForm from "./components/TodoInputForm";
import ToDoViewingList from "./components/ToDoViewingList";

function App() {
	return (
		<ToDoContextProvider>
			<div className="App">
				<Header />
				<div className="w-100 row p-3">
					<ToDoInputForm />
					<ToDoViewingList />
				</div>
			</div>
		</ToDoContextProvider>
	);
}

export default App;
