import { usePage } from '@inertiajs/react';

export default function UserInfo() {
  const { props } = usePage();
  const user = props.auth?.user;

  // ✅ Prevent crash if user is null
  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <img
        src={user.avatar ?? 'https://placehold.co/40x40'}
        className="w-8 h-8 rounded-full"
        alt="User Avatar"
      />
      <span>{user.name}</span>
    </div>
  );
}
