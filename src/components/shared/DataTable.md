# DataTable Component

A standardized, reusable table component for displaying data with consistent styling and behavior across the application.

## Features

- ✅ **Consistent Styling**: Uniform appearance with DaisyUI table variants
- ✅ **Flexible Actions**: Support for both icon-only and labeled action buttons
- ✅ **Row Selection**: Built-in checkbox selection with "select all" functionality
- ✅ **Bulk Actions**: Execute actions on multiple selected rows
- ✅ **Loading States**: Built-in loading spinner
- ✅ **Empty States**: Customizable empty state with icon and message
- ✅ **Type-Safe**: Full TypeScript support with generics

## Basic Usage

```tsx
import { DataTable, TableColumn } from '../shared/DataTable';

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: TableColumn<User>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (user) => <span className="font-medium">{user.name}</span>
  },
  {
    key: 'email',
    header: 'Email',
    render: (user) => user.email
  }
];

<DataTable
  data={users}
  columns={columns}
  getItemId={(user) => user.id}
/>
```

## With Actions

```tsx
const actions: TableAction<User>[] = [
  {
    label: 'Edit',
    icon: <PencilIcon className="h-4 w-4" />,
    onClick: (user) => handleEdit(user),
    variant: 'ghost'
  },
  {
    icon: <TrashIcon className="h-4 w-4" />,
    onClick: (user) => handleDelete(user),
    variant: 'error',
    title: 'Delete user'
  }
];

<DataTable
  data={users}
  columns={columns}
  actions={actions}
  getItemId={(user) => user.id}
/>
```

## With Selection and Bulk Actions

```tsx
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const bulkActions = [
  {
    label: 'Delete Selected',
    icon: <TrashIcon className="h-5 w-5" />,
    onClick: (ids) => handleBulkDelete(ids),
    variant: 'error' as const
  }
];

<DataTable
  data={users}
  columns={columns}
  selectable
  selectedItems={selectedIds}
  onSelectionChange={setSelectedIds}
  bulkActions={bulkActions}
  getItemId={(user) => user.id}
/>
```

## Props

### Core Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `T[]` | Yes | Array of data items to display |
| `columns` | `TableColumn<T>[]` | Yes | Column definitions |
| `getItemId` | `(item: T) => any` | Yes | Function to extract unique ID from item |
| `actions` | `TableAction<T>[]` | No | Action buttons for each row |
| `loading` | `boolean` | No | Show loading state |
| `emptyMessage` | `string` | No | Message when no data |
| `emptyIcon` | `ReactNode` | No | Icon for empty state |

### Selection Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `selectable` | `boolean` | No | Enable row selection |
| `selectedItems` | `Set<any>` | No | Set of selected item IDs |
| `onSelectionChange` | `(ids: Set<any>) => void` | No | Callback when selection changes |
| `bulkActions` | `BulkAction[]` | No | Actions for selected items |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'zebra' \| 'sm' \| 'zebra-sm'` | `'zebra'` | Table style variant |
| `className` | `string` | `''` | Additional CSS classes |

## Column Definition

```tsx
interface TableColumn<T> {
  key: string;              // Unique key
  header: string | ReactNode; // Header content
  render: (item: T) => ReactNode; // Cell renderer
  className?: string;        // Column CSS classes
}
```

## Action Definition

```tsx
interface TableAction<T> {
  label?: string;           // Button text (optional for icon-only)
  icon?: ReactNode;         // Icon element
  onClick: (item: T) => void; // Click handler
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'ghost';
  disabled?: (item: T) => boolean; // Conditional disable
  title?: string | ((item: T) => string); // Tooltip
  className?: string;       // Custom classes
}
```

## Action Button Variants

- **Icon + Label**: Both `icon` and `label` provided (recommended for clarity)
- **Icon Only**: Only `icon` provided (good for space-constrained tables)
- **Label Only**: Only `label` provided (best for important actions)

## Styling Variants

- `default`: Standard table
- `zebra`: Alternating row colors (recommended)
- `sm`: Compact spacing
- `zebra-sm`: Zebra striping with compact spacing

## Examples

### User Management Table

```tsx
const columns: TableColumn<CognitoUserDto>[] = [
  {
    key: 'username',
    header: 'Username',
    render: (user) => <span className="font-medium">{user.username}</span>
  },
  {
    key: 'email',
    header: 'Email',
    render: (user) => (
      <div className="flex items-center gap-2">
        {user.email}
        {user.emailVerified && <CheckIcon className="h-4 w-4 text-success" />}
      </div>
    )
  },
  {
    key: 'status',
    header: 'Status',
    render: (user) => (
      <span className={`badge ${getStatusBadgeClass(user.status)}`}>
        {user.status}
      </span>
    )
  }
];

const actions: TableAction<CognitoUserDto>[] = [
  {
    icon: <PencilIcon className="h-4 w-4" />,
    onClick: handleEdit,
    variant: 'ghost',
    title: 'Edit user'
  },
  {
    icon: <TrashIcon className="h-4 w-4" />,
    onClick: handleDelete,
    variant: 'error',
    title: 'Delete user'
  }
];
```

### Video Management Table with Selection

```tsx
const [selected, setSelected] = useState<Set<number>>(new Set());

const bulkActions = [
  {
    label: `Delete Selected (${selected.size})`,
    icon: <TrashIcon className="h-5 w-5" />,
    onClick: handleBulkDelete,
    variant: 'error' as const
  }
];

<DataTable
  data={videos}
  columns={videoColumns}
  actions={videoActions}
  selectable
  selectedItems={selected}
  onSelectionChange={setSelected}
  bulkActions={bulkActions}
  getItemId={(video) => video.id!}
  variant="zebra"
/>
```

## Migration Guide

### From existing table implementations:

**Before:**
```tsx
<table className="table table-zebra">
  <thead>
    <tr>
      <th>Name</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {items.map(item => (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>
          <button onClick={() => handleEdit(item)} className="btn btn-xs btn-ghost">
            Edit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

**After:**
```tsx
<DataTable
  data={items}
  columns={[
    { key: 'name', header: 'Name', render: (item) => item.name }
  ]}
  actions={[
    { label: 'Edit', onClick: handleEdit, variant: 'ghost' }
  ]}
  getItemId={(item) => item.id}
/>
```

## Best Practices

1. **Use consistent action variants**: Stick to icons for all actions or labels for all actions in a single table
2. **Provide tooltips**: Always add `title` prop for icon-only actions
3. **Keep getItemId simple**: Return a unique primitive value (string, number)
4. **Handle loading states**: Set `loading={true}` while fetching data
5. **Customize empty states**: Provide meaningful `emptyMessage` and relevant `emptyIcon`
6. **Use zebra variant**: Improves readability for large datasets
7. **Conditional actions**: Use `disabled` prop to hide/disable actions based on item state

## Common Icons

Import from your icon library or use inline SVGs:

```tsx
// Edit icon
<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
</svg>

// Delete icon
<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>

// View icon
<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
</svg>
```
