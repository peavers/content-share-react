import React from 'react';

interface AvatarProps {
    name: string;
    avatarUrl?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    rounded?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl, size = 'md' }) => {
    const sizeClasses = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-32 h-32 text-5xl'
    };

    const initial = name ? name.charAt(0).toUpperCase() : '?';

    return (
        <div className="avatar">
            <div className={`${sizeClasses[size]} overflow-hidden rounded-lg`}>
                {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                        <span>{initial}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Avatar;