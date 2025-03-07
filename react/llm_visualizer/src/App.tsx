import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar, Home, Tokenization, Embeddings } from './components';

const App: React.FC = () => {
	return (
		<div style={{ width: "100%", height: "100%" }}>
			<Router>
				<NavBar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/tokenization" element={<Tokenization />} />
					<Route path="/embeddings" element={<Embeddings />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;