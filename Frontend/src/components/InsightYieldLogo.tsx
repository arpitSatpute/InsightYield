import React from "react"
import { cn } from '@/lib/utils'


export default function InsightYieldLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('h-12 w-auto', className)}>
            <g>
                <circle cx="16" cy="24" r="1.5" fill="url(#gradient-primary)" />
                <circle cx="24" cy="18" r="1.5" fill="url(#gradient-primary)" />
                <circle cx="32" cy="12" r="1.5" fill="url(#gradient-primary)" />
                
                <path d="M 16 24 L 24 18 L 32 12" stroke="url(#gradient-primary)" strokeWidth="1.2" strokeLinecap="round" />
                
                <circle cx="16" cy="24" r="2.5" fill="none" stroke="url(#gradient-secondary)" strokeWidth="0.8" opacity="0.6" />
                <circle cx="24" cy="18" r="2.5" fill="none" stroke="url(#gradient-secondary)" strokeWidth="0.8" opacity="0.6" />
                <circle cx="32" cy="12" r="2.5" fill="none" stroke="url(#gradient-secondary)" strokeWidth="0.8" opacity="0.6" />
                
                <path d="M 24 6 Q 24 4 26 4 Q 28 4 28 6 L 28 8 Q 28 9 26.5 9 Q 25 9 25 8 Z" fill="url(#gradient-primary)" />
                <line x1="25.5" y1="9" x2="26.5" y2="11" stroke="url(#gradient-primary)" strokeWidth="0.8" strokeLinecap="round" />
            </g>

            <text x="44" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="600" fill="currentColor" letterSpacing="-0.3">
                InsightYield
            </text>

            <defs>
                <linearGradient id="gradient-primary" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#9B99FE" />
                    <stop offset="100%" stopColor="#2BC8B7" />
                </linearGradient>
                <linearGradient id="gradient-secondary" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2BC8B7" />
                    <stop offset="100%" stopColor="#9B99FE" />
                </linearGradient>
            </defs>
        </svg>
    )
}
