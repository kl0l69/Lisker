import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Link, Folder } from '../types';

interface LinkData {
  url: string;
  title: string;
  description: string;
  tags: string[];
  folderId: string | null;
}

interface LinkNestState {
  links: Link[];
  folders: Folder[];
  addLink: (linkData: LinkData) => void;
  updateLink: (id: string, updatedData: Partial<LinkData>) => void;
  deleteLink: (id: string) => void;
  addFolder: (name: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  replaceAllData: (data: { links: Link[], folders: Folder[] }) => void;
}

export const useLinkNestStore = create<LinkNestState>()(
  persist(
    (set, get) => ({
      links: [],
      folders: [],
      addLink: (linkData) => {
        const newLink: Link = {
          ...linkData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ links: [newLink, ...state.links] }));
      },
      updateLink: (id, updatedData) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, ...updatedData } : link
          ),
        }));
      },
      deleteLink: (id) => {
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        }));
      },
      addFolder: (name) => {
        const newFolder: Folder = {
          name,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
      },
      updateFolder: (id, name) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, name } : folder
          ),
        }));
      },
      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          // Also remove links from that folder
          links: state.links.map(link => link.folderId === id ? {...link, folderId: null} : link)
        }));
      },
      replaceAllData: (data) => {
        set({
            links: data.links || [],
            folders: data.folders || [],
        });
      },
    }),
    {
      name: 'linknest-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
