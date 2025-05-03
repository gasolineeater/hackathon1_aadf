import React from 'react';
import AnimatedNavbar from './AnimatedNavbar';
import AnimatedFooter from './AnimatedFooter';
import ClientWrapper from './ClientWrapper';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <ClientWrapper>
      <div className="min-h-screen flex flex-col">
        <AnimatedNavbar />
        <main className="flex-grow">{children}</main>
        <AnimatedFooter />
      </div>
    </ClientWrapper>
  );
}
