import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextInput,
  Select,
  Textarea,
  Checkbox,
  RadioGroup,
  Toggle,
  FormGroup,
} from './index';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  bio: string;
  plan: string;
  notifications: boolean;
  terms: boolean;
}

/**
 * ExampleReactHookForm - Demonstrates React Hook Form integration
 *
 * This component shows how to use form components with React Hook Form:
 * - Form validation with react-hook-form
 * - Controlled components via Controller
 * - Direct registration with spread operator
 * - Error handling
 * - Submit handling
 *
 * Install React Hook Form: npm install react-hook-form
 */
const ExampleReactHookForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: '',
      bio: '',
      plan: '',
      notifications: true,
      terms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
    alert('Form submitted successfully! Check console for data.');
  };

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  const planOptions = [
    {
      value: 'free',
      label: 'Free',
      description: '$0/month - Basic features',
    },
    {
      value: 'pro',
      label: 'Pro',
      description: '$19/month - Advanced features',
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      description: 'Custom pricing - Full features',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">
            React Hook Form Integration
          </h2>
          <p className="mb-6 opacity-70">
            This form demonstrates integration with React Hook Form for powerful validation.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <FormGroup
              legend="Personal Information"
              columns={2}
              gap="md"
            >
              <TextInput
                label="Full Name"
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                placeholder="John Doe"
                error={errors.fullName?.message}
                required
              />

              <TextInput
                label="Email Address"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                placeholder="john@example.com"
                error={errors.email?.message}
                helperText="We'll never share your email"
                required
              />
            </FormGroup>

            {/* Security */}
            <FormGroup legend="Security">
              <TextInput
                label="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) || 'Must contain uppercase letter',
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) || 'Must contain lowercase letter',
                    hasNumber: (value) =>
                      /[0-9]/.test(value) || 'Must contain a number',
                  },
                })}
                placeholder="••••••••"
                error={errors.password?.message}
                helperText="Minimum 8 characters with uppercase, lowercase, and number"
                required
              />
            </FormGroup>

            {/* Location */}
            <FormGroup legend="Location">
              <Select
                label="Country"
                {...register('country', {
                  required: 'Please select a country',
                })}
                options={countryOptions}
                placeholder="Select a country"
                error={errors.country?.message}
                required
              />
            </FormGroup>

            {/* About */}
            <FormGroup legend="About You">
              <Textarea
                label="Bio"
                {...register('bio', {
                  maxLength: {
                    value: 500,
                    message: 'Bio must be 500 characters or less',
                  },
                })}
                placeholder="Write a short bio..."
                rows={4}
                showCharCount
                maxCharCount={500}
                error={errors.bio?.message}
              />
            </FormGroup>

            {/* Plan - Using Controller for complex components */}
            <FormGroup legend="Choose Your Plan">
              <Controller
                name="plan"
                control={control}
                rules={{ required: 'Please select a plan' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <RadioGroup
                    label="Subscription Plan"
                    name="plan"
                    value={value}
                    onChange={onChange}
                    options={planOptions}
                    orientation="vertical"
                    error={error?.message}
                    required
                    color="primary"
                  />
                )}
              />
            </FormGroup>

            {/* Preferences - Using Controller for checkboxes/toggles */}
            <FormGroup legend="Preferences">
              <Controller
                name="notifications"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Toggle
                    label="Enable notifications"
                    name="notifications"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    color="primary"
                  />
                )}
              />
            </FormGroup>

            {/* Terms */}
            <div className="divider"></div>

            <Controller
              name="terms"
              control={control}
              rules={{ required: 'You must accept the terms and conditions' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Checkbox
                  label={
                    <span>
                      I agree to the{' '}
                      <a href="#" className="link link-primary">
                        terms and conditions
                      </a>
                    </span>
                  }
                  name="terms"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  error={error?.message}
                  required
                  color="primary"
                />
              )}
            />

            {/* Submit */}
            <div className="divider"></div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => reset()}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting && <span className="loading loading-spinner"></span>}
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Integration Notes */}
      <div className="alert alert-success mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">React Hook Form Integration</h3>
          <div className="text-xs">
            <p>This example demonstrates:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Direct registration with spread operator for simple inputs</li>
              <li>Controller wrapper for complex components (Radio, Checkbox, Toggle)</li>
              <li>Built-in validation rules (required, minLength, pattern, custom)</li>
              <li>Automatic error handling and display</li>
              <li>Form state management (isSubmitting, isDirty, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleReactHookForm;
