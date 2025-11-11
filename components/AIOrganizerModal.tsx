import React, { useState, useEffect, useMemo } from 'react';
import { useLinkNestStore } from '../hooks/useLinkNestStore';
import { Folder, Link } from '../types';
import Modal from './Modal';
import { GoogleGenAI, Type } from "@google/genai";

interface AIOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Suggestion {
    linkId: string;
    suggestedFolderId: string | null;
}

const AIOrganizerModal: React.FC<AIOrganizerModalProps> = ({ isOpen, onClose }) => {
  const { links, folders, updateLink } = useLinkNestStore();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const linksToOrganize = useMemo(() => links.filter(link => !link.folderId), [links, isOpen]);
  
  useEffect(() => {
    if (isOpen && linksToOrganize.length > 0 && folders.length > 0) {
      fetchSuggestions();
    }
  }, [isOpen]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError('');
    setSuggestions([]);

    const linksPayload = linksToOrganize.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        description: link.description,
    }));

    const foldersPayload = folders.map(folder => ({
        id: folder.id,
        name: folder.name,
    }));

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following list of links and suggest an appropriate folder for each from the provided list of folders.
            
            Folders: ${JSON.stringify(foldersPayload)}
            Links: ${JSON.stringify(linksPayload)}
            
            Respond with a JSON array of objects. Each object must have a "linkId" and a "suggestedFolderId". If no folder is a good fit, set "suggestedFolderId" to null.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            linkId: { type: Type.STRING },
                            suggestedFolderId: { type: Type.STRING },
                        },
                         required: ["linkId", "suggestedFolderId"]
                    }
                },
            },
        });

        const jsonStr = response.text.trim();
        const suggested = JSON.parse(jsonStr) as Suggestion[];
        setSuggestions(suggested);
    } catch (e) {
        console.error("Error fetching suggestions:", e);
        setError("Could not fetch suggestions from AI. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleApplySuggestion = (linkId: string, folderId: string | null) => {
    updateLink(linkId, { folderId: folderId });
    setSuggestions(prev => prev.filter(s => s.linkId !== linkId));
  };
  
  const getLinkById = (id: string) => links.find(link => link.id === id);
  const getFolderById = (id: string) => folders.find(folder => folder.id === id);

  const renderContent = () => {
    if (linksToOrganize.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-8">All links are already organized!</p>;
    }
     if (folders.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-8">Please create at least one folder to get suggestions.</p>;
    }
    if (isLoading) {
        return <div className="text-center py-8">Loading suggestions...</div>;
    }
    if (error) {
        return <p className="text-center text-red-500 py-8">{error}</p>;
    }
     if (suggestions.length === 0 && !isLoading) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-8">No suggestions available right now.</p>;
    }

    return (
      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {suggestions.map(({ linkId, suggestedFolderId }) => {
            const link = getLinkById(linkId);
            if (!link) return null;
            
            return (
                <li key={linkId} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{link.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                           Suggesting: <span className="font-semibold">{getFolderById(suggestedFolderId!)?.name ?? 'Uncategorized'}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => handleApplySuggestion(linkId, suggestedFolderId)}
                        className="ml-4 px-3 py-1 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Apply
                    </button>
                </li>
            )
        })}
      </ul>
    );
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Link Organizer">
        {renderContent()}
         <div className="flex justify-end pt-4 mt-4 border-t border-gray-200 dark:border-gray-600">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-600"
            >
                Close
            </button>
        </div>
    </Modal>
  );
};

export default AIOrganizerModal;
