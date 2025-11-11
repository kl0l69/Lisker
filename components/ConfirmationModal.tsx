import React from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  confirmButtonVariant?: 'danger' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmButtonVariant }) => {
  
  const buttonVariants = {
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800',
    primary: 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800',
  };

  const selectedVariant = confirmButtonVariant || 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-gray-600 dark:text-gray-400">{message}</div>
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
          className={buttonVariants[selectedVariant]}
        >
          {confirmText || 'Confirm'}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
