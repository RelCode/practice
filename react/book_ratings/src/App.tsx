import React from "react";
import { Header, Ratings } from "./components";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
	return (
		<div className="app-container">
			<Header />
			<Ratings />
		</div>
	);
}

export default App;
