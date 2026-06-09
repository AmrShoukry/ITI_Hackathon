import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'ShareRental - Item Rental Marketplace',
  description: 'Rent items from other users instead of buying them.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
