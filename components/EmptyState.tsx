import React from 'react';
import { PlusIcon } from './Icons';

interface EmptyStateProps {
    onAddLink: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddLink }) => {
    return (
        <div className="text-center py-20 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg surface-background">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                 <svg className="h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.536a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-800 dark:text-gray-200 neon-heading">No links found</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">Get started by adding your first link.</p>
            <div className="mt-6">
                <button
                    onClick={onAddLink}
                    type="button"
                    className="group inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                    Add New Link
                </button>
            </div>
        </div>
    );
};

export default EmptyState;