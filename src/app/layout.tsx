import './globals.css';

export const metadata = {
  title: 'Boot Through Time | FOSS Club SIT Timer',
  description: 'Radial Timer & Hacker Countdown for Boot Through Time by FOSS Club SIT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-[#00ff66] min-h-screen overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
