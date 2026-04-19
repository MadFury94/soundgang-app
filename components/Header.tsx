'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/artists', label: 'Artists' },
        { href: '/releases', label: 'Releases' },
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' }
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <header className="bg-gray-900/95 backdrop-blur-sm text-white border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-28">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 z-50">
                        <Image
                            src="/soundgang-logo.png"
                            alt="SoundGang Logo"
                            width={100}
                            height={100}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative text-lg font-medium hover:text-[#8B9D7F] transition-colors group"
                            >
                                {link.label}
                                <span
                                    className={`absolute -bottom-[37px] left-0 right-0 h-0.5 bg-[#8B9D7F] transition-opacity ${isActive(link.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                                        }`}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA Button */}
                    <Link
                        href="/submit"
                        className="hidden sm:block bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold text-base px-5 lg:px-7 py-3.5 rounded-lg transition-colors whitespace-nowrap"
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
                <div className="lg:hidden fixed inset-0 top-28 bg-gray-900/98 backdrop-blur-md z-40">
                    <nav className="flex flex-col items-center justify-center h-full gap-8 px-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-2xl font-semibold transition-colors ${isActive(link.href) ? 'text-[#8B9D7F]' : 'hover:text-[#8B9D7F]'
                                    }`}
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
