import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar, Home, Tokenization, Embeddings, AttentionView, FeedForwardNetwork } from './components';

const App: React.FC = () => {
	return (
		<div style={{ width: "100%", height: "100%" }}>
			<Router>
				<NavBar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/tokenization" element={<Tokenization />} />
					<Route path="/embeddings" element={<Embeddings />} />
					<Route path="/attention" element={<AttentionView />} />
					<Route path="feedforward" element={<FeedForwardNetwork />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;