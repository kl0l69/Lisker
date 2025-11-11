
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import { ThemeProvider } from './contexts/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  return (
    <ThemeProvider>
      <AnimatedBackground />
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;