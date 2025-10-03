import React, {useState} from 'react';
import {useOrganization} from '../../contexts';
import {Select, Textarea, TextInput} from '../forms';
import type {CreateOrganizationRequest} from "../../generated";
import {CreateOrganizationRequestVisibilityEnum, InviteMemberRequestRoleEnum} from "../../generated";

interface CreateOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (organization: any) => void;
}

export function CreateOrganizationModal({isOpen, onClose, onSuccess}: CreateOrganizationModalProps) {
    const {createOrganization} = useOrganization();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        avatarUrl: '',
        websiteUrl: '',
        visibility: CreateOrganizationRequestVisibilityEnum.Private,
        plan: 'basic',
        settings: {},
        inviteEmails: [],
        inviteRoles: []
    });

    const [inviteList, setInviteList] = useState<Array<{ email: string; role: InviteMemberRequestRoleEnum }>>([]);

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                description: '',
                avatarUrl: '',
                websiteUrl: '',
                visibility: CreateOrganizationRequestVisibilityEnum.Private,
                plan: 'basic',
                settings: {},
                inviteEmails: [],
                inviteRoles: []
            });
            setInviteList([]);
            setError(null);
        }
    }, [isOpen]);


    const addInvite = () => {
        setInviteList(prev => [...prev, {email: '', role: InviteMemberRequestRoleEnum.Member}]);
    };

    const updateInvite = (index: number, field: 'email' | 'role', value: string | InviteMemberRequestRoleEnum) => {
        setInviteList(prev => prev.map((invite, i) =>
            i === index ? {...invite, [field]: value} : invite
        ));
    };

    const removeInvite = (index: number) => {
        setInviteList(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            // Prepare final form data
            const validInvites = inviteList.filter(invite => invite.email.trim());
            const finalData: CreateOrganizationRequest = {
                ...formData,
                inviteEmails: validInvites.map(invite => invite.email),
                inviteRoles: validInvites.map(invite => invite.role)
            };

            const newOrg = await createOrganization(finalData);
            onSuccess?.(newOrg);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create organization');
        } finally {
            setLoading(false);
        }
    };

    const canCreateOrganization = formData.name.trim();

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box p-0 overflow-hidden"
                 style={{width: '85vw', maxWidth: '85vw', height: '85vh', maxHeight: '85vh'}}>
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-content">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Create Your Organization</h2>
                            <p className="text-base-content/80 text-sm">Set up your organization and invite your
                                team</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="btn btn-sm btn-circle btn-ghost text-primary-content hover:bg-base-content/20"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content Area - Two Column Layout */}
                <div className="flex h-[calc(85vh-180px)] overflow-hidden">
                    {/* Left Column - Organization Details */}
                    <div className="flex-1 p-8 overflow-y-auto border-r border-base-300">
                        <div className="max-w-2xl">
                            <h3 className="text-xl font-semibold mb-6">Organization Details</h3>

                            {error && (
                                <div className="alert alert-error mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6"
                                         fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-6">
                                <TextInput
                                    label="Organization Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                                    placeholder="Acme Corporation"
                                    required
                                />

                                <Textarea
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                    rows={6}
                                    placeholder="Tell us about your organization..."
                                    showCharCount
                                    maxCharCount={500}
                                />

                                <div className="alert">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         className="stroke-current shrink-0 w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span className="text-sm">You'll be automatically added as the organization owner with full permissions.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Team Invites */}
                    <div className="flex-1 p-8 overflow-y-auto bg-base-50">
                        <div className="max-w-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold">Invite Team Members</h3>
                                <span
                                    className="badge badge-lg">{inviteList.filter(i => i.email.trim()).length} Invited</span>
                            </div>

                            <div className="alert alert-info mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     className="stroke-current shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-sm">Optional: You can invite team members now or do it later from your organization settings.</span>
                            </div>

                            <div className="space-y-4">
                                {inviteList.length > 0 ? (
                                    <div className="space-y-3">
                                        {inviteList.map((invite, index) => (
                                            <div key={index} className="flex gap-3 items-center w-full">
                                                <div className="flex-1">
                                                    <TextInput
                                                        type="email"
                                                        value={invite.email}
                                                        onChange={(e) => updateInvite(index, 'email', e.target.value)}
                                                        placeholder="colleague@example.com"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Select
                                                        value={invite.role}
                                                        onChange={(e) => updateInvite(index, 'role', e.target.value as InviteMemberRequestRoleEnum)}
                                                        options={[
                                                            {
                                                                value: InviteMemberRequestRoleEnum.Member,
                                                                label: 'Member'
                                                            },
                                                            {value: InviteMemberRequestRoleEnum.Admin, label: 'Admin'},
                                                        ]}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeInvite(index)}
                                                    className="btn btn-ghost btn-sm btn-square text-error"
                                                    title="Remove"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        className="text-center py-16 border-2 border-dashed border-base-300 rounded-lg bg-base-100">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="h-16 w-16 mx-auto mb-4 opacity-20" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                        </svg>
                                        <p className="text-base-content/60 mb-2">No team members invited yet</p>
                                        <p className="text-sm text-base-content/40">Click the button below to start
                                            inviting your team</p>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={addInvite}
                                    className="btn btn-primary btn-block gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 4v16m8-8H4"/>
                                    </svg>
                                    Add Team Member
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-base-300 px-6 py-4 bg-base-100 flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !canCreateOrganization}
                        className="btn btn-primary px-6"
                    >
                        {loading && <span className="loading loading-spinner"></span>}
                        {loading ? 'Creating Organization...' : 'Create Organization'}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
