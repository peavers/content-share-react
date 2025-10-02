import React from 'react';

interface SidebarSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, isExpanded, onToggle, children }) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 py-2 hover:bg-base-200 rounded-lg transition-colors mb-2"
      >
        <h3 className="text-xs uppercase font-semibold opacity-60">{title}</h3>
        <svg
          className={`fill-current h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
        </svg>
      </button>
      {children}
    </div>
  );
};

export default SidebarSection;
