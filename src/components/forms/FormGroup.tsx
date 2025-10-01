import React from 'react';

export interface FormGroupProps {
  children: React.ReactNode;
  legend?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  asFieldset?: boolean;
}

/**
 * FormGroup - A container component for grouping related form fields
 *
 * @example
 * <FormGroup legend="Personal Information" columns={2} gap="md">
 *   <TextInput label="First Name" name="firstName" />
 *   <TextInput label="Last Name" name="lastName" />
 * </FormGroup>
 */
const FormGroup: React.FC<FormGroupProps> = ({
  children,
  legend,
  description,
  columns = 1,
  gap = 'md',
  className = '',
  asFieldset = false,
}) => {
  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }[gap];

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  const content = (
    <>
      {legend && (
        <div className="mb-4">
          {asFieldset ? (
            <legend className="text-lg font-semibold">{legend}</legend>
          ) : (
            <h3 className="text-lg font-semibold">{legend}</h3>
          )}
          {description && (
            <p className="text-sm opacity-60 mt-1">{description}</p>
          )}
        </div>
      )}

      <div className={`grid ${gridColsClass} ${gapClass}`}>
        {children}
      </div>
    </>
  );

  if (asFieldset) {
    return (
      <fieldset className={`border-none p-0 ${className}`}>
        {content}
      </fieldset>
    );
  }

  return <div className={className}>{content}</div>;
};

export default FormGroup;
