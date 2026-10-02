import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "驗證電子報訂閱",
    robots: { index: false, follow: false },
};

export default function VerifyLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
