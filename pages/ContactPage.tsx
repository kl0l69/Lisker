import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, GitHubIcon, FacebookIcon, TelegramIcon, WhatsAppIcon, SnakeLogoIcon, PaletteIcon, SparklesIcon } from '../components/Icons';

const ContactPage: React.FC = () => {
    const { themeMode, toggleThemeMode, cycleThemeColor, cycleVisualStyle } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your message! You can now send the email.');
        const subject = encodeURIComponent(`Message from ${name} via Lisker`);
        const body = encodeURIComponent(message + `\n\nFrom: ${name} (${email})`);
        window.location.href = `mailto:ayrn194@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
             <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 header-background-scrolled">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <NavLink to="/" className="flex items-center space-x-2">
                          <SnakeLogoIcon className="h-8 w-8 text-primary-600 drop-shadow-glow-sm" />
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white neon-heading">Lisker</h1>
                        </NavLink>
                        <nav className="hidden md:flex space-x-6">
                            <NavLink to="/dashboard" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400 neon-text' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}>Dashboard</NavLink>
                            <NavLink to="/contact" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400 neon-text' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}>Contact</NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2">
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
                            {themeMode === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                        </button>
                    </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl neon-heading">Contact the Developer</h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                           Hi, I’m Mohamed (Arsinek) — developer and designer behind Lisker. I love building smart and clean digital tools. Feel free to reach out!
                        </p>
                    </div>

                    <div className="mt-12 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden lg:grid lg:grid-cols-2 lg:gap-px surface-background">
                        <div className="px-6 py-10 sm:px-10 lg:py-16">
                            <h2 className="text-2xl font-semibold neon-heading">Get in touch</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Use the form below or connect with me on social media.</p>
                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                <div>
                                    <label htmlFor="name" className="sr-only">Full name</label>
                                    <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} required className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="Full name" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="Email address" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="sr-only">Message</label>
                                    <textarea id="message" name="message" rows={4} value={message} onChange={e => setMessage(e.target.value)} required className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="Message"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-10 lg:p-12">
                             <h3 className="text-lg font-medium text-gray-900 dark:text-white neon-heading">Connect with me</h3>
                            <div className="mt-6 flex space-x-4">
                                <a href="https://github.com/kl0l69" target="_blank" rel="noopener noreferrer" className="group p-3 rounded-full bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
                                    <span className="sr-only">GitHub</span>
                                    <GitHubIcon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                                </a>
                                <a href="https://facebook.com/nq703" target="_blank" rel="noopener noreferrer" className="group p-3 rounded-full bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
                                    <span className="sr-only">Facebook</span>
                                    <FacebookIcon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110" />
                                </a>
                                <a href="https://t.me/nq703" target="_blank" rel="noopener noreferrer" className="group p-3 rounded-full bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
                                    <span className="sr-only">Telegram</span>
                                    <TelegramIcon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-sky-500 transition-all duration-300 group-hover:scale-110" />
                                </a>
                                <a href="https://wa.me/201141345223" target="_blank" rel="noopener noreferrer" className="group p-3 rounded-full bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
                                    <span className="sr-only">WhatsApp</span>
                                    <WhatsAppIcon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-green-500 transition-all duration-300 group-hover:scale-110" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContactPage;