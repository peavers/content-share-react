import React from 'react';

interface ExpandableContentProps {
  isExpanded: boolean;
  maxHeight?: string;
  children: React.ReactNode;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  isExpanded,
  maxHeight = 'max-h-96',
  children
}) => {
  return (
    <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? `${maxHeight} opacity-100` : 'max-h-0 opacity-0'}`}>
      {children}
    </div>
  );
};

export default ExpandableContent;
