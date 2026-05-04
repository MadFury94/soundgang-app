export default function WaveDivider() {
    return (
        <div className="w-full overflow-hidden leading-none relative">
            <svg
                className="w-full h-4 md:h-5"
                viewBox="0 0 1440 20"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B9D7F" stopOpacity="0" />
                        <stop offset="15%" stopColor="#8B9D7F" stopOpacity="1" />
                        <stop offset="85%" stopColor="#8B9D7F" stopOpacity="1" />
                        <stop offset="100%" stopColor="#8B9D7F" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,10 Q360,2 720,10 T1440,10"
                    stroke="url(#waveGradient)"
                    strokeWidth="2"
                    fill="none"
                />
            </svg>
        </div>
    );
}
