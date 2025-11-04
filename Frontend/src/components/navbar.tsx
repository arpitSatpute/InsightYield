import React from 'react'
import { Link } from '@heroui/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ConnectButton } from "thirdweb/react";
import { client } from "@/config/thirdWeb";
import { createWallet } from "thirdweb/wallets";

const InsightYieldLogo = ({ className }: { className?: string }) => {
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

export const Navbar = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const wallets = [
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
        createWallet("io.rabby"),
        createWallet("io.zerion.wallet"),
    ];
    
    return (
        <header className="pb-16 md:pb-20 lg:pb-16">
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-1 max-w-6xl px-4 transition-all duration-300 lg:px-8', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-2 py-1')}>
                    <div className={cn('relative flex flex-wrap items-center justify-between gap-4 py-2 lg:gap-0 lg:py-3', isScrolled && 'lg:py-1.5')}>
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <InsightYieldLogo />
                            </Link>

                            <div className="flex items-center gap-2 lg:hidden">
                                <ThemeToggle />
                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5">
                                    <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {siteConfig.navItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {siteConfig.navItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:items-center">
                                <ThemeToggle />
                                <div className={cn(isScrolled && 'lg:hidden')}>
                                    <ConnectButton
                                        client={client}
                                        wallets={wallets}
                                        theme="dark"
                                        connectButton={{
                                            label: "Connect",
                                            style: {
                                                backgroundColor: "#242424ff",
                                                borderRadius: "8px",
                                                fontWeight: "400",
                                                transition: "all 0.3s ease",
                                                color: "#fff",
                                            },
                                        }}
                                        connectModal={{
                                            title: "Select a Wallet",
                                            showThirdwebBranding: false,
                                            termsOfServiceUrl: "/terms",
                                            privacyPolicyUrl: "/privacy",
                                        }}
                                    />
                                </div>
                                <div className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <ConnectButton
                                        client={client}
                                        wallets={wallets}
                                        theme="dark"
                                        connectButton={{
                                            label: "Connect",
                                            style: {
                                                backgroundColor: "#242424ff",
                                                borderRadius: "8px",
                                                fontWeight: "400",
                                                transition: "all 0.3s ease",
                                                color: "#fff",
                                            },
                                        }}
                                        connectModal={{
                                            title: "Select a Wallet",
                                            showThirdwebBranding: false,
                                            termsOfServiceUrl: "/terms",
                                            privacyPolicyUrl: "/privacy",
                                        }}
                                    />
                                </div>                               
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

// // Find animations with blur filters and ensure values are >= 0
// const animationVariants = {
//   hidden: {
//     opacity: 0,
//     filter: "blur(10px)" // Ensure blur is positive
//   },
//   visible: {
//     opacity: 1,
//     filter: "blur(0px)" // Not negative values
//   }
// }