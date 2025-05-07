import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './styles/globals.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));

const LoadingSpinner: React.FC = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add more routes as you develop more pages */}
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default App;