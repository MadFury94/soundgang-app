'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Become solid once user scrolls past 80px
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/artists', label: 'Artists' },
        { href: '/releases', label: 'Releases' },
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const handleMobileNavClick = (href: string) => {
        setMobileMenuOpen(false);
        setTimeout(() => router.push(href), 150);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 text-white transition-all duration-300 ${scrolled
                    ? 'bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg'
                    : 'bg-transparent border-b border-transparent'
                }`}
        >
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
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden p-2 text-white hover:text-[#8B9D7F] transition-colors z-50"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-gray-950"
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Slide-in panel from right */}
                <div
                    className={`absolute top-0 right-0 h-full w-72 bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                        <Image
                            src="/soundgang-logo.png"
                            alt="SoundGang Logo"
                            width={60}
                            height={60}
                            className="w-12 h-12 object-contain"
                        />
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => handleMobileNavClick(link.href)}
                                className={`text-left text-base font-medium px-4 py-3 rounded-lg transition-colors ${isActive(link.href)
                                        ? 'text-[#8B9D7F] bg-[#8B9D7F]/10'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* CTA at bottom */}
                    <div className="px-4 pb-8">
                        <button
                            onClick={() => handleMobileNavClick('/submit')}
                            className="block w-full text-center bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold text-sm px-6 py-3.5 rounded-lg transition-colors"
                        >
                            SUBMIT MUSIC
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
