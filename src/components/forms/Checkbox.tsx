import React, { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string | React.ReactNode;
  helperText?: string;
  error?: string | boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  containerClassName?: string;
  labelPosition?: 'left' | 'right';
  indeterminate?: boolean;
}

/**
 * Checkbox - A reusable checkbox component using DaisyUI 5.x classes
 *
 * @example
 * <Checkbox
 *   label="I agree to the terms and conditions"
 *   name="terms"
 *   checked={agreedToTerms}
 *   onChange={handleChange}
 *   error={errors.terms}
 *   required
 *   color="primary"
 * />
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
      indeterminate,
      ...props
    },
    ref
  ) => {
    const sizeClass = {
      xs: 'checkbox-xs',
      sm: 'checkbox-sm',
      md: 'checkbox-md',
      lg: 'checkbox-lg',
    }[size];

    const colorClass = {
      primary: 'checkbox-primary',
      secondary: 'checkbox-secondary',
      accent: 'checkbox-accent',
      success: 'checkbox-success',
      warning: 'checkbox-warning',
      error: 'checkbox-error',
      info: 'checkbox-info',
    }[color];

    const errorMessage = typeof error === 'string' ? error : '';
    const hasError = !!error;

    const checkboxClasses = [
      'checkbox',
      colorClass,
      sizeClass,
      hasError && 'checkbox-error',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const checkboxElement = (
      <input
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          if (node && indeterminate !== undefined) {
            node.indeterminate = indeterminate;
          }
        }}
        type="checkbox"
        className={checkboxClasses}
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

          {checkboxElement}

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

Checkbox.displayName = 'Checkbox';

export default Checkbox;
