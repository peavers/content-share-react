import React, { useState } from 'react';
import {
  TextInput,
  Select,
  Textarea,
  Checkbox,
  RadioGroup,
  Toggle,
  FormGroup,
} from './index';

/**
 * ExampleForm - Comprehensive example demonstrating all form components
 *
 * This component showcases:
 * - All form component types
 * - Validation and error states
 * - Different sizes and variants
 * - Form state management
 * - Accessibility features
 */
const ExampleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    // Text inputs
    fullName: '',
    email: '',
    phone: '',
    website: '',
    password: '',

    // Select
    country: '',
    city: '',

    // Textarea
    bio: '',

    // Checkbox
    newsletter: false,
    terms: false,

    // Radio
    plan: '',

    // Toggle
    notifications: true,
    darkMode: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    if (!formData.plan) {
      newErrors.plan = 'Please select a plan';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully! Check console for data.');
    } else {
      alert('Please fix the errors in the form');
    }
  };

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  const cityOptionGroups = [
    {
      label: 'North America',
      options: [
        { value: 'nyc', label: 'New York' },
        { value: 'la', label: 'Los Angeles' },
        { value: 'toronto', label: 'Toronto' },
      ],
    },
    {
      label: 'Europe',
      options: [
        { value: 'london', label: 'London' },
        { value: 'paris', label: 'Paris' },
        { value: 'berlin', label: 'Berlin' },
      ],
    },
  ];

  const planOptions = [
    {
      value: 'free',
      label: 'Free',
      description: '$0/month - Basic features for individuals',
    },
    {
      value: 'pro',
      label: 'Pro',
      description: '$19/month - Advanced features for professionals',
    },
    {
      value: 'team',
      label: 'Team',
      description: '$49/month - Collaboration tools for teams',
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      description: 'Custom pricing - Full features for organizations',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Form Components Example</h2>
          <p className="mb-6 opacity-70">
            This form demonstrates all available form components with validation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <FormGroup
              legend="Personal Information"
              description="Your basic details"
              columns={2}
              gap="md"
            >
              <TextInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="John Doe"
                error={touched.fullName ? errors.fullName : undefined}
                required
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <TextInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
                error={touched.email ? errors.email : undefined}
                helperText="We'll never share your email"
                required
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <TextInput
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                helperText="Optional"
              />

              <TextInput
                label="Website"
                type="url"
                name="website"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://example.com"
                helperText="Optional"
              />
            </FormGroup>

            {/* Security Section */}
            <FormGroup
              legend="Security"
              description="Keep your account secure"
            >
              <TextInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                error={touched.password ? errors.password : undefined}
                helperText="Minimum 8 characters"
                required
              />
            </FormGroup>

            {/* Location Section */}
            <FormGroup
              legend="Location"
              description="Where are you based?"
              columns={2}
              gap="md"
            >
              <Select
                label="Country"
                name="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                options={countryOptions}
                placeholder="Select a country"
                error={touched.country ? errors.country : undefined}
                required
              />

              <Select
                label="City"
                name="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                optionGroups={cityOptionGroups}
                placeholder="Select a city"
                helperText="Optional"
              />
            </FormGroup>

            {/* About Section */}
            <FormGroup
              legend="About You"
              description="Tell us more about yourself"
            >
              <Textarea
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Write a short bio..."
                rows={4}
                showCharCount
                maxCharCount={500}
                helperText="Optional - describe your interests and experience"
              />
            </FormGroup>

            {/* Subscription Plan */}
            <FormGroup
              legend="Choose Your Plan"
              description="Select the plan that works best for you"
            >
              <RadioGroup
                label="Subscription Plan"
                name="plan"
                value={formData.plan}
                onChange={(value) => handleChange('plan', value)}
                options={planOptions}
                orientation="vertical"
                error={touched.plan ? errors.plan : undefined}
                required
                color="primary"
              />
            </FormGroup>

            {/* Preferences Section */}
            <FormGroup
              legend="Preferences"
              description="Customize your experience"
              columns={2}
              gap="md"
            >
              <Toggle
                label="Enable notifications"
                name="notifications"
                checked={formData.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                color="primary"
              />

              <Toggle
                label="Dark mode"
                name="darkMode"
                checked={formData.darkMode}
                onChange={(e) => handleChange('darkMode', e.target.checked)}
                color="accent"
              />
            </FormGroup>

            {/* Agreements Section */}
            <div className="divider"></div>

            <div className="space-y-3">
              <Checkbox
                label="Subscribe to our newsletter for updates and offers"
                name="newsletter"
                checked={formData.newsletter}
                onChange={(e) => handleChange('newsletter', e.target.checked)}
                color="primary"
              />

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
                checked={formData.terms}
                onChange={(e) => handleChange('terms', e.target.checked)}
                error={touched.terms ? errors.terms : undefined}
                required
                color="primary"
              />
            </div>

            {/* Submit Section */}
            <div className="divider"></div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    website: '',
                    password: '',
                    country: '',
                    city: '',
                    bio: '',
                    newsletter: false,
                    terms: false,
                    plan: '',
                    notifications: true,
                    darkMode: false,
                  });
                  setErrors({});
                  setTouched({});
                }}
              >
                Reset
              </button>
              <button type="submit" className="btn btn-primary">
                Submit Form
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Demo Info */}
      <div className="alert alert-info mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Demo Form</h3>
          <div className="text-xs">
            This form demonstrates all available components. Form data is logged to console on submit.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleForm;
