import React, { forwardRef } from 'react';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * TextInput - A reusable text input component using DaisyUI 5.x classes
 *
 * @example
 * <TextInput
 *   label="Email Address"
 *   type="email"
 *   name="email"
 *   value={email}
 *   onChange={handleChange}
 *   error={errors.email}
 *   helperText="We'll never share your email"
 *   required
 *   size="md"
 *   variant="bordered"
 * />
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
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
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const sizeClass = {
      xs: 'input-xs',
      sm: 'input-sm',
      md: 'input-md',
      lg: 'input-lg',
    }[size];

    const variantClass = {
      bordered: 'input-bordered',
      ghost: 'input-ghost',
      primary: 'input-primary',
      secondary: 'input-secondary',
      accent: 'input-accent',
      success: 'input-success',
      warning: 'input-warning',
      error: 'input-error',
    }[variant];

    const errorMessage = typeof error === 'string' ? error : '';
    const hasError = !!error;

    const inputClasses = [
      'input',
      variantClass,
      sizeClass,
      hasError && 'input-error',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
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

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content opacity-60">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={inputClasses}
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

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content opacity-60">
              {rightIcon}
            </div>
          )}
        </div>

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

TextInput.displayName = 'TextInput';

export default TextInput;
