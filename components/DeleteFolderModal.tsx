import React from 'react';
import Modal from './Modal';

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  folderName: string;
}

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({ isOpen, onClose, onConfirm, folderName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Folder">
      <p className="text-gray-600 dark:text-gray-400">
        Are you sure you want to delete the folder "<strong>{folderName}</strong>"?
      </p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        All links within this folder will be moved to "All Links". This action cannot be undone.
      </p>
      <div className="flex justify-end pt-6 space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => { onConfirm(); onClose(); }}
          className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          Delete Folder
        </button>
      </div>
    </Modal>
  );
};

export default DeleteFolderModal;
