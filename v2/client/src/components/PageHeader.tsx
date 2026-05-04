interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
}

export default function PageHeader({ title, subtitle, backgroundImage, backgroundVideo }: PageHeaderProps) {
    return (
        <section className="relative h-[400px] lg:h-[500px] flex items-end justify-center overflow-hidden pt-28">
            {/* Background Video or Image with Overlay */}
            <div className="absolute inset-0">
                {backgroundVideo ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
                ) : backgroundImage ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
                )}
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60" />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B9D7F]/20 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 pb-12">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
