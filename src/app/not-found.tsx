import Link from 'next/link';
import { ROUTES } from '@/shared/config';

const NotFoundPage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-white/10 mb-4">404</h1>
        <p className="text-lg text-white/50 mb-6">Page not found</p>
        <Link
          href={ROUTES.GAME}
          className="inline-flex h-9 items-center gap-2 bg-gradient-to-r from-success to-success-end rounded-lg px-4 text-sm text-white font-medium hover:opacity-90 transition-opacity"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Back to Game
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
