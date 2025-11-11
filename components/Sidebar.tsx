import React from 'react';
import { Folder } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { FolderIcon, TagIcon, PlusIcon, EditIcon, TrashIcon, GridIcon, StatsIcon, MagicWandIcon, DownloadIcon, UploadIcon } from './Icons';

interface SidebarProps {
  folders: Folder[];
  tags: string[];
  selectedFolder: string | null;
  setSelectedFolder: (id: string | null) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  onAddFolder: () => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  currentView: 'grid' | 'stats';
  setCurrentView: (view: 'grid' | 'stats') => void;
  onAiOrganize: () => void;
  onExport: () => void;
  onImport: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ folders, tags, selectedFolder, setSelectedFolder, selectedTag, setSelectedTag, onAddFolder, onEditFolder, onDeleteFolder, currentView, setCurrentView, onAiOrganize, onExport, onImport }) => {

  const baseItemClass = "flex items-center w-full text-left p-2 rounded-md text-sm font-medium transition-colors group";
  const activeItemClass = "bg-primary-100 text-primary-700 dark:bg-gray-700 dark:text-white";
  const inactiveItemClass = "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <aside className="space-y-6">
      <div className="surface-background rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 neon-heading">Views</h3>
        <div className="flex space-x-2">
            <button onClick={() => setCurrentView('grid')} className={`${baseItemClass} ${currentView === 'grid' ? activeItemClass : inactiveItemClass} flex-1 justify-center`}>
                <GridIcon className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:scale-110" /> Grid
            </button>
             <button onClick={() => setCurrentView('stats')} className={`${baseItemClass} ${currentView === 'stats' ? activeItemClass : inactiveItemClass} flex-1 justify-center`}>
                <StatsIcon className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:scale-110" /> Stats
            </button>
        </div>
      </div>

       <div className="surface-background rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 neon-heading">Tools</h3>
        <ul className="space-y-1">
            <li>
                <button onClick={onAiOrganize} className={`${baseItemClass} ${inactiveItemClass}`}>
                    <MagicWandIcon className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:rotate-12" /> AI Organizer
                </button>
            </li>
             <li>
                <button onClick={onExport} className={`${baseItemClass} ${inactiveItemClass}`}>
                    <DownloadIcon className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:translate-y-0.5" /> Export Data
                </button>
            </li>
             <li>
                <button onClick={onImport} className={`${baseItemClass} ${inactiveItemClass}`}>
                    <UploadIcon className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:-translate-y-0.5" /> Import Data
                </button>
            </li>
        </ul>
      </div>
    
      <div className="surface-background rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 neon-heading">Folders</h3>
          <button onClick={onAddFolder} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 group">
            <PlusIcon className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </div>
        <ul className="space-y-1">
          <li>
            <button onClick={() => setSelectedFolder(null)} className={`${baseItemClass} ${selectedFolder === null ? activeItemClass : inactiveItemClass}`}>
                All Links
            </button>
          </li>
          {folders.map(folder => (
            <li key={folder.id} className="group/item relative">
                <button onClick={() => setSelectedFolder(folder.id)} className={`${baseItemClass} ${selectedFolder === folder.id ? activeItemClass : inactiveItemClass}`}>
                    <FolderIcon className="h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="flex-1 truncate">{folder.name}</span>
                </button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover/item:flex items-center bg-gray-100 dark:bg-gray-700 rounded-md">
                    <button onClick={() => onEditFolder(folder)} className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"><EditIcon className="h-4 w-4 transition-transform hover:scale-125"/></button>
                    <button onClick={() => onDeleteFolder(folder)} className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"><TrashIcon className="h-4 w-4 transition-transform hover:scale-125"/></button>
                </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface-background rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 neon-heading">Tags</h3>
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            <li>
                <button onClick={() => setSelectedTag(null)} className={`${baseItemClass} ${selectedTag === null ? activeItemClass : inactiveItemClass}`}>
                    All Tags
                </button>
            </li>
            {tags.map(tag => (
                <li key={tag}>
                    <button onClick={() => setSelectedTag(tag)} className={`${baseItemClass} ${selectedTag === tag ? activeItemClass : inactiveItemClass}`}>
                        <TagIcon className="h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span className="flex-1 truncate">{tag}</span>
                    </button>
                </li>
            ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;