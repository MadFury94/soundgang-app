'use client';

import { useState } from 'react';
import WaveDivider from './WaveDivider';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log('Subscribe:', email);
        setEmail('');
    };

    return (
        <section className="bg-black text-white">
            {/* Top Wave Divider */}
            <WaveDivider />

            <div className="py-20 lg:py-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Section Header */}
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Get the latest releases and news from SoundGang
                    </p>

                    {/* Newsletter Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="flex-1 px-6 py-4 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F] transition-colors"
                        />
                        <button
                            type="submit"
                            className="px-8 py-4 bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                            SUBSCRIBE
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
