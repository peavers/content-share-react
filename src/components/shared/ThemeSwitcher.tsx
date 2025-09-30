import React from 'react';
import { useTheme } from '../../contexts';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </div>
      <div tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 shadow-lg border border-base-300">
        <div className="px-4 py-2 border-b border-base-200">
          <span className="text-xs uppercase font-semibold opacity-60">Themes</span>
        </div>
        <ul className="menu menu-sm max-h-96 overflow-y-auto p-2">
          {availableThemes.map((themeName) => (
            <li key={themeName}>
              <button
                className={`${theme === themeName ? 'active' : ''}`}
                onClick={() => setTheme(themeName)}
              >
                <span className="flex-1 text-left capitalize">{themeName}</span>
                {theme === themeName && (
                  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
