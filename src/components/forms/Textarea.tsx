import React, { forwardRef, useState } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  variant?: 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  containerClassName?: string;
  showCharCount?: boolean;
  maxCharCount?: number;
}

/**
 * Textarea - A reusable textarea component using DaisyUI 5.x classes
 *
 * @example
 * <Textarea
 *   label="Description"
 *   name="description"
 *   value={description}
 *   onChange={handleChange}
 *   error={errors.description}
 *   helperText="Tell us about yourself"
 *   rows={4}
 *   showCharCount
 *   maxCharCount={500}
 * />
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      variant = 'bordered',
      containerClassName = '',
      className = '',
      required,
      disabled,
      showCharCount,
      maxCharCount,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(
      value ? String(value).length : 0
    );

    const variantClass = {
      bordered: 'textarea-bordered',
      ghost: 'textarea-ghost',
      primary: 'textarea-primary',
      secondary: 'textarea-secondary',
      accent: 'textarea-accent',
      success: 'textarea-success',
      warning: 'textarea-warning',
      error: 'textarea-error',
    }[variant];

    const errorMessage = typeof error === 'string' ? error : '';
    const hasError = !!error;

    const textareaClasses = [
      'textarea',
      variantClass,
      hasError && 'textarea-error',
      'w-full',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCharCount) {
        setCharCount(e.target.value.length);
      }
      onChange?.(e);
    };

    const isOverLimit = maxCharCount && charCount > maxCharCount;

    return (
      <div className={`form-control w-full ${containerClassName}`}>
        {label && (
          <label className="label">
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1" aria-label="required">*</span>}
            </span>
            {showCharCount && maxCharCount && (
              <span className={`label-text-alt ${isOverLimit ? 'text-error' : ''}`}>
                {charCount}/{maxCharCount}
              </span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          required={required}
          value={value}
          onChange={handleChange}
          maxLength={maxCharCount}
          aria-invalid={hasError}
          aria-describedby={
            errorMessage || helperText
              ? `${props.name || props.id}-helper`
              : undefined
          }
          {...props}
        />

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

Textarea.displayName = 'Textarea';

export default Textarea;
