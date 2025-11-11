import React, { useState, useEffect } from 'react';
import { useLinkNestStore } from '../hooks/useLinkNestStore';
import { Folder } from '../types';
import Modal from './Modal';

interface AddEditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderToEdit?: Folder | null;
}

const AddEditFolderModal: React.FC<AddEditFolderModalProps> = ({ isOpen, onClose, folderToEdit }) => {
  const { addFolder, updateFolder } = useLinkNestStore();
  const [name, setName] = useState('');

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
    } else {
      setName('');
    }
  }, [folderToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (folderToEdit) {
      updateFolder(folderToEdit.id, name);
    } else {
      addFolder(name);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={folderToEdit ? 'Edit Folder' : 'Add New Folder'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Folder Name</label>
          <input
            type="text"
            name="folder-name"
            id="folder-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            autoFocus
          />
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
                {folderToEdit ? 'Save Changes' : 'Add Folder'}
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditFolderModal;
