import React, { useState } from 'react';
import AuthModal from './AuthModal';

const AuthButtons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');

  const openLogin = () => {
    setModalMode('login');
    setIsModalOpen(true);
  };

  const openRegister = () => {
    setModalMode('register');
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        <button
          onClick={openLogin}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={openRegister}
          className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Sign Up
        </button>
      </div>
      
      <AuthModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode={modalMode}
      />
    </>
  );
};

export default AuthButtons;
