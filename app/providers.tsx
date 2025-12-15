'use client'

import { NextUIProvider } from "@heroui/react"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
} 