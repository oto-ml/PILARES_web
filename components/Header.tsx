
import React from 'react';

interface HeaderProps {
  activeView: 'catalog' | 'workshops' | 'admin' | 'details';
  onNavigate: (view: 'catalog' | 'workshops' | 'admin' | 'details') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate, searchQuery, onSearchChange }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-[#e4dcde] bg-[#fdfdfb]/95 backdrop-blur-sm px-4 md:px-10 lg:px-40 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between whitespace-nowrap">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('catalog')}>
            <div className="size-8 bg-primary rounded flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-xl">account_balance</span>
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight font-serif truncate max-w-[200px] sm:max-w-none">
              PILARES Mártires del 10 de junio
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('catalog')}
              className={`text-sm font-semibold transition-colors cursor-pointer ${activeView === 'catalog' || activeView === 'details' ? 'text-primary border-b-2 border-accent-gold' : 'hover:text-primary text-[#85666e]'}`}
            >
              Catálogo
            </button>
            <button 
              onClick={() => onNavigate('workshops')}
              className={`text-sm font-semibold transition-colors cursor-pointer ${activeView === 'workshops' ? 'text-primary border-b-2 border-accent-gold' : 'hover:text-primary text-[#85666e]'}`}
            >
              Talleres
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:block relative min-w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-accent-gold text-lg">search</span>
            <input 
              className="w-full bg-[#f4f1f1] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-accent-gold" 
              placeholder="Buscar por título o tema..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button 
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'admin' ? 'bg-primary text-white' : 'text-primary hover:bg-primary/5'}`}
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
