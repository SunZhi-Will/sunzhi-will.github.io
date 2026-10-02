import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "取消訂閱電子報",
    robots: { index: false, follow: false },
};

export default function UnsubscribeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
