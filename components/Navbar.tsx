import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-30 backdrop-blur bg-slate-900/70 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Moviematch AI" className="h-8 w-8 rounded-md border border-slate-700" />
          <span className="sr-only">Moviematch AI</span>
        </Link>
        <div className="flex items-center gap-4 text-slate-300 text-sm">
          <Link to="/about" className="hover:text-slate-100">About</Link>
          <Link to="/contact" className="hover:text-slate-100">Contact</Link>
          <Link to="/privacy" className="hover:text-slate-100">Privacy</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


