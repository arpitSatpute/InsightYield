import React, { useState, useEffect } from 'react';
import { Globe, Zap, Mail, Linkedin } from 'lucide-react';
import { DiscordIcon, GithubIcon, TwitterIcon } from './icons'; // Ensure these exports exist and are valid React components

export default function Footer() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const socialLinks = [
        { name: 'Twitter', icon: TwitterIcon, url: 'https://twitter.com/arpits_jsx' },
        { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/arpitSatpute' },
        { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/arpitsatpute' },
        { name: 'Discord', icon: DiscordIcon, url: 'https://discord.gg/arpits_15' }
    ];

    const footerSections = {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'Vault Dashboard', href: '#vault' },
            { name: 'Pool Analytics', href: '#pools' },
            { name: 'Pricing', href: '#pricing' }
        ],
        developers: [
            { name: 'Documentation', href: '#docs' },
            { name: 'API Reference', href: '#api' },
            { name: 'Smart Contracts', href: '#contracts' },
            { name: 'GitHub', href: 'https://github.com/arpitSatpute' }
        ],
        company: [
            { name: 'About Us', href: '#about' },
            { name: 'Blog', href: '#blog' },
            { name: 'Careers', href: '#careers' },
            { name: 'Contact', href: '#contact' }
        ],
        support: [
            { name: 'Help Center', href: '#help' },
            { name: 'Community', href: '#community' },
            { name: 'Security', href: '#security' },
            { name: 'Status', href: '#status' }
        ]
    };

    return (
        <div className="bg-background min-h-screen flex flex-col">
            {/* Hero Section */}
            

            {/* Footer */}
            <footer className="border-t bg-background mt-auto">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">Insight Yields</span>
                            </div>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Automated DeFi yield aggregator optimizing returns across multiple protocols. Secure, audited, and transparent.
                            </p>

                            {/* Newsletter */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 text-sm">Stay Updated</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 px-3 py-2 bg-muted border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.name}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 bg-muted hover:bg-muted/80 border rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                                            aria-label={social.name}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Links Grid */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {Object.entries(footerSections).map(([title, links]) => (
                                    <div key={title}>
                                        <h3 className="font-semibold mb-4 text-sm capitalize">{title}</h3>
                                        <ul className="space-y-3">
                                            {links.map((link) => (
                                                <li key={link.name}>
                                                    <a
                                                        href={link.href}
                                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {link.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="bg-muted/30 rounded-xl p-6 mb-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {[
                                { label: 'Total Value Locked', value: '$12.8M+' },
                                { label: 'Active Users', value: '8,429' },
                                { label: 'Average APY', value: '18.42%' },
                                { label: 'Uptime', value: '99.8%' }
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t mb-8" />

                    {/* Bottom Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
                            <p>© 2025 Insight Yields. All rights reserved.</p>
                            <span className="hidden md:block">•</span>
                            <div className="flex items-center gap-3">
                                <a href="#terms" className="hover:text-foreground transition-colors">Terms</a>
                                <span>•</span>
                                <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
                                <span>•</span>
                                <a href="#cookies" className="hover:text-foreground transition-colors">Cookies</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
