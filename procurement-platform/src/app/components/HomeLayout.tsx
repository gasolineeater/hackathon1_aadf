import React from 'react';
import AnimatedNavbar from './AnimatedNavbar';
import AnimatedFooter from './AnimatedFooter';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedNavbar />
      <main className="flex-grow">{children}</main>
      <AnimatedFooter />
    </div>
  );
}
