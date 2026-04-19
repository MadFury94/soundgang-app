'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/artists', label: 'Artists' },
        { href: '/releases', label: 'Releases' },
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' }
    ];

    return (
        <header className="bg-black text-white border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 z-50">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded flex items-center justify-center">
                            <span className="text-black font-bold text-xl sm:text-2xl">SG</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold tracking-wide">SOUNDGANG</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-base font-medium hover:text-[#8B9D7F] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA Button */}
                    <Link
                        href="/submit"
                        className="hidden sm:block bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold text-sm px-4 lg:px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
                    >
                        SUBMIT MUSIC
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-white hover:text-[#8B9D7F] transition-colors z-50"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-20 bg-black/95 backdrop-blur-sm z-40">
                    <nav className="flex flex-col items-center justify-center h-full gap-8 px-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-semibold hover:text-[#8B9D7F] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/submit"
                            onClick={() => setMobileMenuOpen(false)}
                            className="bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold text-lg px-8 py-4 rounded-lg transition-colors mt-4"
                        >
                            SUBMIT MUSIC
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
