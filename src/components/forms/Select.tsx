import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  containerClassName?: string;
  options?: SelectOption[];
  optionGroups?: SelectOptionGroup[];
  placeholder?: string;
}

/**
 * Select - A reusable select dropdown component using DaisyUI 5.x classes
 *
 * @example
 * <Select
 *   label="Country"
 *   name="country"
 *   value={country}
 *   onChange={handleChange}
 *   options={countryOptions}
 *   error={errors.country}
 *   placeholder="Select a country"
 *   required
 * />
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      variant = 'bordered',
      containerClassName = '',
      className = '',
      required,
      disabled,
      options = [],
      optionGroups,
      placeholder,
      ...props
    },
    ref
  ) => {
    const sizeClass = {
      xs: 'select-xs',
      sm: 'select-sm',
      md: 'select-md',
      lg: 'select-lg',
    }[size];

    const variantClass = {
      bordered: 'select-bordered',
      ghost: 'select-ghost',
      primary: 'select-primary',
      secondary: 'select-secondary',
      accent: 'select-accent',
      success: 'select-success',
      warning: 'select-warning',
      error: 'select-error',
    }[variant];

    const errorMessage = typeof error === 'string' ? error : '';
    const hasError = !!error;

    const selectClasses = [
      'select',
      variantClass,
      sizeClass,
      hasError && 'select-error',
      'w-full',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`form-control w-full ${containerClassName}`}>
        {label && (
          <label className="label">
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1" aria-label="required">*</span>}
            </span>
          </label>
        )}

        <select
          ref={ref}
          className={selectClasses}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            errorMessage || helperText
              ? `${props.name || props.id}-helper`
              : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {optionGroups ? (
            optionGroups.map((group, groupIndex) => (
              <optgroup key={groupIndex} label={group.label}>
                {group.options.map((option, optionIndex) => (
                  <option
                    key={`${groupIndex}-${optionIndex}`}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))
          ) : (
            options.map((option, index) => (
              <option
                key={index}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          )}
        </select>

        {(helperText || errorMessage) && (
          <label className="label">
            <span
              id={`${props.name || props.id}-helper`}
              className={`label-text-alt ${hasError ? 'text-error' : ''}`}
              role={hasError ? 'alert' : undefined}
            >
              {errorMessage || helperText}
            </span>
          </label>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
