import React, { forwardRef } from 'react';

export interface RadioOption {
  value: string;
  label: string | React.ReactNode;
  disabled?: boolean;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  helperText?: string;
  error?: string | boolean;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  orientation?: 'horizontal' | 'vertical';
  containerClassName?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * RadioGroup - A reusable radio button group component using DaisyUI 5.x classes
 *
 * @example
 * <RadioGroup
 *   label="Subscription Plan"
 *   name="plan"
 *   value={selectedPlan}
 *   onChange={(value) => setSelectedPlan(value)}
 *   options={planOptions}
 *   error={errors.plan}
 *   orientation="vertical"
 *   required
 * />
 */
const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      label,
      helperText,
      error,
      options,
      value,
      onChange,
      size = 'md',
      color = 'primary',
      orientation = 'vertical',
      containerClassName = '',
      required,
      disabled,
    },
    ref
  ) => {
    const sizeClass = {
      xs: 'radio-xs',
      sm: 'radio-sm',
      md: 'radio-md',
      lg: 'radio-lg',
    }[size];

    const colorClass = {
      primary: 'radio-primary',
      secondary: 'radio-secondary',
      accent: 'radio-accent',
      success: 'radio-success',
      warning: 'radio-warning',
      error: 'radio-error',
      info: 'radio-info',
    }[color];

    const errorMessage = typeof error === 'string' ? error : '';
    const hasError = !!error;

    const radioClasses = [
      'radio',
      colorClass,
      sizeClass,
      hasError && 'radio-error',
    ]
      .filter(Boolean)
      .join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div ref={ref} className={`form-control ${containerClassName}`}>
        {label && (
          <label className="label">
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1" aria-label="required">*</span>}
            </span>
          </label>
        )}

        <div
          className={orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'}
          role="radiogroup"
          aria-invalid={hasError}
          aria-describedby={
            errorMessage || helperText ? `${name}-helper` : undefined
          }
        >
          {options.map((option, index) => (
            <label
              key={index}
              className={`label cursor-pointer justify-start gap-3 ${
                option.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={disabled || option.disabled}
                required={required && index === 0} // Only first radio needs required for validation
                className={radioClasses}
              />
              <div className="flex-1">
                <span className="label-text">{option.label}</span>
                {option.description && (
                  <p className="text-sm opacity-60 mt-1">{option.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>

        {(helperText || errorMessage) && (
          <label className="label">
            <span
              id={`${name}-helper`}
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

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
