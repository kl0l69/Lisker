import React, { useState } from 'react';
import { Link as LinkType } from '../types';
import { LinkIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface LinkCardProps {
  link: LinkType;
  onEdit: (link: LinkType) => void;
  onDelete: (linkId: string) => void;
  index: number;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit, onDelete, index }) => {
  const { visualStyle } = useTheme();
  const [faviconError, setFaviconError] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewImageError, setPreviewImageError] = useState(false);

  const getFaviconUrl = (url: string, size = 32) => {
    try {
      const urlObject = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=${size}`;
    } catch (error) {
      console.error("Invalid URL for favicon:", url);
      return '';
    }
  };

  const faviconUrl = getFaviconUrl(link.url);
  const largeFaviconUrl = getFaviconUrl(link.url, 128);

  return (
     <div
      className="relative group animate-card-enter"
      style={{ animationDelay: `${index * 70}ms`, opacity: 0 }}
    >
      {visualStyle === 'neon' && <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-rose-500 to-indigo-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500"></div>}
      <div 
        className="relative surface-background rounded-lg p-4 flex flex-col justify-between hover:-translate-y-1 h-full transition-all duration-300 neon-hover-border"
        onMouseEnter={() => setIsPreviewVisible(true)}
        onMouseLeave={() => setIsPreviewVisible(false)}
      >
        <div>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 group/link">
            {faviconError || !faviconUrl ? (
              <div className="w-8 h-8 mt-1 rounded-sm bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-5 h-5 text-gray-400" />
              </div>
            ) : (
              <img 
                src={faviconUrl} 
                alt="favicon" 
                className="w-8 h-8 mt-1 rounded-sm flex-shrink-0"
                onError={() => setFaviconError(true)}
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover/link:text-primary-600 dark:group-hover/link:text-primary-400 transition-colors break-words neon-heading">
                {link.title}
              </h3>
              <p className="text-sm text-primary-500 dark:text-primary-400 truncate group-hover/link:underline neon-text">
                {link.url}
              </p>
            </div>
          </a>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 break-words">
            {link.description}
          </p>
        </div>
        <div className="mt-4">
          {link.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {link.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full dark:bg-primary-900/50 dark:text-primary-200">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700 neon-border">
              <span>{new Date(link.createdAt).toLocaleDateString()}</span>
              <div className="flex space-x-2">
              <button onClick={() => onEdit(link)} className="hover:text-primary-500">Edit</button>
              <button onClick={() => onDelete(link.id)} className="hover:text-red-500">Delete</button>
              </div>
          </div>
        </div>
        
        {isPreviewVisible && (
          <div 
            className="absolute z-10 top-1/2 -translate-y-1/2 left-full ml-4 w-32 h-32 bg-white dark:bg-gray-700 rounded-lg shadow-2xl p-2 flex items-center justify-center pointer-events-none animate-fade-in"
          >
            {previewImageError ? (
              <LinkIcon className="w-16 h-16 text-gray-400" />
            ) : (
              <img 
                src={largeFaviconUrl} 
                alt={`${link.title} preview`} 
                className="max-w-full max-h-full object-contain rounded-md"
                onError={() => setPreviewImageError(true)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkCard;