import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

interface Props {
  subtitle: string;
  children: ReactNode;
}

export const AuthCard = ({ subtitle, children }: Props) => {
  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[448px]">
        <Card variant="login">
          <CardHeader className="flex flex-col items-center justify-center p-0 mb-[32px] text-center">
            <div className="w-[64px] h-[64px] rounded-full bg-gradient-to-br from-brand-green-start to-brand-green-end flex items-center justify-center shadow-lg mb-4">
              <div className="w-[26.67px] h-[26.67px] rounded-full border-[2.67px] border-white flex items-center justify-center">
                <div className="w-[8px] h-[8px] rounded-full bg-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white leading-none m-2">Plinko</h1>
            <p className="text-base text-[#99A1AF]">{subtitle}</p>
          </CardHeader>
          <CardContent className="p-0">{children}</CardContent>
        </Card>
        <p className="text-center text-xs text-[#99A1AF] mt-4">
          By continuing, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </main>
  );
};
