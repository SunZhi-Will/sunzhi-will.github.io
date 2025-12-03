import { ThemeProvider } from './ThemeProvider';

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <div className="fixed inset-0 overflow-hidden">
        {children}
      </div>
    </ThemeProvider>
  );
}




