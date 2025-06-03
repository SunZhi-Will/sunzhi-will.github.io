import { metadata } from './metadata';
import LinksLayout from '@/components/links/LinksLayout';

export { metadata };

export default function RootLinksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LinksLayout>{children}</LinksLayout>;
} 