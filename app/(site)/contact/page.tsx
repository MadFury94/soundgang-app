'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

            setTimeout(() => setSubmitStatus('idle'), 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Page Header */}
            <PageHeader
                title="Contact Us"
                subtitle="Get in touch with the SoundGang team"
                backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
            />

            {/* Contact Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                                Let's Connect
                            </h2>
                            <p className="text-gray-400 text-lg mb-12">
                                Whether you're an artist looking to work with us, a fan with questions,
                                or a partner interested in collaboration, we'd love to hear from you.
                            </p>

                            {/* Contact Cards */}
                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-[#8B9D7F] transition-colors">
                                    <div className="p-3 rounded-full bg-[#8B9D7F]/10">
                                        <Mail className="w-6 h-6 text-[#8B9D7F]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Email</h3>
                                        <a
                                            href="mailto:info@soundgang.com"
                                            className="text-gray-400 hover:text-[#8B9D7F] transition-colors"
                                        >
                                            info@soundgang.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-[#8B9D7F] transition-colors">
                                    <div className="p-3 rounded-full bg-[#8B9D7F]/10">
                                        <Phone className="w-6 h-6 text-[#8B9D7F]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Phone</h3>
                                        <a
                                            href="tel:+2341234567890"
                                            className="text-gray-400 hover:text-[#8B9D7F] transition-colors"
                                        >
                                            +234 123 456 7890
                                        </a>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-[#8B9D7F] transition-colors">
                                    <div className="p-3 rounded-full bg-[#8B9D7F]/10">
                                        <MapPin className="w-6 h-6 text-[#8B9D7F]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Location</h3>
                                        <p className="text-gray-400">
                                            Lagos, Nigeria
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Office Hours */}
                            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-[#8B9D7F]/10 to-transparent border border-[#8B9D7F]/20">
                                <h3 className="text-white font-semibold mb-4">Office Hours</h3>
                                <div className="space-y-2 text-gray-400">
                                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 lg:p-10">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                                Send Us a Message
                            </h2>

                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                    <p className="text-green-400 text-sm">
                                        Thank you for your message! We'll get back to you soon.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-white font-medium mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-black border border-gray-800 text-white placeholder-gray-500 focus:border-[#8B9D7F] focus:outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-white font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-black border border-gray-800 text-white placeholder-gray-500 focus:border-[#8B9D7F] focus:outline-none transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-white font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-black border border-gray-800 text-white placeholder-gray-500 focus:border-[#8B9D7F] focus:outline-none transition-colors"
                                        placeholder="+234 123 456 7890"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-white font-medium mb-2">
                                        Subject
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-black border border-gray-800 text-white focus:border-[#8B9D7F] focus:outline-none transition-colors"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="artist">Artist Collaboration</option>
                                        <option value="booking">Studio Booking</option>
                                        <option value="partnership">Partnership Opportunity</option>
                                        <option value="support">Technical Support</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-white font-medium mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg bg-black border border-gray-800 text-white placeholder-gray-500 focus:border-[#8B9D7F] focus:outline-none transition-colors resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section (Optional) */}
            <section className="py-20 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Find Us
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Visit our studio in the heart of Lagos
                        </p>
                    </div>

                    {/* Placeholder for map - replace with actual map integration */}
                    <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-16 h-16 text-[#8B9D7F] mx-auto mb-4" />
                                <p className="text-gray-400">Map integration coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
