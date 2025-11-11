import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, SnakeLogoIcon } from '../components/Icons';

const HomePage: React.FC = () => {
  const { themeMode, toggleThemeMode } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <header className="absolute top-0 left-0 right-0 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <SnakeLogoIcon className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold">Lisker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/contact" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Contact
            </Link>
            <button onClick={toggleThemeMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              {themeMode === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
            Lisker
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            Keep your links, everywhere.
          </p>
          <p className="mt-6 max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            A smart, simple, and beautiful bookmark manager to help you organize your digital world. Save, tag, and find your links with ease.
          </p>
          <div className="mt-10">
            <Link 
              to="/dashboard" 
              className="inline-block bg-primary-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
            >
              Start Saving
            </Link>
          </div>
        </div>
      </main>

       <footer className="text-center p-4 text-sm text-gray-500">
          © {new Date().getFullYear()} Lisker. Created by Mohamed (Arsinek).
      </footer>
    </div>
  );
};

export default HomePage;