import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LinkCard from '../components/LinkCard';
import AddEditLinkModal from '../components/AddEditLinkModal';
import ConfirmationModal from '../components/ConfirmationModal';
import AddEditFolderModal from '../components/AddEditFolderModal';
import DeleteFolderModal from '../components/DeleteFolderModal';
import AIOrganizerModal from '../components/AIOrganizerModal';
import EmptyState from '../components/EmptyState';
import Stats from '../components/Stats';
import { useLinkNestStore } from '../hooks/useLinkNestStore';
import { Link, Folder } from '../types';
import { exportDataToJson, importDataFromJson } from '../utils/fileUtils';

type View = 'grid' | 'stats';
type SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'url-asc' | 'url-desc';


/**
 * Calculates the Levenshtein distance between two strings.
 * This is used for fuzzy search to detect typos.
 */
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,       // deletion
        matrix[j - 1][i] + 1,       // insertion
        matrix[j - 1][i - 1] + cost, // substitution
      );
    }
  }

  return matrix[b.length][a.length];
};


const DashboardPage: React.FC = () => {
    const { links, folders, deleteLink, deleteFolder, replaceAllData } = useLinkNestStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('date-desc');


    const [isAddEditLinkModalOpen, setAddEditLinkModalOpen] = useState(false);
    const [linkToEdit, setLinkToEdit] = useState<Link | null>(null);
    
    const [isDeleteLinkModalOpen, setDeleteLinkModalOpen] = useState(false);
    const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
    
    const [isAddEditFolderModalOpen, setAddEditFolderModalOpen] = useState(false);
    const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);

    const [isDeleteFolderModalOpen, setDeleteFolderModalOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

    const [isAiOrganizerOpen, setAiOrganizerOpen] = useState(false);
    
    const [isImportConfirmOpen, setImportConfirmOpen] = useState(false);
    const [dataToImport, setDataToImport] = useState<{links: Link[], folders: Folder[]} | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [currentView, setCurrentView] = useState<View>('grid');

    useEffect(() => {
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery && sortOption !== 'relevance') {
            setSortOption('relevance');
        } else if (!trimmedQuery && sortOption === 'relevance') {
            setSortOption('date-desc');
        }
    }, [searchQuery]);


    const filteredLinks = useMemo(() => {
        // 1. Initial filtering by folder and tag
        let processedLinks: (Link & { score?: number })[] = links
            .filter(link => selectedFolder === null || link.folderId === selectedFolder)
            .filter(link => selectedTag === null || link.tags.includes(selectedTag));
    
        // 2. If search query, score links and filter
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            const searchLower = trimmedQuery.toLowerCase();
            const queryTokens = searchLower.split(' ').filter(t => t.length > 2);
    
            processedLinks = processedLinks.map(link => {
                let score = 0;
                const titleLower = link.title.toLowerCase();
                const descriptionLower = link.description.toLowerCase();
                const urlLower = link.url.toLowerCase();
                const tagsLower = link.tags.map(t => t.toLowerCase());
        
                if (titleLower.includes(searchLower)) score += 50;
                if (tagsLower.some(tag => tag.includes(searchLower))) score += 40;
                if (descriptionLower.includes(searchLower)) score += 15;
                if (urlLower.includes(searchLower)) score += 5;
        
                const contentForTokenCheck = `${titleLower} ${tagsLower.join(' ')}`;
                for (const token of queryTokens) {
                    if (contentForTokenCheck.includes(token)) score += 10;
                }
        
                if (queryTokens.length > 0) {
                    const titleTokens = [...new Set<string>(titleLower.split(' ').filter(t => t.length > 2))];
                    const uniqueTags = [...new Set<string>(tagsLower.filter(t => t.length > 2))];
        
                    for (const qToken of queryTokens) {
                        const threshold = qToken.length > 6 ? 2 : 1;
        
                        for (const tToken of titleTokens) {
                            if (Math.abs(qToken.length - tToken.length) < 3) {
                                if (levenshteinDistance(qToken, tToken) <= threshold) {
                                    score += 15;
                                }
                            }
                        }
                        for (const tag of uniqueTags) {
                            if (Math.abs(qToken.length - tag.length) < 3) {
                                if (levenshteinDistance(qToken, tag) <= threshold) {
                                    score += 12;
                                }
                            }
                        }
                    }
                }
                return { ...link, score };
            }).filter(item => item.score > 0);
        }
    
        // 3. Apply sorting
        return processedLinks.sort((a, b) => {
            switch (sortOption) {
                case 'relevance':
                    return (b.score || 0) - (a.score || 0);
                case 'date-asc':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'url-asc':
                    return a.url.localeCompare(b.url);
                case 'url-desc':
                    return b.url.localeCompare(a.url);
                case 'date-desc':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });
    
    }, [links, searchQuery, selectedFolder, selectedTag, sortOption]);

    const handleAddLink = () => {
        setLinkToEdit(null);
        setAddEditLinkModalOpen(true);
    };

    const handleEditLink = (link: Link) => {
        setLinkToEdit(link);
        setAddEditLinkModalOpen(true);
    };
    
    const handleDeleteLink = (linkId: string) => {
        setLinkToDelete(linkId);
        setDeleteLinkModalOpen(true);
    };

    const confirmDeleteLink = () => {
        if (linkToDelete) {
            deleteLink(linkToDelete);
            setLinkToDelete(null);
        }
    };
    
    const handleAddFolder = () => {
        setFolderToEdit(null);
        setAddEditFolderModalOpen(true);
    };
    
    const handleEditFolder = (folder: Folder) => {
        setFolderToEdit(folder);
        setAddEditFolderModalOpen(true);
    }
    
    const handleDeleteFolder = (folder: Folder) => {
        setFolderToDelete(folder);
        setDeleteFolderModalOpen(true);
    }

    const confirmDeleteFolder = () => {
        if (folderToDelete) {
            deleteFolder(folderToDelete.id);
            if(selectedFolder === folderToDelete.id) {
                setSelectedFolder(null);
            }
        }
    }

    const handleExport = () => {
        exportDataToJson(links, folders);
    }

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const data = await importDataFromJson(file);
                setDataToImport(data);
                setImportConfirmOpen(true);
            } catch (error) {
                alert(error instanceof Error ? error.message : 'An unknown error occurred during import.');
            }
            event.target.value = '';
        }
    };

    const confirmImport = () => {
        if (dataToImport) {
            replaceAllData(dataToImport);
            setDataToImport(null);
        }
    }
    
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        links.forEach(link => link.tags.forEach(tag => tagSet.add(tag)));
        return Array.from(tagSet).sort();
    }, [links]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header onAddLink={handleAddLink} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <Sidebar
                        folders={folders}
                        tags={allTags}
                        selectedFolder={selectedFolder}
                        setSelectedFolder={setSelectedFolder}
                        selectedTag={selectedTag}
                        setSelectedTag={setSelectedTag}
                        onAddFolder={handleAddFolder}
                        onEditFolder={handleEditFolder}
                        onDeleteFolder={handleDeleteFolder}
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        onAiOrganize={() => setAiOrganizerOpen(true)}
                        onExport={handleExport}
                        onImport={handleImportClick}
                    />
                    <main className="lg:col-span-3">
                        {currentView === 'grid' && (
                           <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                    {selectedFolder ? folders.find(f => f.id === selectedFolder)?.name : 'All Links'}
                                    {selectedTag && <span className="text-base font-normal text-gray-500 dark:text-gray-400"> / #{selectedTag}</span>}
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <label htmlFor="sort-select" className="text-sm font-medium text-gray-600 dark:text-gray-300">Sort by:</label>
                                    <select
                                        id="sort-select"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-2 pr-8 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    >
                                        {searchQuery.trim() && <option value="relevance">Relevance</option>}
                                        <option value="date-desc">Date (Newest)</option>
                                        <option value="date-asc">Date (Oldest)</option>
                                        <option value="title-asc">Title (A-Z)</option>
                                        <option value="title-desc">Title (Z-A)</option>
                                        <option value="url-asc">URL (A-Z)</option>
                                        <option value="url-desc">URL (Z-A)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {currentView === 'grid' ? (
                             <>
                                {filteredLinks.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filteredLinks.map((link, index) => (
                                            <LinkCard key={link.id} link={link} onEdit={handleEditLink} onDelete={handleDeleteLink} index={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState onAddLink={handleAddLink} />
                                )}
                            </>
                        ) : (
                           <Stats links={links} />
                        )}
                    </main>
                </div>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json"/>

            <AddEditLinkModal
                isOpen={isAddEditLinkModalOpen}
                onClose={() => setAddEditLinkModalOpen(false)}
                linkToEdit={linkToEdit}
            />
            
            <ConfirmationModal
                isOpen={isDeleteLinkModalOpen}
                onClose={() => setDeleteLinkModalOpen(false)}
                onConfirm={confirmDeleteLink}
                title="Delete Link"
                message="Are you sure you want to delete this link? This action cannot be undone."
                confirmText="Delete"
                confirmButtonVariant='danger'
            />
             <ConfirmationModal
                isOpen={isImportConfirmOpen}
                onClose={() => setImportConfirmOpen(false)}
                onConfirm={confirmImport}
                title="Confirm Import"
                message={<>Are you sure you want to import this file? <br/><strong>This will overwrite all current links and folders.</strong></>}
                confirmText="Import"
                confirmButtonVariant="primary"
            />
            
            <AddEditFolderModal 
                isOpen={isAddEditFolderModalOpen}
                onClose={() => setAddEditFolderModalOpen(false)}
                folderToEdit={folderToEdit}
            />
            
            <DeleteFolderModal 
                isOpen={isDeleteFolderModalOpen}
                onClose={() => setDeleteFolderModalOpen(false)}
                onConfirm={confirmDeleteFolder}
                folderName={folderToDelete?.name ?? ''}
            />

            <AIOrganizerModal
                isOpen={isAiOrganizerOpen}
                onClose={() => setAiOrganizerOpen(false)}
            />
        </div>
    );
};

export default DashboardPage;