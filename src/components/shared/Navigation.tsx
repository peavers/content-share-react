import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Navigation: React.FC = () => {

  return (
    <div className="navbar bg-base-200 px-4 py-3">
      <div className="flex-1">
        {/* Hamburger menu for mobile */}
        <label htmlFor="tag-drawer" className="btn btn-ghost btn-square drawer-button lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </div>

      <div className="flex-none">
        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Navigation;