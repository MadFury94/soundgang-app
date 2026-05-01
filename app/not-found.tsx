import Link from 'next/link';

// Required for Cloudflare Pages compatibility — prevents Next.js from generating
// a Node.js runtime not-found function when the root layout has server-side logic.
export const runtime = 'edge';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-[#8B9D7F] mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-gray-400 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
                <Link
                    href="/"
                    className="bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
