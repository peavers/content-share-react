import { type ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: string | ReactNode;
  render: (item: T) => ReactNode;
  className?: string;
}

export interface TableAction<T> {
  label?: string | ((item: T) => string);
  icon?: ReactNode | ((item: T) => ReactNode);
  onClick: (item: T) => void;
  className?: string | ((item: T) => string);
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'ghost';
  disabled?: (item: T) => boolean;
  title?: string | ((item: T) => string);
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;

  // Selection
  selectable?: boolean;
  selectedItems?: Set<any>;
  onSelectionChange?: (selectedIds: Set<any>) => void;
  getItemId: (item: T) => any;

  // Bulk actions
  bulkActions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: (selectedIds: Set<any>) => void;
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  }>;

  // Styling
  variant?: 'default' | 'zebra' | 'sm' | 'zebra-sm';
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = 'No data found',
  emptyIcon,
  selectable = false,
  selectedItems = new Set(),
  onSelectionChange,
  getItemId,
  bulkActions,
  variant = 'zebra',
  className = '',
}: DataTableProps<T>) {
  // Debug logging
  console.log('[DataTable] Props:', {
    selectable,
    selectedItemsSize: selectedItems.size,
    hasBulkActions: bulkActions && bulkActions.length > 0,
    dataLength: data.length,
    hasOnSelectionChange: !!onSelectionChange
  });
  const tableClasses = [
    'table',
    variant === 'zebra' && 'table-zebra',
    variant === 'sm' && 'table-sm',
    variant === 'zebra-sm' && 'table-zebra table-sm',
  ].filter(Boolean).join(' ');

  const toggleSelection = (id: any) => {
    console.log('[DataTable] toggleSelection called:', id);
    if (!onSelectionChange) {
      console.warn('[DataTable] toggleSelection: no onSelectionChange handler!');
      return;
    }
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    console.log('[DataTable] New selection:', Array.from(newSelection));
    onSelectionChange(newSelection);
  };

  const toggleSelectAll = () => {
    console.log('[DataTable] toggleSelectAll called');
    if (!onSelectionChange) {
      console.warn('[DataTable] toggleSelectAll: no onSelectionChange handler!');
      return;
    }
    if (selectedItems.size === data.length) {
      console.log('[DataTable] Deselecting all');
      onSelectionChange(new Set());
    } else {
      const allIds = data.map(getItemId);
      console.log('[DataTable] Selecting all:', allIds);
      onSelectionChange(new Set(allIds));
    }
  };

  const getActionButtonClasses = (variant?: string) => {
    const base = 'btn btn-xs';
    switch (variant) {
      case 'primary': return `${base} btn-primary`;
      case 'secondary': return `${base} btn-secondary`;
      case 'success': return `${base} btn-success`;
      case 'error': return `${base} btn-ghost text-error`;
      case 'warning': return `${base} btn-warning`;
      case 'ghost':
      default:
        return `${base} btn-ghost`;
    }
  };

  const defaultEmptyIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="ml-3">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Bulk Actions Bar - only renders when items are selected */}
      {selectable && bulkActions && selectedItems.size > 0 && (
        <div className="bg-base-200 p-4 rounded-t-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="text-sm font-medium">
            {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.onClick(selectedItems)}
                className={`btn btn-sm ${action.variant ? `btn-${action.variant}` : 'btn-primary'} gap-2`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`overflow-x-auto ${className}`}>
        <table className={tableClasses}>
          <thead>
            <tr>
              {selectable && (
                <th className="w-12">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={data.length > 0 && selectedItems.size === data.length}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th key={column.key} className={column.className}>
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon || defaultEmptyIcon}
                    <p className="opacity-60">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => {
                const itemId = getItemId(item);
                const isSelected = selectedItems.has(itemId);

                return (
                  <tr key={itemId || rowIndex} className={selectable ? 'hover' : ''}>
                    {selectable && (
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={isSelected}
                          onChange={() => toggleSelection(itemId)}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className={column.className}>
                        {column.render(item)}
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td>
                        <div className="flex gap-2">
                          {actions.map((action, actionIndex) => {
                            const isDisabled = action.disabled?.(item) || false;
                            const title = typeof action.title === 'function'
                              ? action.title(item)
                              : action.title;
                            const icon = typeof action.icon === 'function'
                              ? action.icon(item)
                              : action.icon;
                            const label = typeof action.label === 'function'
                              ? action.label(item)
                              : action.label;
                            const className = typeof action.className === 'function'
                              ? action.className(item)
                              : action.className;

                            return (
                              <button
                                key={actionIndex}
                                onClick={() => action.onClick(item)}
                                className={className || getActionButtonClasses(action.variant)}
                                disabled={isDisabled}
                                title={title}
                              >
                                {icon}
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

