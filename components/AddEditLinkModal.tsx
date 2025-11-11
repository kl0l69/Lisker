import React, { useState, useEffect } from 'react';
import { useLinkNestStore } from '../hooks/useLinkNestStore';
import { Link, Folder } from '../types';
import Modal from './Modal';
import { GoogleGenAI, Type } from "@google/genai";
import { MagicWandIcon } from './Icons';

interface AddEditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkToEdit?: Link | null;
}

const AddEditLinkModal: React.FC<AddEditLinkModalProps> = ({ isOpen, onClose, linkToEdit }) => {
  const { addLink, updateLink, folders } = useLinkNestStore();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [folderId, setFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (linkToEdit) {
      setUrl(linkToEdit.url);
      setTitle(linkToEdit.title);
      setDescription(linkToEdit.description);
      setTags(linkToEdit.tags.join(', '));
      setFolderId(linkToEdit.folderId);
    } else {
      // Reset form when opening for a new link
      setUrl('');
      setTitle('');
      setDescription('');
      setTags('');
      setFolderId(null);
    }
    setError('');
  }, [linkToEdit, isOpen]);
  
  const suggestDetails = async () => {
    if (!url) {
        setError('Please enter a URL to get suggestions.');
        return;
    }
    setError('');
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the content of the URL: ${url}, suggest a concise title (max 10 words), a brief description (max 30 words), and up to 5 relevant tags (comma-separated).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        tags: { type: Type.STRING },
                    },
                    required: ["title", "description", "tags"]
                },
            },
        });
        
        const jsonStr = response.text.trim();
        const suggested = JSON.parse(jsonStr);
        
        if (suggested.title) setTitle(suggested.title);
        if (suggested.description) setDescription(suggested.description);
        if (suggested.tags) setTags(suggested.tags);
    } catch (e) {
        console.error("Error fetching suggestions:", e);
        setError("Could not fetch suggestions. Please check the URL or try again later.");
    } finally {
        setIsLoading(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    const linkData = {
      url,
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      folderId,
    };

    if (linkToEdit) {
      updateLink(linkToEdit.id, linkData);
    } else {
      addLink(linkData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={linkToEdit ? 'Edit Link' : 'Add New Link'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="url"
              name="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://example.com"
            />
             <button
                type="button"
                onClick={suggestDetails}
                disabled={isLoading}
                className="relative inline-flex items-center space-x-2 px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500 disabled:opacity-50"
            >
                <MagicWandIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isLoading ? 'Thinking...' : 'Suggest'}</span>
            </button>
          </div>
           {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
        </div>
        
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea id="description" name="description" rows={3} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
        </div>
        
        <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
            <input type="text" name="tags" id="tags" value={tags} onChange={e => setTags(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
        </div>

        <div>
            <label htmlFor="folder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Folder</label>
            <select id="folder" name="folder" value={folderId || ''} onChange={e => setFolderId(e.target.value || null)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="">(No Folder)</option>
                {folders.map((folder: Folder) => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
            </select>
        </div>

        <div className="flex justify-end pt-4 space-x-2">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-600"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                {linkToEdit ? 'Save Changes' : 'Add Link'}
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditLinkModal;