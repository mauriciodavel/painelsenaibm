import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Painel de Horários',
  description: 'Painel de horários de aula responsivo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
