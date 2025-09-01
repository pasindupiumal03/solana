import React, { ReactNode } from 'react';

export const metadata = {
  title: 'Next.js App',
  description: 'A default Next.js TypeScript application',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;