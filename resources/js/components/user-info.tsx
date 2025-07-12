import { User } from '@/types';

interface UserInfoProps {
    user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
    return (
        <div className="flex items-center gap-2">
            <img src={user.avatar ?? 'https://placehold.co/40x40'} className="h-8 w-8 rounded-full" alt="User Avatar" />
            <span>{user.name}</span>
        </div>
    );
}
