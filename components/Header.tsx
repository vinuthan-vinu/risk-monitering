
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center p-4 pb-2 bg-background-light dark:bg-background-dark flex-shrink-0 sticky top-0 z-20">
      <div className="flex w-12 shrink-0 items-center justify-start">
        {showBackButton && (
          <button onClick={() => navigate(-1)} className="text-slate-800 dark:text-white -ml-2 p-2">
            <span className="material-symbols-outlined text-3xl">arrow_back_ios_new</span>
          </button>
        )}
      </div>
      <h1 className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">{title}</h1>
      <div className="flex w-12 items-center justify-end">
        {/* Placeholder for right-side action */}
      </div>
    </header>
  );
};

export default Header;
