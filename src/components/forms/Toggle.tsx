import React, { forwardRef } from 'react';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string | React.ReactNode;
  helperText?: string;
  error?: string | boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  containerClassName?: string;
  labelPosition?: 'left' | 'right';
}

/**
 * Toggle - A reusable toggle switch component using DaisyUI 5.x classes
 *
 * @example
 * <Toggle
 *   label="Enable notifications"
 *   name="notifications"
 *   checked={notificationsEnabled}
 *   onChange={handleChange}
 *   color="primary"
 * />
 */
const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      color = 'primary',
      containerClassName = '',
      className = '',
      labelPosition = 'right',
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClass = {
      xs: 'toggle-xs',
      sm: 'toggle-sm',
      md: 'toggle-md',
      lg: 'toggle-lg',
    }[size];

    const colorClass = {
      primary: 'toggle-primary',
      secondary: 'toggle-secondary',
      accent: 'toggle-accent',
      success: 'toggle-success',
      warning: 'toggle-warning',
      error: 'toggle-error',
      info: 'toggle-info',
    }[color];

    const errorMessage = typeof error === 'string' ? error : '';
    const hasError = !!error;

    const toggleClasses = [
      'toggle',
      colorClass,
      sizeClass,
      hasError && 'toggle-error',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const toggleElement = (
      <input
        ref={ref}
        type="checkbox"
        className={toggleClasses}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        aria-describedby={
          errorMessage || helperText
            ? `${props.name || props.id}-helper`
            : undefined
        }
        {...props}
      />
    );

    return (
      <div className={`form-control ${containerClassName}`}>
        <label className="label cursor-pointer justify-start gap-3">
          {labelPosition === 'left' && label && (
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1" aria-label="required">*</span>}
            </span>
          )}

          {toggleElement}

          {labelPosition === 'right' && label && (
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1" aria-label="required">*</span>}
            </span>
          )}
        </label>

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

Toggle.displayName = 'Toggle';

export default Toggle;
