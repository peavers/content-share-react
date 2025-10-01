# Form Components - DaisyUI 5.x

A comprehensive set of reusable form components built with DaisyUI 5.x classes for consistent styling and behavior.

## Components

- **TextInput** - Text, email, password, number, tel, url inputs
- **Select** - Dropdown select with options and option groups
- **Textarea** - Multi-line text input with character count
- **Checkbox** - Single checkbox with label
- **RadioGroup** - Group of radio buttons
- **Toggle** - Toggle switch
- **FormGroup** - Container for grouping form fields

## Features

✅ Full TypeScript support
✅ DaisyUI 5.x native classes
✅ Consistent API across all components
✅ Built-in error handling and validation states
✅ WCAG 2.1 Level AA accessibility
✅ React Hook Form compatible
✅ Formik compatible
✅ Forward ref support
✅ Responsive design
✅ Dark mode support (via DaisyUI themes)

## Installation

Components are already in `src/components/forms/`. Import what you need:

```tsx
import { TextInput, Select, Checkbox, FormGroup } from '@/components/forms';
```

## Basic Usage

### TextInput

```tsx
import { TextInput } from '@/components/forms';

<TextInput
  label="Email Address"
  type="email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="john@example.com"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>
```

**Props:**
- `label` - Field label
- `helperText` - Helper text below input
- `error` - Error message or boolean
- `size` - xs | sm | md | lg
- `variant` - bordered | ghost | primary | secondary | accent | success | warning | error
- `leftIcon` / `rightIcon` - Icon elements
- `required` - Shows * indicator
- All standard HTML input attributes

### Select

```tsx
import { Select } from '@/components/forms';

<Select
  label="Country"
  name="country"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
  ]}
  error={errors.country}
  required
/>
```

**With Option Groups:**

```tsx
<Select
  label="City"
  name="city"
  optionGroups={[
    {
      label: 'West Coast',
      options: [
        { value: 'sf', label: 'San Francisco' },
        { value: 'la', label: 'Los Angeles' },
      ],
    },
    {
      label: 'East Coast',
      options: [
        { value: 'nyc', label: 'New York' },
        { value: 'boston', label: 'Boston' },
      ],
    },
  ]}
/>
```

### Textarea

```tsx
import { Textarea } from '@/components/forms';

<Textarea
  label="Description"
  name="description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  placeholder="Tell us about yourself..."
  showCharCount
  maxCharCount={500}
  error={errors.description}
/>
```

### Checkbox

```tsx
import { Checkbox } from '@/components/forms';

<Checkbox
  label="I agree to the terms and conditions"
  name="terms"
  checked={agreedToTerms}
  onChange={(e) => setAgreedToTerms(e.target.checked)}
  color="primary"
  error={errors.terms}
  required
/>
```

### RadioGroup

```tsx
import { RadioGroup } from '@/components/forms';

<RadioGroup
  label="Subscription Plan"
  name="plan"
  value={selectedPlan}
  onChange={(value) => setSelectedPlan(value)}
  options={[
    {
      value: 'free',
      label: 'Free',
      description: '$0/month - Basic features'
    },
    {
      value: 'pro',
      label: 'Pro',
      description: '$19/month - Advanced features'
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      description: 'Custom pricing - All features'
    },
  ]}
  orientation="vertical"
  error={errors.plan}
  required
/>
```

### Toggle

```tsx
import { Toggle } from '@/components/forms';

<Toggle
  label="Enable notifications"
  name="notifications"
  checked={notificationsEnabled}
  onChange={(e) => setNotificationsEnabled(e.target.checked)}
  color="primary"
  size="md"
/>
```

### FormGroup

```tsx
import { FormGroup, TextInput } from '@/components/forms';

<FormGroup
  legend="Personal Information"
  description="Your basic details"
  columns={2}
  gap="md"
>
  <TextInput label="First Name" name="firstName" required />
  <TextInput label="Last Name" name="lastName" required />
  <TextInput label="Email" type="email" name="email" required />
  <TextInput label="Phone" type="tel" name="phone" />
</FormGroup>
```

## React Hook Form Integration

```tsx
import { useForm } from 'react-hook-form';
import { TextInput, Select, Checkbox } from '@/components/forms';

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Username"
        {...register('username', {
          required: 'Username is required',
          minLength: { value: 3, message: 'Min 3 characters' }
        })}
        error={errors.username?.message}
      />

      <Select
        label="Role"
        {...register('role', { required: 'Please select a role' })}
        options={roleOptions}
        error={errors.role?.message}
      />

      <Checkbox
        label="Accept terms"
        {...register('terms', { required: 'You must accept terms' })}
        error={errors.terms?.message}
      />

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};
```

## Component Props Reference

### Common Props (all components)

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Field label text |
| `helperText` | string | Helper text displayed below field |
| `error` | string \| boolean | Error message or error state |
| `required` | boolean | Shows * indicator, adds HTML required |
| `disabled` | boolean | Disables the field |
| `containerClassName` | string | Additional classes for wrapper div |

### Size Variants

All components support: `xs`, `sm`, `md` (default), `lg`

### Color Variants

Checkbox, Radio, Toggle: `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`

TextInput, Select, Textarea variants: `bordered`, `ghost`, `primary`, `secondary`, `accent`, `success`, `warning`, `error`

## Styling Customization

All components use DaisyUI classes. To customize:

1. **Use DaisyUI themes** - Change theme in `tailwind.config.js`
2. **Pass className** - Add additional Tailwind classes
3. **Use containerClassName** - Style the wrapper div

```tsx
<TextInput
  label="Custom"
  className="font-mono"  // Add to input element
  containerClassName="mb-8"  // Add to wrapper
/>
```

## Accessibility

All components include:
- Proper ARIA attributes
- Associated labels (via htmlFor or label wrapper)
- Error announcements (role="alert")
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Migration Guide

To migrate existing forms:

1. Replace old input elements with new components
2. Update prop names to match new API
3. Remove custom styling (use DaisyUI classes)
4. Test form validation and submission
5. Verify accessibility with screen reader

### Before:
```tsx
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">
    Email
  </label>
  <input
    type="email"
    className="w-full px-4 py-2 border rounded"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  {errors.email && (
    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
  )}
</div>
```

### After:
```tsx
<TextInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

## Best Practices

1. **Always provide labels** - For accessibility
2. **Use meaningful helperText** - Guide users
3. **Provide clear error messages** - Help users fix issues
4. **Group related fields** - Use FormGroup
5. **Use appropriate input types** - type="email", type="tel", etc.
6. **Mark required fields** - Use required prop
7. **Test with keyboard only** - Ensure tab navigation works
8. **Test with screen readers** - Verify announcements

## Examples

See `ExampleForm.tsx` for a comprehensive example using all components.

## Support

For issues or questions about form components:
- Check this README
- Review component TypeScript definitions
- Look at example implementations in the codebase
