import { BottomNav } from '@/widgets';

const ProfilePage = () => {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex-1 p-6 text-white bg-transparent flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white/40 font-sans">Profile Page</h2>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
