import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '最後一場放映 - 偵探遊戲',
  description: '當燈亮起，當人群開始移動，那一刻，所有人都最脆弱。',
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

