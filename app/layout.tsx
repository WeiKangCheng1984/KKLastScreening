import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FME異物入侵 - 密室逃脫',
  description: '你不是來扮演誰的。你只是走進了一個還沒有被做出最後決定的地方。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-dark-bg text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}

