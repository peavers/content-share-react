import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'error';

interface ActionButtonProps {
  onClick: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary-focus text-primary-content',
  secondary: 'bg-base-300 hover:bg-base-content/10',
  error: 'bg-error hover:bg-error-focus text-error-content'
};

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  variant = 'primary',
  icon,
  children,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full mt-2 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

export default ActionButton;
