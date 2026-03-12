import './globals.css';

export const metadata = {
  title: 'FractionBuddy | Logical Practice',
  description: 'A discreet, strategy-based fraction practice tool.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
