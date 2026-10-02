'use client'

import type { ReactNode } from "react"
import dynamic from "next/dynamic"

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false })

export function Providers({ children }: { children: ReactNode }) {
    return (
        <>
            <SmoothScroll />
            {children}
        </>
    )
}
