import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    count: number | string;
    href?: string;
}

export default function StatCard({ icon: Icon, label, count }: StatCardProps) {
    return (
        <div className="bg-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#8B9D7F22' }}
            >
                <Icon className="w-6 h-6" style={{ color: '#8B9D7F' }} />
            </div>
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-white text-2xl font-bold mt-0.5">{count}</p>
            </div>
        </div>
    );
}
