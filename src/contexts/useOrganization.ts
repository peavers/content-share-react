import { useContext } from 'react';
import { OrganizationContext } from './OrganizationContext';

export function useOrganization() {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
    return context;
}