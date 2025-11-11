import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, SearchIcon, PlusIcon, SnakeLogoIcon, PaletteIcon, SparklesIcon } from './Icons';

interface HeaderProps {
    onAddLink: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddLink, searchQuery, setSearchQuery }) => {
  const { themeMode, toggleThemeMode, cycleThemeColor, cycleVisualStyle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${scrolled ? 'header-background-scrolled' : 'bg-transparent border-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <NavLink to="/dashboard" className="flex items-center space-x-2">
              <SnakeLogoIcon className="h-8 w-8 text-primary-600 drop-shadow-glow-sm" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white neon-heading">Lisker</h1>
            </NavLink>
             <nav className="hidden md:flex space-x-6">
                 <NavLink to="/dashboard" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400 neon-text' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}>Dashboard</NavLink>
                 <NavLink to="/contact" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400 neon-text' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}>Contact</NavLink>
             </nav>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="search-input"
                type="text"
                placeholder="Search links... (Ctrl+F)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <button
                onClick={cycleVisualStyle}
                className="p-2 rounded-full text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Change visual style"
                title="Change Style"
              >
              <SparklesIcon className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
            </button>
            <button
                onClick={cycleThemeColor}
                className="p-2 rounded-full text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Change theme color"
                title="Change Color"
              >
              <PaletteIcon className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
            </button>
            <button onClick={toggleThemeMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle dark mode" title="Toggle Dark Mode">
              {themeMode === 'light' ? <MoonIcon className="h-6 w-6 transition-transform duration-300 hover:rotate-12" /> : <SunIcon className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />}
            </button>
            <button onClick={onAddLink} className="group flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300">
                <PlusIcon className="h-5 w-5 mr-1 transition-transform duration-300 group-hover:rotate-90"/>
                <span className="hidden sm:inline">Add Link</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;