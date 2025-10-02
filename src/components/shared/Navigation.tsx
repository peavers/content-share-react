import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="navbar bg-base-200 px-4 py-3">
      <div className="flex-1 gap-2">
        {/* Hamburger menu for mobile */}
        <label htmlFor="tag-drawer" className="btn btn-ghost btn-square drawer-button lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>

        {/* Home button - only show when not on home page */}
        {!isHomePage && (
          <Link to="/" className="btn btn-ghost btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        )}
      </div>

      <div className="flex-none">
        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Navigation;