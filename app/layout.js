import { UserProvider } from '@/context/UserContext';
import { LeaderboardProvider } from '@/context/LeaderboardContext';
import './globals.css';

export const metadata = {
  title: 'PANDA WORDS - เกมภาษาจีน',
  description: 'เรียนรู้ภาษาจีนผ่านเกมสนุกๆ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <UserProvider>
            <LeaderboardProvider>
              {children}
            </LeaderboardProvider>
        </UserProvider>
      </body>
    </html>
  );
}